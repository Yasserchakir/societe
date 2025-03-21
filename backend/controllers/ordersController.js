const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId)
      .select("quantiteDisponible nomProduit prixTotal prixUnitaire tva imageUrl"); // Include prixUnitaire and tva for fallback
    if (!product || product.quantiteDisponible < quantity) {
      return res.status(400).json({ message: "Product unavailable or insufficient stock" });
    }

    let cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { updatedAt: Date.now() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      if (cart.items[existingItemIndex].quantity > product.quantiteDisponible) {
        cart.items[existingItemIndex].quantity = product.quantiteDisponible;
      }
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product", "nomProduit prixTotal prixUnitaire tva imageUrl quantiteDisponible"); // Ensure all fields
    console.log("Cart updated with prices:", {
      cartItems: cart.items.map(item => ({
        productId: item.product?._id,
        nomProduit: item.product?.nomProduit,
        prixTotal: item.product?.prixTotal,
        prixUnitaire: item.product?.prixUnitaire,
        tva: item.product?.tva,
        quantity: item.quantity
      }))
    });
    res.json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "nomProduit prixTotal prixUnitaire tva imageUrl quantiteDisponible"); // Ensure all fields
    
    if (!cart || cart.items.length === 0) {
      console.log("No cart or empty cart for user:", req.user._id);
      return res.json({ items: [] });
    }

    // Filter out items with null products or invalid prices
    const validItems = cart.items.filter(item => {
      const product = item.product;
      return product !== null && (
        (product.prixTotal && product.prixTotal > 0) || 
        (product.prixUnitaire && product.tva)
      );
    });
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
      console.log("Filtered out invalid items from cart:", cart);
    }

    console.log("Cart fetched with prices:", validItems.map(item => ({
      productId: item.product?._id,
      nomProduit: item.product?.nomProduit,
      prixTotal: item.product?.prixTotal,
      prixUnitaire: item.product?.prixUnitaire,
      tva: item.product?.tva,
      quantity: item.quantity
    })));
    res.json({ items: validItems }); // Return only valid items
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    await cart.populate("items.product", "nomProduit prixTotal prixUnitaire tva imageUrl quantiteDisponible"); // Ensure all fields
    console.log("Cart after removal:", cart);
    res.json(cart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Error removing from cart", error });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: "Item not found in cart" });

    const product = await Product.findById(productId)
      .select("quantiteDisponible prixUnitaire tva prixTotal"); // Ensure all fields
    if (!product || product.quantiteDisponible < quantity) {
      return res.status(400).json({ message: "Insufficient stock or product not found" });
    }

    // Ensure prixTotal is valid, fallback to calculation if needed
    if (!product.prixTotal || product.prixTotal <= 0) {
      product.prixTotal = product.prixUnitaire + (product.prixUnitaire * (product.tva || 0) / 100);
      await product.save();
      console.log("Updated product price:", product);
    }

    cart.items[itemIndex].quantity = Math.min(quantity, product.quantiteDisponible);
    if (cart.items[itemIndex].quantity <= 0) cart.items.splice(itemIndex, 1);

    await cart.save();
    await cart.populate("items.product", "nomProduit prixTotal prixUnitaire tva imageUrl quantiteDisponible"); // Ensure all fields
    console.log("Cart quantity updated with prices:", {
      cartItems: cart.items.map(item => ({
        productId: item.product?._id,
        nomProduit: item.product?.nomProduit,
        prixTotal: item.product?.prixTotal,
        prixUnitaire: item.product?.prixUnitaire,
        tva: item.product?.tva,
        quantity: item.quantity
      }))
    });
    res.json(cart);
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ message: "Error updating cart quantity", error });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "prixTotal quantiteDisponible nomProduit vendeur prixUnitaire tva"); // Ensure all fields

    console.log("Cart before placing order:", {
      cart: cart,
      items: cart?.items.map(item => ({
        productId: item.product?._id,
        nomProduit: item.product?.nomProduit,
        prixTotal: item.product?.prixTotal,
        prixUnitaire: item.product?.prixUnitaire,
        tva: item.product?.tva,
        quantity: item.quantity
      }))
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalPrice = 0;
    const orderProducts = [];

    for (const item of cart.items) {
      if (!item.product || item.product.quantiteDisponible < item.quantity) {
        return res.status(400).json({ message: `Invalid product or insufficient stock for ${item.product?.nomProduit || "unknown"}` });
      }
      const itemPrice = item.product.prixTotal || (item.product.prixUnitaire + (item.product.prixUnitaire * (item.product.tva || 0) / 100));
      const itemTotal = itemPrice * item.quantity;
      if (isNaN(itemTotal) || itemTotal <= 0) {
        return res.status(400).json({ message: `Invalid price calculation for ${item.product.nomProduit} (prixTotal: ${item.product.prixTotal}, prixUnitaire: ${item.product.prixUnitaire}, tva: ${item.product.tva})` });
      }
      totalPrice += itemTotal;
      orderProducts.push({
        product: item.product._id,
        quantity: item.quantity,
        price: itemPrice,
      });

      item.product.quantiteDisponible -= item.quantity;
      await item.product.save();
    }

    const order = new Order({
      user: req.user._id,
      products: orderProducts,
      totalPrice,
    });

    await order.save();
    await Cart.deleteOne({ user: req.user._id }); // Clear cart completely
    console.log("Order placed and cart cleared:", {
      orderId: order._id,
      totalPrice: order.totalPrice,
      products: order.products
    });
    res.status(201).json(order);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
};

exports.getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;
    console.log("Fetching orders for vendor ID:", vendorId, "with role:", req.user.role);

    // Check if user is a Vendeur, otherwise return 403
    if (req.user.role !== "Vendeur") {
      return res.status(403).json({ message: "Only vendors can access orders" });
    }

    const orders = await Order.find()
      .populate("user", "name prenom email telephone city")
      .populate("products.product", "nomProduit vendeur prixTotal prixUnitaire tva")
      .lean();

    console.log("All orders with user and product data:", orders.map(order => ({
      orderId: order._id,
      user: order.user,
      products: order.products.map(p => ({
        productId: p.product?._id || "null",
        vendeur: p.product?.vendeur?.toString() || "null",
        price: p.price,
        prixTotal: p.product?.prixTotal,
        prixUnitaire: p.product?.prixUnitaire,
        tva: p.product?.tva
      }))
    })));

    const vendorOrders = orders.filter(order => {
      const hasVendorProduct = order.products.some(product => 
        product.product && product.product.vendeur && product.product.vendeur.toString() === vendorId.toString()
      );
      console.log(`Order ${order._id} has vendor products:`, hasVendorProduct);
      return hasVendorProduct;
    });

    console.log("Filtered vendor orders:", vendorOrders);

    if (vendorOrders.length === 0) {
      return res.json({ message: "Aucune commande trouvée pour ce vendeur.", items: [] });
    }

    res.json(vendorOrders);
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({ message: "Error fetching vendor orders", error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, vendorStatus } = req.body;
    const vendorId = req.user._id;

    const order = await Order.findById(orderId)
      .populate("products.product", "vendeur");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const hasVendorProduct = order.products.some(p => 
      p.product && p.product.vendeur && p.product.vendeur.toString() === vendorId.toString()
    );
    if (!hasVendorProduct) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    order.vendorStatus = vendorStatus;
    if (vendorStatus === "Rejected") order.status = "Cancelled";
    else if (vendorStatus === "Accepted" && order.status === "Cancelled") order.status = "Pending";
    await order.save();
    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status", error });
  }
};

module.exports = exports;
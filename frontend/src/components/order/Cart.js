import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../pages/CartContext";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateCartQuantity, placeOrder } = useContext(CartContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  const calculatePrice = (product) => {
    if (product.prixTotal && product.prixTotal > 0) return product.prixTotal;
    if (product.prixUnitaire && product.tva) {
      return product.prixUnitaire + (product.prixUnitaire * (product.tva / 100));
    }
    return 0;
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity, 10) || 1);
    const item = cart.items.find((item) => item.product._id === productId);
    if (item && item.product.quantiteDisponible < quantity) {
      setNotification({
        message: `Quantité maximale disponible : ${item.product.quantiteDisponible}`,
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    updateCartQuantity(productId, quantity);
  };

  const handleDelete = (productId, productName) => {
    removeFromCart(productId);
    setNotification({
      message: `${productName} supprimé du panier !`,
      type: "deleted",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCheckout = async () => {
    try {
      await placeOrder();
      setNotification({
        message: "Commande passée avec succès !",
        type: "success",
      });
      setTimeout(() => {
        setNotification(null);
        navigate("/shop");
      }, 3000);
    } catch (error) {
      setNotification({
        message: "Erreur lors de la validation de la commande.",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const validItems = cart.items.filter((item) => item.product !== null);
  const total = validItems.reduce((sum, item) => {
    const itemPrice = calculatePrice(item.product);
    return sum + itemPrice * item.quantity;
  }, 0);

  return (
    <div className="cart-modern">
      <h1 className="cart-title-modern">Votre Panier</h1>
      {notification && (
        <div className={`notification-modern ${notification.type}`}>
          <span>{notification.message}</span>
          <div className="notification-progress-modern"></div>
        </div>
      )}
      {validItems.length === 0 ? (
        <p className="empty-cart-modern">Votre panier est vide.</p>
      ) : (
        <>
          <div className="cart-items-modern">
            {validItems.map((item) => (
              <div key={item.product._id} className="cart-item-modern">
                <img
                  src={
                    item.product.imageUrl && item.product.imageUrl[0]
                      ? `http://localhost:5000${item.product.imageUrl[0]}`
                      : "http://localhost:5000/uploads/default.jpg"
                  }
                  alt={item.product.nomProduit}
                  className="cart-item-image-modern"
                  onError={(e) => (e.target.src = "http://localhost:5000/uploads/default.jpg")}
                />
                <div className="cart-item-details-modern">
                  <h2>{item.product.nomProduit}</h2>
                  <p className="stock-modern">
                    Stock disponible : <span>{item.product.quantiteDisponible}</span>
                  </p>
                  <div className="quantity-control-modern">
                    <button
                      className="quantity-btn-modern"
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                    >
                      <i className="fas fa-minus">-</i>
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      max={item.product.quantiteDisponible}
                      onChange={(e) => handleQuantityChange(item.product._id, e.target.value)}
                      className="quantity-input-modern"
                    />
                    <button
                      className="quantity-btn-modern"
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                    >
                      <i className="fas fa-plus">+</i>
                    </button>
                  </div>
                  <p>
                    Prix unitaire: <span>{calculatePrice(item.product).toFixed(2)} €</span>
                  </p>
                  <p>
                    Total: <span>{(calculatePrice(item.product) * item.quantity).toFixed(2)} €</span>
                  </p>
                  <button
                    className="delete-btn-modern"
                    onClick={() => handleDelete(item.product._id, item.product.nomProduit)}
                  >
                    <i className="fas fa-trash-alt"></i> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary-modern">
            <h3>Total: <span>{total.toFixed(2)} €</span></h3>
            <button className="checkout-btn-modern" onClick={handleCheckout}>
              <i className="fas fa-check-circle"></i> Valider la Commande
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
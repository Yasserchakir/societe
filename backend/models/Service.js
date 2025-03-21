const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  servicename: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  availability: { type: String, enum: ['ouvert', 'fermé'], required: true },
  price: { type: Number, required: true, min: 0 },
  tva: { type: Number, required: true, enum: [0, 7, 13, 19] },
  priceTotal: { type: Number, min: 0 },
  promotionActive: { type: Boolean, default: false },
  reduction: { type: Number, min: 0, max: 100 },
  finalPrice: { type: Number, min: 0 },
  state: { type: String, enum: ['à faire', 'en cours', 'terminé'], default: 'à faire' },
  media: [{ type: String }],
  addDate: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  idFamille: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilleService', required: true },
  idSecteur: { type: mongoose.Schema.Types.ObjectId, ref: 'SecteurService', required: true },
  availableTimeSlots: [{
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g., "14:00"
    endTime: { type: String, required: true },   // e.g., "15:00"
    isBooked: { type: Boolean, default: false }
  }]
}, { timestamps: true });

ServiceSchema.pre('validate', function(next) {
  const price = Number(this.price) || 0;
  const tva = Number(this.tva) || 0;
  const reduction = this.promotionActive && this.reduction ? Number(this.reduction) || 0 : 0;

  this.priceTotal = price + (price * tva / 100);
  this.finalPrice = this.promotionActive && reduction
    ? this.priceTotal - (this.priceTotal * reduction / 100)
    : this.priceTotal;
  next();
});

/* ServiceSchema.methods.bookTimeSlot = async function(timeSlot) {
  const slot = this.availableTimeSlots.find(s =>
    s.date.toISOString() === new Date(timeSlot.date).toISOString() &&
    s.startTime === timeSlot.startTime &&
    s.endTime === timeSlot.endTime
  );
  if (!slot) throw new Error('Time slot not available');
  if (slot.isBooked) throw new Error('Time slot already booked');
  slot.isBooked = true;
  await this.save();
  return timeSlot;
}; */

module.exports = mongoose.model('Service', ServiceSchema);
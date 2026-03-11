const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  category: {
    type: String, // 'sweet', 'sugar-free', 'international', 'gift-pack'
    required: true,
  },
  image: {
    type: String, // URL to image
  },
  isGiftPack: {
    type: Boolean,
    default: false,
  },
  weights: [{
    weight: String, // '250g', '500g', '1kg'
    multiplier: Number, // 1 for 250g, 2 for 500g, 4 for 1kg (or specific price)
  }],
  isCustomizable: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    default: 50,
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

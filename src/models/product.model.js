const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  category: String,
  thumbnails: [String],
}, {
  timestamps: true,
});

productSchema.plugin(paginate);

module.exports = mongoose.model('Product', productSchema);
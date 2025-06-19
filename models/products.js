import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  altNames: {
    type: [String],
    default: [],
  },

  labelledPrice: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  images: {
    type: [String],
    default: ["/default img"],
  },

  description: {
    type: String,
    required: true,
  },

  stock: {
    type: Number,
    default: 0,
  },

  isAvailable: {
    type: Boolean,
    default: true,
  },

  category: {
    type: String,
    default: "cosmatics",
  },
});

const Product = mongoose.model("products", productSchema);
export default Product;

import express from "express";
import {
  createProduct,
  deleteProducts,
  getProductInfo,
  getProducts,
  updateProduct,
} from "./controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
productRouter.delete("/:productId", deleteProducts);
productRouter.put("/:productId", updateProduct);
productRouter.get("/:productId", getProductInfo);

export default productRouter;

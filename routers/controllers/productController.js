import Product from "../../models/products.js";
import { isAdmin } from "./userControllers.js";

export async function createProduct(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({
      message: "Access denied. admins only can accessible",
    });
  }
  const product = new Product(req.body);

  try {
    const response = await product.save();
    res.json({
      message: "product created sucessfuly",
      product: response,
    });
  } catch (error) {
    console.error("error creating product : ", error);
    return res.status(500).json({
      message: "failed to create product",
    });
  }
}

export async function getProducts(req, res) {
  try {
    if (isAdmin(req)) {
      const products = await Product.find();
      return res.json(products);
    } else {
      const products = await Product.find({ isAvailable: true });
      return res.json(products);
    }
  } catch (error) {
    console.error("Error fetching products: ", error);
    return res.status(500).json({
      message: "Failed to fetch the product",
    });
  }
}

export async function deleteProducts(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "Acess denied",
    });
    return;
  }

  try {
    const productId = req.params.productId;

    await Product.deleteOne({
      productId: productId,
    });

    res.json({
      message: "product deleted sucessfuly",
    });
  } catch (error) {
    res.status(404).json({
      message: "Product not found",
    });
    return;
  }
}

export async function updateProduct(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "Acess denied",
    });
    return;
  }

  const data = req.body;
  const productId = req.params.productId;
  data.productId = productId;

  try {
    await Product.updateOne(
      {
        productId: productId,
      },
      data
    );
    res.json({
      message: "product updated succesfuly",
    });
  } catch (error) {
    res.status(404).json({
      message: "Product not found",
    });
    return;
  }
}

export async function getProductInfo(req, res) {
  try {
    const productId = req.params.productId;
    const product = await Product.findOne({ productId: productId });

    if (product == null) {
      res.status(404).json({
        message: "product not found",
      });
      return;
    }

    if (isAdmin(req)) {
      res.json(product);
    } else {
      if (product.isAvailable) {
        res.json(product);
      } else {
        res.status(404).json({
          message: "product is not available",
        });
      }
    }
    return;
  } catch (error) {
    res.status(404).json({
      message: "Product not found",
    });
    return;
  }
}

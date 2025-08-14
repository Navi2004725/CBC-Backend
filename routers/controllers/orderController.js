import Order from "../../models/order.js";
import Product from "../../models/products.js";
import { isAdmin } from "./userControllers.js";

export async function createOrder(req, res) {
  try {
    if (req.user == null) {
      res.status(401).json({
        message: "Please login to create an order",
      });
      return;
    }
    //CBC00202

    const latestOrder = await Order.find().sort({ date: -1 }).limit(1);

    let orderID = "CBC00202";

    if (latestOrder.length > 0) {
      //if order exists, // "CBC00635"
      const lastOrderIdString = latestOrder[0].orderID; //"CBC00635"
      const lastorderIdWithoutPrefix = lastOrderIdString.replace("CBC", ""); // "00635"
      const lastOrderIdNumber = parseInt(lastorderIdWithoutPrefix); // 635
      const newOrderIdNumber = lastOrderIdNumber + 1; // 636
      const newOrderIdwithoutPrefix = newOrderIdNumber.toString().padStart(5, "0"); // "00636"
      orderID = "CBC" + newOrderIdwithoutPrefix; // "CBC00636
    }

    const items = [];
    let total = 0;
    //check if items are provided and it is an array
    if (req.body.items != null && Array.isArray(req.body.items)) {
      for (let i = 0; i < req.body.items.length; i++) {
        let item = req.body.items[i];
        let product = await Product.findOne({ productId: item.productId });
        if (product == null) {
          return res.status(404).json({
            message: `Product with ID ${item.productId} not found`,
          });
        }
        items[i] = {
          productId: product.productId,
          name: product.name,
          image: product.images[0],
          price: product.price,
          qty: item.qty,
        };
        total += product.price * item.qty;
      }
    } else {
      res.status(400).json({
        message: "Items are required to create an order",
      });
      return;
    }

    const order = new Order({
      orderID: orderID,
      email: req.user.email,
      name: req.user.firstName + " " + req.user.lastName,
      address: req.body.address,
      phone: req.body.phone,
      items: items,
      total: total,
    });

    const result = await order.save();

    res.json({
      message: "Order created successfully",
      order: result,
    });
  } catch (error) {
    console.error("Error creating order: ", error);
    res.status(500).json({
      message: "Failed to create order",
    });
  }
}

export async function getOrder(req, res) {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 10;

  if (req.user == null) {
    res.status(401).json({
      message: "Please login to view orders",
    });
    return;
  }
  try {
    if (req.user.role === "admin") {
      const ordersCount = await Order.countDocuments();
      const totalPages = Math.ceil(ordersCount / limit);
      const orders = await Order.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ date: -1 });
      res.json({
        orders: orders,
        totalPages: totalPages,
      });
    } else {
      const ordersCount = await Order.countDocuments({ email: req.user.email });
      const totalPages = Math.ceil(ordersCount / limit);
      const order = await Order.findOne({ email: req.user.email })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ date: -1 });
      res.json({
        orders: order,
        totalPages: totalPages,
      });
    }
  } catch (error) {
    console.error("Error fetching order: ", error);
    res.status(500).json({
      message: "Failed to fetch order",
    });
  }
}

export function updateOrder(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "Please login to update an order",
    });
    return;
  }

  if (!isAdmin(req)) {
    res.status(403).json({
      message: "You are not authorized to update this order",
    });
    return;
  }

  const orderID = req.params.orderID;
  const status = req.body.status;
  const notes = req.body.notes;

  Order.findOneAndUpdate({ orderID: orderID }, { status: status, notes: notes }, { new: true })
    .then((order) => {
      if (order == null) {
        res.status(404).json({
          message: "Order not found",
        });
        return;
      }
      res.json({
        message: "Order updated successfully",
        order: order,
      });
    })
    .catch((error) => {
      console.error("Error updating order: ", error);
      res.status(500).json({
        message: "Failed to update order",
      });
    });
}

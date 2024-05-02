import express from "express";
const router = express.Router();
import { ReqError } from "../util/errorHandler.mjs";
import {
  getOrders,
  getOrdersCategory,
  addOrder,
  getOrder,
  deleteOrder,
} from "../util/dbOrdersQueries.mjs";

router.all("/", (req, res) => {
  if (req.method === "GET") {
    const { product } = req.query;

    if (product) {
      const data = getOrdersCategory(product.toLowerCase());

      if (data.length === 0) {
        throw new ReqError(404, `Product '${product}' doesn't exist.`);
        // // Product not found in the database
        // const error = new Error(`Product '${product}' doesn't exist.`);
        // error.status = 404;
        // throw error;
      }
      res.status(200).json({ data: data });
    } else {
      // No product specified, return all orders
      const data = getOrders();
      res.status(200).json({ data: data });
    }

    // Adding new row
  } else if (req.method === "POST") {
    addOrder(req.body);
    res.status(201).json({
      message: "Order added successfully",
      addedOrder: req.body,
    });
  } else {
    throw new ReqError(
      405,
      `${req.method} not supported on this endpoint. Please refer to the API documentation.`
    );

    // const error = new Error(
    //   `${req.method} not supported on this endpoint. Please refer to the API documentation.`
    // );
    // error.status = 405;
    // throw error;
  }
});

router.all("/:orderId", (req, res) => {
  const { orderId } = req.params;
  let message, data;
  // Get order by id
  if (req.method === "GET") {
    data = getOrder(orderId);
    if (data) {
      res.status(200).json({
        message: `Got information about order with id ${orderId}`,
        data: data,
      });
    } else {
      throw new ReqError(
        404,
        `CANNOT GET: Order with id ${orderId} doesn't exist.`
      );

      // const error = new Error(
      //   `CANNOT GET: Order with id ${orderId} doesn't exist.`
      // );
      // error.status = 404;
      // throw error;
    }
    // Delete order by id
  } else if (req.method === "DELETE") {
    data = getOrder(orderId);
    if (data) {
      deleteOrder(orderId);
      res.status(200).json({
        message: `Deleted order with id ${orderId}`,
      });
    } else {
      throw new ReqError(
        404,
        `CANNOT DELETE: Order with id ${orderId} doesn't exist.`
      );

      // const error = new Error(
      //   `CANNOT DELETE: Order with id ${orderId} doesn't exist.`
      // );
      // error.status = 404;
      // throw error;
    }
  } else {
    throw new ReqError(
      405,
      `${req.method} not supported on this endpoint. Please refer to the API documentation.`
    );

    // const error = new Error(
    //   `${req.method} not supported on this endpoint. Please refer to the API documentation.`
    // );
    // error.status = 405;
    // throw error;
  }
  res.status(200).json({
    orderId: orderId,
    message: message,
    data: data,
  });
});

export default router;

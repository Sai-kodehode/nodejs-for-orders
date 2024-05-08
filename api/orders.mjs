import express from "express";
const router = express.Router();
import { ReqError } from "../middleware/errorHandler.mjs";
import jwtValidator from "../middleware/jwtValidator.mjs";
import { validateOrderData } from "../middleware/validateData.mjs";
import {
  getOrders,
  getOrdersCategory,
  addOrder,
  getOrder,
  deleteOrder,
} from "../database/dbOrdersQueries.mjs";

router.post("/", validateOrderData, (req, res) => {
  addOrder(req.body);
  res.status(201).json({
    message: "Order added successfully",
    addedOrder: req.body,
  });
});

router.all("/", jwtValidator, (req, res) => {
  if (req.method === "GET") {
    const { product } = req.query;

    if (product) {
      const data = getOrdersCategory(product.toLowerCase());

      if (data.length === 0) {
        throw new ReqError(404, `Product '${product}' doesn't exist.`);
      }
      res.status(200).json({ data: data });
    } else {
      const data = getOrders();
      res.status(200).json({ data: data });
    }
  } else {
    throw new ReqError(
      405,
      `${req.method} not supported on this endpoint. Please refer to the API documentation.`
    );
  }
});

// selection by id
router.all("/:orderId", (req, res) => {
  const { orderId } = req.params;

  if (req.method === "GET") {
    const data = getOrder(orderId);
    if (data) {
      res.status(200).json({
        message: `Got information about order with id ${orderId}`,
        data: data,
      });
    } else {
      throw new ReqError(404, `Order with id ${orderId} doesn't exist.`);
    }
  } else if (req.method === "DELETE") {
    const data = getOrder(orderId);
    if (data) {
      deleteOrder(orderId);
      res.status(200).json({
        message: `Deleted order with id ${orderId}`,
      });
    } else {
      throw new ReqError(404, `Order with id ${orderId} doesn't exist.`);
    }
  } else {
    throw new ReqError(
      405,
      `${req.method} not supported on this endpoint. Please refer to the API documentation.`
    );
  }

  res.status(200).json({
    orderId: orderId,
    message: message,
    data: data,
  });
});

export default router;

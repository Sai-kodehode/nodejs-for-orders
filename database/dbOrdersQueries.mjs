import sqlite3 from "better-sqlite3";
import { join } from "path";
const { dirname } = import.meta;

// initialize database

const db = new sqlite3(join(dirname, "..", "database", "store.sqlite"));

// queries for /orders

const getOrders = () => db.prepare("SELECT * FROM orders").all();

const getOrdersCategory = (product) => {
  const getOrdersCategoryQuery = db.prepare(
    "SELECT * FROM orders WHERE LOWER(product) = ?"
  );
  return getOrdersCategoryQuery.all(product);
};

const addOrder = ({ customer_email, product }) => {
  const addOrderQuery = db.prepare(
    "INSERT INTO orders (customer_email, product) VALUES(?, ?)"
  );
  addOrderQuery.run(customer_email, product);
};

const getOrder = (id) => {
  const getOrderQuery = db.prepare("SELECT * FROM orders WHERE id = ?");
  return getOrderQuery.get(id);
};

const deleteOrder = (id) => {
  const deleteOrderQuery = db.prepare("DELETE FROM orders WHERE id = ?");
  deleteOrderQuery.run(id);
};

const signupUser = (email, password) => {
  const signupUserQuery = db.prepare(
    "INSERT INTI users (email, password) VALUES(?, ?)"
  );
  signupUserQuery.run(email, password);
};

const loginUser = (email) => {
  const loginUserQuery = db.prepare("SELECT * FROM users WHERE email=?");
  return loginUserQuery.get(email);
};

export {
  getOrders,
  getOrdersCategory,
  addOrder,
  getOrder,
  deleteOrder,
  signupUser,
  loginUser,
};

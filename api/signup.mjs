import express from "express";
const router = express.Router();
import { signupUser } from "../database/dbQueries.mjs";
import bcrypt from "bcrypt";
import { ReqError } from "../middleware/errorHandler.mjs";
import { validateUserData } from "../middleware/validateData.mjs";

router.post("/", validateUserData, async (req, res, next) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    signupUser(email, hashedPassword);
    res.status(201).json({ message: "User signed up successfully" });
  } catch (e) {
    next(new ReqError(403, e.message));
  }
});

router.all("/", (req, res) => {
  throw new ReqError(405, `${req.method} not supported on this endpoint.`);
});

export default router;

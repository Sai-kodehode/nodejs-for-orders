import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ReqError } from "../middleware/errorHandler.mjs";
import { loginUser } from "../database/dbQueries.mjs";
import { config } from "dotenv";
config();

router.post("/", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = loginUser(email);
    if (!user) {
      next(new ReqError(403, "Authentication failed"));
      return;
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (correctPassword) {
      const payload = { user: email };
      const secret = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secret, { expiresIn: "1h" });
      res.status(200).json({ message: "Authentication successful", token });
    } else {
      next(new ReqError(403, "Wrong password"));
    }
  } catch (e) {
    next(new ReqError(500, e.message));
  }
});

router.all("/", (req, res) => {
  throw new ReqError(405, `${req.method} not supported on this endpoint.`);
});

export default router;

const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const { authMiddleware } = require("../middleware/authMiddleware");
const Order = require("../model/Order");

const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

// order for razorpay
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({
        message: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env"
      });
    }

    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: "A valid payment amount is required" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json({ ...order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
});

router.post("/save-order", authMiddleware, async (req, res) => {
  try {
    const { items, amount, paymentId, orderId } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ message: "A valid order amount is required" });
    }

    const savedOrder = await Order.create({
      user: req.user.id,
      items,
      amount: Number(amount),
      paymentId: paymentId || "",
      orderId: orderId || `ord_${Date.now()}`,
      status: "paid",
    });

    res.status(201).json({
      message: "Order saved successfully",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving order", error: error.message });
  }
});

module.exports = router;
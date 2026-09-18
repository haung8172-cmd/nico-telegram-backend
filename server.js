const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");

const app = express();

const upload = multer({
  storage: multer.memoryStorage()
});

app.get("/", (req, res) => {
  res.send("NICO GAME SHOP Backend OK");
});

app.post(
  "/receipt",
  upload.single("receipt"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          ok: false,
          error: "Receipt မတွေ့ပါ"
        });
      }

      const username = req.body.username || "မသိရ";
      const amount = req.body.amount || "မသိရ";
      const transactionId =
        req.body.transactionId || "မသိရ";

      const message =
        "🧾 NICO GAME SHOP\n\n" +
        "👤 User: " + username + "\n" +
        "💰 Amount: " + amount + "\n" +
        "🆔 Transaction ID: " + transactionId;

      const form = new FormData();

      form.append(
        "chat_id",
        process.env.TELEGRAM_CHAT_ID
      );

      form.append("caption", message);

      form.append("photo", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });

      await axios.post(
        "https://api.telegram.org/bot" +
          process.env.TELEGRAM_BOT_TOKEN +
          "/sendPhoto",
        form,
        {
          headers: form.getHeaders()
        }
      );

      res.json({
        ok: true,
        message: "Telegram သို့ ပို့ပြီးပါပြီ"
      });

    } catch (error) {
      console.error(error.message);

      res.status(500).json({
        ok: false,
        error: "Telegram သို့ ပို့မရပါ"
      });
    }
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    "Server running on port " + PORT
  );
});

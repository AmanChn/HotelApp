import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import axios from "axios";


const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.post("/api/chat", async (req, res) => {
  try {
    console.log("Chat request received:", req.body);
    const { message } = req.body;
    if (!message) {
      console.log("No message provided in request.");
      return res.status(400).json({ reply: "Message is required." });
    }
    const rasaResponse = await axios.post(
      "http://localhost:5001/webhooks/rest/webhook",
      { sender: "guest", message },
      { timeout: 500000 }
    );
    console.log("Rasa response:", rasaResponse.data);
    const reply = rasaResponse.data && rasaResponse.data.length > 0
      ? rasaResponse.data[0].text
      : "Sorry, I didn't understand.";
    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err.message, err.stack);
    res.status(500).json({ reply: "Something went wrong. Try again!" });
  }
});

app.get("/api/hotels/name/:name", async (req, res) => {
  try {
    const hotel = await mongoose.model("Hotel").findOne({
      name: { $regex: req.params.name, $options: "i" },
    });
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(hotel);
  } catch (err) {
    console.error("Hotel error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});

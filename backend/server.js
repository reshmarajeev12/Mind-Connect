import express from "express"
import cors from 'cors'
import http from "http";  // Import HTTP module for WebSocket server
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import chatRoutes from "./routes/chatRoutes.js";
import socketServer from "./socket.js"; 


// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Create HTTP Server for Socket.io
const server = http.createServer(app);


// middlewares
app.use(express.json())
app.use(cors({
  origin: ['https://mindconnect.vercel.app', 'https://mindconnect-admin.vercel.app'],
  credentials: true
}));

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)
app.use("/api/chat", chatRoutes); // ✅ Chat routes

app.get("/", (req, res) => {
  res.send("API Working")
});


// Initialize Socket.io
socketServer(server);

server.listen(port, () => console.log(`Server started on PORT:${port}`))

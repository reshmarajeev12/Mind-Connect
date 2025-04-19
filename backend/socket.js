import { Server } from "socket.io";
import Chat from "./models/chatModel.js"; // Import Chat model
import { sendChatMessage } from "./controllers/chatController.js";

const activeTimers = {}; // Track active chat sessions
const chatStartTimes = {};
const connectedUsers = new Map(); // Track userId ↔ socket.id mapping

const socketServer = (server) => {
    const io = new Server(server, {
        cors: {
             origin: [
                "https://mind-connect-frontend.vercel.app", // ✅ Vercel Frontend
                "https://mind-connect-admin.vercel.app"      // ✅ If you have admin hosted separately
            ],
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        
        // socket.on("registerUser", (userId) => {
        //     connectedUsers.set(userId, socket.id);
        //     console.log(`User ${userId} registered with socket ID ${socket.id}`);
        //   });

        // ✅ Join a chat room and send chat history
        socket.on("joinRoom", async (appointmentId) => {
            socket.join(appointmentId);
            console.log(`User joined chat room: ${appointmentId}`);

            try {
                // Fetch previous chat history
                const messages = await Chat.find({ appointmentId }).sort({ createdAt: 1 });

                // Send stored messages to the user
                socket.emit("chatHistory", messages);

               // ✅ If chat hasn't started, start timer
               if (!activeTimers[appointmentId]) {
                chatStartTimes[appointmentId] = Date.now();
                let timeLeft = 120; // 2 minutes (120 seconds)

                activeTimers[appointmentId] = setInterval(() => {
                    timeLeft--;

                    io.to(appointmentId).emit("timeUpdate", timeLeft);

                    if (timeLeft <= 0) {
                        clearInterval(activeTimers[appointmentId]);
                        delete activeTimers[appointmentId];
                        io.to(appointmentId).emit("chatEnded");
                        console.log(`Chat session ended for appointment: ${appointmentId}`);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    });

        // ✅ Handle sending messages
        socket.on("sendMessage", async ({ appointmentId, sender, message }) => {
            try {
                // Save message in database
                const newMessage = new Chat({ appointmentId, sender, message });
                await newMessage.save();

                console.log("Message saved:", newMessage);

                // Emit message to the chat room
                io.to(appointmentId).emit("receiveMessage", newMessage);
            } catch (error) {
                console.error("Error sending chat message:", error);
            }
        });

        // ✅ Handle manual chat end request
        socket.on("endChat", (appointmentId) => {
            if (activeTimers[appointmentId]) {
                clearInterval(activeTimers[appointmentId]);
                delete activeTimers[appointmentId];
                io.to(appointmentId).emit("chatEnded");
                console.log(`Chat session manually ended for appointment: ${appointmentId}`);
            }
        });
        
         // ✅ Notify user that doctor is ready
         socket.on("doctorReady", ({ appointmentId }) => {
            console.log(`Doctor ready notification sent for: ${appointmentId}`);
            io.emit("notifyUser", { appointmentId });
            io.to(appointmentId).emit("doctorReady", { appointmentId });
        });


        // ✅ Notify when user joins the chat
        socket.on("userJoinedChat", ({ appointmentId }) => {
            console.log(`User joined chat: ${appointmentId}`);
            io.to(appointmentId).emit("userJoinedChat", { appointmentId });
        });

        // ✅ Notify when doctor joins the chat
        socket.on("doctorJoinedChat", ({ appointmentId }) => {
            console.log(`Doctor joined chat: ${appointmentId}`);
            io.to(appointmentId).emit("doctorJoinedChat");
        });

        // Broadcast the event to the specific user (Assuming you store user socket IDs)
       

        // // ✅ Notify users when doctor is available
        // socket.on("doctorAvailable", () => {
        //     io.emit("doctorAvailable", { message: "Doctor is now available!" });
        // });

        // ✅ Handle disconnect
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};

export default socketServer

import Chat from "../models/chatModel.js";

// ✅ Get Chat Messages for a Specific Appointment
export const getChatMessages = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        console.log("Fetching messages for appointment:", appointmentId);

        const messages = await Chat.find({ appointmentId }).sort({ createdAt: 1 });

        if (!messages.length) {
            return res.status(404).json({ success: false, message: "No chat found!" });
        }

        return res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Send a Chat Message (Supports API & Socket.io)
export const sendChatMessage = async (data, socket = null) => {
    try {
        const { appointmentId, sender, message } = data;

        console.log("Received message:", { appointmentId, sender, message });

        if (!appointmentId || !sender || !message) {
            if (socket) {
                socket.emit("messageError", { success: false, message: "Missing required fields!" });
            }
            return;
        }

        const newMessage = new Chat({ appointmentId, sender, message });
        await newMessage.save();

        console.log("Message saved successfully:", newMessage);

        // If using WebSocket, emit message to the room
        if (socket) {
            socket.to(appointmentId).emit("receiveMessage", { sender, message });
        }

        return newMessage;
    } catch (error) {
        console.error("Error sending message:", error);
        if (socket) {
            socket.emit("messageError", { success: false, message: "Server error" });
        }
    }
};

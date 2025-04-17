import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
        sender: { type: String, required: true }, // "doctor" or "user"
        message: { type: String, required: true },
    },
    { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;

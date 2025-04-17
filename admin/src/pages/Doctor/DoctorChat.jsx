// import { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import io from "socket.io-client";
// import axios from "axios";

// const backendUrl = "http://localhost:4000"; // Update this with your actual backend URL

// const DoctorChat = () => {
//     const { appointmentId } = useParams();
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState("");
//     const socketRef = useRef(null);

//     // ✅ Fetch Previous Chat Messages
//     useEffect(() => {
//         const fetchChatMessages = async () => {
//             try {
//                 const res = await axios.get(`${backendUrl}/chat/${appointmentId}`);
//                 if (res.data.success) {
//                     setMessages(res.data.messages);
//                 }
//             } catch (error) {
//                 console.error("Error fetching chat messages:", error);
//             }
//         };

//         fetchChatMessages();
//     }, [appointmentId]);

//     // ✅ Setup WebSocket Connection
//     useEffect(() => {
//         socketRef.current = io(backendUrl);

//         if (appointmentId) {
//             socketRef.current.emit("joinRoom", appointmentId);

//             socketRef.current.on("receiveMessage", (newMessage) => {
//                 setMessages((prev) => [...prev, newMessage]);
//             });
//         }

//         return () => {
//             socketRef.current.disconnect();
//         };
//     }, [appointmentId]);

//     // ✅ Send Message Function
//     const sendMessage = async () => {
//         if (message.trim() === "") return;

//         const newMessage = { sender: "doctor", message };

//         socketRef.current.emit("sendMessage", { appointmentId, sender: "doctor", message });

//         setMessages([...messages, newMessage]);
//         setMessage("");

//         try {
//             await axios.post(`${backendUrl}/chat/send`, { appointmentId, sender: "doctor", message });
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }
//     };

//     return (
//         <div className="flex flex-col w-full max-w-lg mx-auto border p-4 rounded-lg shadow-lg">
//             <h2 className="text-lg font-bold text-center">Chat with User</h2>
//             <div className="flex flex-col h-64 overflow-y-auto border p-2 my-2">
//                 {messages.map((msg, index) => (
//                     <p key={index} className={`p-2 my-1 rounded ${msg.sender === "doctor" ? "bg-blue-200 self-end" : "bg-gray-200 self-start"}`}>
//                         <span className="font-semibold">{msg.sender}:</span> {msg.message}
//                     </p>
//                 ))}
//             </div>
//             <div className="flex gap-2">
//                 <input
//                     type="text"
//                     className="border p-2 flex-1 rounded"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Type a message..."
//                 />
//                 <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={sendMessage}>
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default DoctorChat;


// import { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import io from "socket.io-client";
// import axios from "axios";

// const backendUrl = "http://localhost:4000";

// const DoctorChat = () => {
//     const { appointmentId } = useParams();
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState("");
//     const [timeLeft, setTimeLeft] = useState(120); // 10 minutes
//     const [chatEnded, setChatEnded] = useState(false);
//     const socketRef = useRef(null);

//     useEffect(() => {
//         const fetchChatMessages = async () => {
//             try {
//                 const res = await axios.get(`${backendUrl}/chat/${appointmentId}`);
//                 if (res.data.success) {
//                     setMessages(res.data.messages);
//                 }
//             } catch (error) {
//                 console.error("Error fetching chat messages:", error);
//             }
//         };

//         fetchChatMessages();
//     }, [appointmentId]);

//     useEffect(() => {
//         socketRef.current = io(backendUrl);
//         socketRef.current.emit("joinRoom", appointmentId);

//         socketRef.current.on("chatHistory", (chatHistory) => setMessages(chatHistory));
//         socketRef.current.on("receiveMessage", (newMessage) => setMessages((prev) => [...prev, newMessage]));
//         socketRef.current.on("chatEnded", () => {
           
//             alert("Chat session has ended.");
//             clearInterval(timer); // ✅ Ensure timer is cleared
//             setChatEnded(true);
//         });

//         const timer = setInterval(() => {
//             setTimeLeft((prev) => {
//                 if (prev <= 1) {
//                     clearInterval(timer);  // ✅ Stop the timer first
//                     socketRef.current.emit("endChat", appointmentId); // ✅ Notify server to end chat
//                     setTimeout(() => {
//                         setChatEnded(true); // ✅ Set chatEnded only AFTER timer stops
//                     }, 1000);  // Small delay to ensure message syncs correctly
//                     return 0;
//                 }
//                 return prev - 1;
//             });
//         }, 1000);

//         return () => {
//             clearInterval(timer);
//             socketRef.current.disconnect();
//         };
//     }, [appointmentId,backendUrl,chatEnded]);

//     const sendMessage = async () => {
//         if (chatEnded || message.trim() === "") return;

//         const newMessage = { sender: "doctor", message };
//         socketRef.current.emit("sendMessage", { appointmentId, sender: "doctor", message });
//         setMessages((prev) => [...prev, newMessage]);
//         setMessage("");

//         try {
//             await axios.post(`${backendUrl}/chat/send`, { appointmentId, sender: "doctor", message });
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }
//     };

//     return (
//         <div className="flex flex-col w-full max-w-lg mx-auto border p-4 rounded-lg shadow-lg">
//             <h2 className="text-lg font-bold text-center">
//                 Chat with User - {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
//             </h2>

//             <div className="flex flex-col h-64 overflow-y-auto border p-2 my-2">
//                 {messages.map((msg, index) => (
//                     <p key={index} className={`p-2 my-1 rounded ${msg.sender === "doctor" ? "bg-blue-200 self-end" : "bg-gray-200 self-start"}`}>
//                         <span className="font-semibold">{msg.sender}:</span> {msg.message}
//                     </p>
//                 ))}
//             </div>

//             <div className="flex gap-2">
//                 <input type="text" className="border p-2 flex-1 rounded" value={message} onChange={(e) => setMessage(e.target.value)} disabled={chatEnded} />
//                 <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={sendMessage} disabled={chatEnded}>
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default DoctorChat;





import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { socket } from "../../socket";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"; // Adjust based on your setup
const token = localStorage.getItem("token")// Get token from localStorage
console.log("Stored Token:", token);


const DoctorChat = () => {
    const { appointmentId } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes (example)
    const [chatEnded, setChatEnded] = useState(false);
    const socketRef = useRef(null);
    const navigate=useNavigate()

    useEffect(() => {
        socketRef.current = io(backendUrl, { query: { token } });

        socketRef.current.emit("joinRoom", appointmentId);
        socketRef.current.on("chatHistory", (chatHistory) => setMessages(chatHistory));
        socketRef.current.on("receiveMessage", (newMessage) => setMessages((prev) => [...prev, newMessage]));
        socketRef.current.on("timeUpdate", (time) => setTimeLeft(time));
        socketRef.current.on("chatEnded", () => setChatEnded(true));

        return () => {
            socketRef.current.disconnect();
        };
    }, [appointmentId]);

    const sendMessage = async () => {
        if (chatEnded || !message.trim()) return;
        const newMessage = { sender: "doctor", message, appointmentId };
        // setMessages((prev) => [...prev, newMessage]);
        socketRef.current.emit("sendMessage", newMessage);
        setMessage("");
    

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${backendUrl}/api/chat/send`, { appointmentId, sender: "doctor", message }, {
                // headers: { Authorization: `Bearer ${token}` }
          
                    headers: {
                        "Authorization": token ? `Bearer ${token}` : "",
                        "Content-Type": "application/json"
                    }
              
            });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const endChatSession = () => {
        socketRef.current.emit("endChat", appointmentId);
        setChatEnded(true);
    };

    // useEffect(() => {
    //     socket.emit("doctorJoinedChat", { appointmentId });
    
    //     return () => socket.off("doctorJoinedChat");
    // }, [appointmentId]);

    useEffect(() => {
        socket.emit("doctorJoinedChat", { appointmentId });
    
        toast.success("✅ You have joined the chat!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    
        return () => socket.off("doctorJoinedChat");
    }, [appointmentId]);
    
    

    return (
        
        <div className="flex flex-col w-full max-w-lg mx-auto border p-4 rounded-lg shadow-lg">
            <ToastContainer/>
            <h2 className="text-lg font-bold text-center">
                Chat with User - {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </h2>
               
            <div className="flex flex-col h-64 overflow-y-auto border p-2 my-2">
                {messages.map((msg, index) => (
                    <p key={index} className={`p-2 my-1 rounded ${msg.sender === "doctor" ? "bg-blue-200 self-end" : "bg-gray-200 self-start"}`}>
                        <span className="font-semibold">{msg.sender}:</span> {msg.message}
                    </p>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    className="border p-2 flex-1 rounded"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={chatEnded}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={sendMessage}
                    disabled={chatEnded}
                >
                    Send
                </button>
            </div>

            {chatEnded ? (
                <div className="text-center mt-4">
                    <p className="text-red-500">Chat session has ended.</p>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded mt-2 w-full"
                        onClick={() => navigate("/doctor-appointments")}
                    >
                        Complete Chat Session
                    </button>

                </div>
            ) : (
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2 w-full"
                    onClick={endChatSession}
                >
                    Complete Chat Session
                </button>
            )}
        </div>
    );
};

export default DoctorChat;

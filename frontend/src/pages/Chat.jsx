// import React, { useEffect, useState, useContext, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import axios from "axios";
// import { io } from "socket.io-client";

// const Chat = () => {
//     const { backendUrl, token } = useContext(AppContext);
//     const { appointmentId } = useParams();
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState("");
//     const socketRef = useRef(null);
//     const messagesEndRef = useRef(null);

//     // ✅ Fetch Chat Messages from Backend
//     useEffect(() => {
//         const fetchChat = async () => {
//             try {
//                 const { data } = await axios.get(`${backendUrl}/chat/${appointmentId}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });

//                 if (data.success) {
//                     setMessages(data.messages);
//                 } else {
//                     console.error("Error:", data.message);
//                 }
//             } catch (error) {
//                 console.error("Error fetching chat:", error);
//             }
//         };

//         fetchChat();
//     }, [appointmentId, backendUrl, token]);

//     // ✅ Setup Socket.io for Real-Time Chat
//     useEffect(() => {
//         socketRef.current = io(backendUrl, {
//             query: { token },
//         });

//         socketRef.current.emit("joinRoom", appointmentId);

//         socketRef.current.on("receiveMessage", (newMessage) => {
//             setMessages((prev) => [...prev, newMessage]);
//         });

//         return () => {
//             socketRef.current.disconnect();
//         };
//     }, [appointmentId, backendUrl, token]);

//     // ✅ Send Message Function
//     const sendMessage = async () => {
//         if (!message.trim()) return;

//         const newMessage = {
//             sender: "user", // User sends messages
//             message,
//             appointmentId,
//         };

//         // Update UI instantly
//         setMessages((prev) => [...prev, newMessage]);
//         socketRef.current.emit("sendMessage", newMessage);

//         try {
//             await axios.post(`${backendUrl}/chat/send`, newMessage, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }

//         setMessage("");
//     };

//     // ✅ Scroll to Latest Message
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     return (
//         <div className="flex flex-col h-screen">
//             {/* ✅ Chat Header */}
//             <div className="bg-blue-600 text-white p-4 text-center">
//                 Chat with Doctor
//             </div>

//             {/* ✅ Chat Messages */}
//             <div className="flex-1 overflow-y-auto p-4">
//                 {messages.map((msg, index) => (
//                     <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
//                         <div className={`p-2 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
//                             {msg.message}
//                         </div>
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//             </div>

//             {/* ✅ Chat Input */}
//             <div className="p-4 flex border-t">
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-1 p-2 border rounded"
//                 />
//                 <button onClick={sendMessage} className="ml-2 bg-blue-600 text-white px-4 py-2 rounded">
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Chat;






import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom"
import { socket } from "../socket";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Chat = () => {
    const { backendUrl, token } = useContext(AppContext);
    const { appointmentId } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [timeLeft, setTimeLeft] = useState(120); // 10 minutes (600 seconds)
    const [chatEnded, setChatEnded] = useState(false);
    const socketRef = useRef(null);
    const navigate = useNavigate()
    // const messagesEndRef = useRef(null);

    // useEffect(() => {
    //     const fetchChatHistory = async () => {
    //         try {
    //             const { data } = await axios.get(`${backendUrl}/chat/${appointmentId}`, {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             });

    //             if (data.success) {
    //                 setMessages(data.messages);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching chat history:", error);
    //         }
    //     };

    //     fetchChatHistory();
    // }, [appointmentId, backendUrl, token]);

    // useEffect(() => {
    //     if (user && user._id) {
    //       socket.emit("registerUser", user._id);
    //     }
    //   }, [user]);

    useEffect(() => {
        socketRef.current = io(backendUrl, { query: { token } });
        socketRef.current.emit("joinRoom", appointmentId);

        // socketRef.current.on("chatHistory", (chatHistory) => setMessages(chatHistory));
        // socketRef.current.on("receiveMessage", (newMessage) => setMessages((prev) => [...prev, newMessage]));
          
        //   // ✅ Listen for time updates from the server
        //   socketRef.current.on("timeUpdate", (time) => setTimeLeft(time));

        //   socketRef.current.on("chatEnded", () => {
        //       setChatEnded(true);
        //   });

        socketRef.current.on("chatHistory", (chatHistory) => setMessages(chatHistory));
        socketRef.current.on("receiveMessage", (newMessage) => setMessages((prev) => [...prev, newMessage]));
        socketRef.current.on("timeUpdate", (time) => setTimeLeft(time));
        socketRef.current.on("chatEnded", () => setChatEnded(true));
        socketRef.current.on("userJoinedChat", () => {
            setUserJoined(true);
            setTimeout(() => setUserJoined(false), 3000); // Hide after 3 seconds
        });
  
          return () => {
              socketRef.current.disconnect();
          };
      }, [appointmentId, backendUrl, token]);

      
    useEffect(() => {
        socket.emit("userJoinedChat", { appointmentId });
    
        return () => socket.off("userJoinedChat");
    }, [appointmentId]);



    const sendMessage = async () => {
        if (chatEnded || !message.trim()) return;
        const newMessage = { sender: "user", message, appointmentId };
        // setMessages((prev) => [...prev, newMessage]);
        socketRef.current.emit("sendMessage", newMessage);
        setMessage("");
    };

    // useEffect(() => {
    //     socket.on("doctorJoinedChat", () => {
    //         startTimer(); // Function to start countdown
    //     });
    
    //     return () => socket.off("doctorJoinedChat");
    // }, []);

    useEffect(() => {
        socket.on("doctorJoinedChat", () => {
            startTimer(); // Function to start countdown
    
            toast.success("👨‍⚕️ The doctor has joined the chat!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        });
    
        return () => socket.off("doctorJoinedChat");
    }, []);
    
    


    return (
        <div className="flex flex-col h-screen">
            <ToastContainer />
            <div className="bg-blue-600 text-white p-4 text-center">
                Chat with Doctor - {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </div>

            <div className="flex flex-col h-64 overflow-y-auto border p-2 my-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`p-2 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                        <span className="font-semibold">{msg.sender}:</span> {msg.message}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 flex border-t">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded"
                    disabled={chatEnded}
                />
                <button onClick={sendMessage} className="ml-2 bg-blue-600 text-white px-4 py-2 rounded" disabled={chatEnded}>
                    Send
                </button>
            </div>

            {chatEnded && (
                <div className="text-center mt-4">
                    <p className="text-red-500">Chat session has ended.</p>
                    <button onClick={()=>navigate('/')} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
                        Completed Chat Session
                    </button>
                </div>
            )}
        </div>
    );
};

export default Chat;
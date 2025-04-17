// import jwt from "jsonwebtoken";
// import User from "../models/userModel.js"; // Adjust if needed

// const authMiddleware = async (req, res, next) => {
//     try {
//         const token = req.header("Authorization");
//         if (!token) {
//             return res.status(401).json({ message: "No token, authorization denied" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id).select("-password");
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Token is not valid" });
//     }
// };

// export default authMiddleware;

import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Ensure correct path

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const token = req.headers.authorization?.split(" ")[1]; // Should correctly extract the token
if (!token) {
    return res.status(401).json({ message: "No token provided" });
}
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(401).json({ message: "Token is not valid" });
    }
};

export default authMiddleware;

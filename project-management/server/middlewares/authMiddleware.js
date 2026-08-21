 import { verifyToken } from '@clerk/backend';

export const protect = async (req, res, next) => {
    try {
        const authData = await req.auth();
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            try {
                await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
            } catch (err) {
                console.log("Token Verification Error:", err);
            }
        }
        const { userId } = authData;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    
        return next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.code || error.message });
    }
};

export const protect = async (req, res, next) => {
    try {
        const authData = await req.auth();
        const { userId } = authData || {};

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        return next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ message: error.message || "Unauthorized" });
    }
};

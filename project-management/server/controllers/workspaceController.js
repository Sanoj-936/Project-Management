import prisma from "../configs/prisma.js";

export const getUserWorkspaces = async (req, res) => {
    try {
        const { userId } = await req.auth();

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const workspaces = await prisma.workspace.findMany({
            where: {
                members: { some: { userId: userId } }
            },
            include: {
                members: { include: { user: true } },
                projects: {
                    include: {
                        tasks: { include: { assignee: true, comments: { include: { user: true } } } },
                        members: { include: { user: true } }
                    }
                },
                owner: true
            }
        });
        return res.json({ workspaces });
    } catch (error) {
        console.error("Error in getUserWorkspaces:", error);
        return res.status(500).json({ message: error.message || "Failed to fetch workspaces" });
    }
};
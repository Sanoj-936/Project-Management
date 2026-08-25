import prisma from "../configs/prisma.js";

// Create project
export const createProject = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { workspaceId, description, name, status, start_date, end_date, team_members, team_lead, progress, priority } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Project name is required" });
        }

        if (!workspaceId) {
            return res.status(400).json({ message: "Workspace ID is required" });
        }

        // Check if workspace exists
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: { members: { include: { user: true } } },
        });

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        // Check if user is an ADMIN member or the workspace owner
        const isUserAdmin = workspace.ownerId === userId || workspace.members.some((member) => member.userId === userId && member.role === "ADMIN");
        if (!isUserAdmin) {
            return res.status(403).json({ message: "You don't have permission to create projects in this workspace" });
        }

        // Resolve Team Lead using email or ID
        let teamLeadId = userId;
        if (team_lead) {
            const teamLeadUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: team_lead },
                        { id: team_lead }
                    ]
                },
                select: { id: true }
            });
            if (teamLeadUser) {
                teamLeadId = teamLeadUser.id;
            }
        }

        // Ensure team lead user exists in DB
        const existingLead = await prisma.user.findUnique({ where: { id: teamLeadId } });
        if (!existingLead) {
            await prisma.user.upsert({
                where: { id: teamLeadId },
                update: {},
                create: {
                    id: teamLeadId,
                    email: typeof team_lead === 'string' && team_lead.includes('@') ? team_lead : `${teamLeadId}@placeholder.com`,
                    name: "Team Lead",
                    image: "",
                }
            });
        }

        const project = await prisma.project.create({
            data: {
                workspaceId,
                name: name.trim(),
                description: description || "",
                status: status || "PLANNING",
                priority: priority || "MEDIUM",
                progress: typeof progress === 'number' ? progress : 0,
                team_lead: teamLeadId,
                start_date: start_date ? new Date(start_date) : null,
                end_date: end_date ? new Date(end_date) : null,
            }
        });

        // Add team lead and other members to projectMember
        const memberIdsToAdd = new Set([teamLeadId]);

        if (Array.isArray(team_members) && team_members.length > 0) {
            workspace.members.forEach(member => {
                if (member.user && (team_members.includes(member.user.email) || team_members.includes(member.user.id))) {
                    memberIdsToAdd.add(member.user.id);
                }
            });
        }

        await prisma.projectMember.createMany({
            data: Array.from(memberIdsToAdd).map(mId => ({
                projectId: project.id,
                userId: mId,
            })),
            skipDuplicates: true,
        });

        const projectWithMembers = await prisma.project.findUnique({
            where: { id: project.id },
            include: {
                members: { include: { user: true } },
                tasks: { include: { assignee: true, comments: { include: { user: true } } } },
                owner: true
            }
        });

        return res.status(201).json({ project: projectWithMembers, message: "Project created successfully" });

    } catch (error) {
        console.error("Error in createProject:", error);
        return res.status(500).json({ message: error.message || "Failed to create project" });
    }
};

// Update project
export const updateProject = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { id, workspaceId, description, name, status, start_date, end_date, progress, priority } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const project = await prisma.project.findUnique({
            where: { id }
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId || project.workspaceId },
            include: { members: { include: { user: true } } },
        });

        const isWorkspaceAdmin = workspace?.ownerId === userId || workspace?.members.some((member) => member.userId === userId && member.role === "ADMIN");
        const isProjectLead = project.team_lead === userId;

        if (!isWorkspaceAdmin && !isProjectLead) {
            return res.status(403).json({ message: "You don't have permission to update this project" });
        }

        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                ...(name ? { name: name.trim() } : {}),
                ...(description !== undefined ? { description } : {}),
                ...(status ? { status } : {}),
                ...(priority ? { priority } : {}),
                ...(typeof progress === 'number' ? { progress } : {}),
                ...(start_date !== undefined ? { start_date: start_date ? new Date(start_date) : null } : {}),
                ...(end_date !== undefined ? { end_date: end_date ? new Date(end_date) : null } : {}),
            },
            include: {
                members: { include: { user: true } },
                tasks: { include: { assignee: true, comments: { include: { user: true } } } },
                owner: true
            }
        });

        return res.json({ project: updatedProject, message: "Project updated successfully" });
    } catch (error) {
        console.error("Error in updateProject:", error);
        return res.status(500).json({ message: error.message || "Failed to update project" });
    }
};

// Add Member to Project
export const addMember = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { projectId } = req.params;
        const { email } = req.body;

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { members: { include: { user: true } } },
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.team_lead !== userId) {
            return res.status(403).json({ message: "Only project lead can add members" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingMember = project.members.some((member) => member.userId === user.id);
        if (existingMember) {
            return res.status(400).json({ message: "User is already a member of this project" });
        }

        const member = await prisma.projectMember.create({
            data: {
                userId: user.id,
                projectId,
            },
            include: { user: true }
        });

        return res.json({ member, message: "Member added successfully" });
    } catch (error) {
        console.error("Error in addMember:", error);
        return res.status(500).json({ message: error.message || "Failed to add member" });
    }
};
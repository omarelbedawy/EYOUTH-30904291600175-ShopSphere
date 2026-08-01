const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../utils/mailer');

async function getUserById(req, res) {
    const userId = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function signup(req, res) {
    const userData = req.body;
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword
            }
        });

        sendWelcomeEmail(newUser.email, newUser.name).catch(err => console.error("Email error:", err));

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000
        });

        res.json({ message: "Login successful", role: user.role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function logout(req, res) {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
}

async function getMe(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true, role: true }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function getProfile(req, res) {
    res.json({ message: `You are user ${req.userId}` });
}

async function updateUser(req, res) {
    const userId = req.params.id;
    const userData = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: userData
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        const deletedUser = await prisma.user.delete({
            where: { id: parseInt(userId) }
        });
        res.json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function promoteToAdmin(req, res) {
    try {
        const userId = req.params.id;
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { role: "ADMIN" }
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserById,
    signup,
    login,
    logout,
    getMe,
    getProfile,
    updateUser,
    deleteUser,
    promoteToAdmin
};

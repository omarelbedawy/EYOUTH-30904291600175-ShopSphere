const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authmiddleware');
const {
    getUserById,
    signup,
    login,
    logout,
    updateUser,
    deleteUser,
    promoteToAdmin
} = require('../controllers/userController');

// Mounted at /users in index.js, so these become:
// GET    /users/:id
// POST   /users
// POST   /users/login
// POST   /users/logout
// PUT    /users/:id
// DELETE /users/:id
// PATCH  /users/:id/role

router.get('/:id', getUserById);
router.post('/', signup);
router.post('/login', login);
router.post('/logout', logout);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/role', authenticateToken, requireAdmin, promoteToAdmin);

module.exports = router;

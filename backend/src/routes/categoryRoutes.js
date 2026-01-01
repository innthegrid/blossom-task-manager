const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate } = require('../middleware/auth');

// Apply authentication to all category routes
router.use(authenticate);

// Get all categories for user
router.get('/', categoryController.getCategories);

// Create a new category
router.post('/', categoryController.createCategory);

// Update a category
router.put('/:id', categoryController.updateCategory);

// Delete a category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
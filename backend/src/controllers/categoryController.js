const { prisma } = require('../config/database');

// Helper functions for consistent responses
const blossomResponse = (res, data, message = 'Success', status = 200) => {
  res.status(status).json({
    ...data,
    message,
    status: 'success',
    timestamp: new Date().toISOString()
  });
};

const blossomError = (res, message, status = 400) => {
  res.status(status).json({
    error: message,
    suggestion: 'Please check your data and try again',
    status: 'error',
    timestamp: new Date().toISOString()
  });
};

// Get all categories for user
const getCategories = async (req, res) => {
  try {
    const userId = req.userId;
    
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' }
    });

    blossomResponse(res, { categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    blossomError(res, 'Failed to fetch categories', 500);
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, color, icon } = req.body;

    // Validation
    if (!name || name.trim() === '') {
      return blossomError(res, 'Category name is required');
    }

    // Check if category already exists for this user
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name.trim(),
        userId
      }
    });

    if (existingCategory) {
      return blossomError(res, 'You already have a category with this name');
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        color: color || '#FFB7C5',
        icon: icon || '🌸',
        userId
      }
    });

    blossomResponse(res, { category }, 'Category created successfully', 201);
  } catch (error) {
    console.error('Error creating category:', error);
    blossomError(res, 'Failed to create category', 500);
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const categoryId = req.params.id;
    const updates = req.body;

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId
      }
    });

    if (!existingCategory) {
      return blossomError(res, 'Category not found', 404);
    }

    // If updating name, check if new name already exists
    if (updates.name && updates.name.trim() !== existingCategory.name) {
      const duplicateCategory = await prisma.category.findFirst({
        where: {
          name: updates.name.trim(),
          userId,
          id: { not: categoryId }
        }
      });

      if (duplicateCategory) {
        return blossomError(res, 'You already have a category with this name');
      }
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: updates.name ? updates.name.trim() : existingCategory.name,
        color: updates.color || existingCategory.color,
        icon: updates.icon || existingCategory.icon
      }
    });

    blossomResponse(res, { category: updatedCategory }, 'Category updated successfully');
  } catch (error) {
    console.error('Error updating category:', error);
    blossomError(res, 'Failed to update category', 500);
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const categoryId = req.params.id;

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId
      }
    });

    if (!existingCategory) {
      return blossomError(res, 'Category not found', 404);
    }

    // Delete category
    await prisma.category.delete({
      where: { id: categoryId }
    });

    blossomResponse(res, { 
      deletedCategory: existingCategory
    }, 'Category deleted successfully');
  } catch (error) {
    console.error('Error deleting category:', error);
    blossomError(res, 'Failed to delete category', 500);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
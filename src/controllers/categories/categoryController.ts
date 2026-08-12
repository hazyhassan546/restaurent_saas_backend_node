import type { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { is_active, skip = 0, take = 20 } = req.query;

    // Build filter object
    const where: any = {};

    if (is_active === "true") {
      where.is_active = true;
    }

    // Get total count
    const total = await prisma.categories.count({ where });

    // Fetch categories with pagination and sorting
    const categories = await prisma.categories.findMany({
      where,
      include: {
        categories: true,
        other_categories: true,
      },
      orderBy: {
        display_order: "asc",
      },
      skip: parseInt(skip as string) || 0,
      take: Math.min(parseInt(take as string) || 20, 100),
    });

    return res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
      pagination: {
        total,
        skip: parseInt(skip as string) || 0,
        take: parseInt(take as string) || 20,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const category = await prisma.categories.findUnique({
      where: { id: categoryId },
      include: {
        categories: true,
        other_categories: true,
        products: true,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      image_url,
      icon_url,
      slug,
      parent_category_id,
      display_order,
      is_active,
    } = req.body;

    // Verify parent category exists if provided
    if (parent_category_id) {
      const parentCategory = await prisma.categories.findUnique({
        where: { id: parent_category_id },
      });

      if (!parentCategory) {
        return res.status(404).json({ message: "Parent category not found" });
      }
    }

    // Check slug uniqueness if provided
    if (slug) {
      const existingCategory = await prisma.categories.findUnique({
        where: { slug },
      });

      if (existingCategory) {
        return res.status(400).json({ message: "Slug already exists" });
      }
    }

    // Create category
    const category = await prisma.categories.create({
      data: {
        name,
        description: description || null,
        image_url: image_url || null,
        icon_url: icon_url || null,
        slug: slug || null,
        parent_category_id: parent_category_id || null,
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true,
      },
      include: {
        categories: true,
        other_categories: true,
      },
    });

    return res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Check if category exists
    const existingCategory = await prisma.categories.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const {
      name,
      description,
      image_url,
      icon_url,
      slug,
      parent_category_id,
      display_order,
      is_active,
    } = req.body;

    // Verify parent category exists if provided
    if (parent_category_id) {
      if (parent_category_id === categoryId) {
        return res.status(400).json({ message: "Category cannot be its own parent" });
      }

      const parentCategory = await prisma.categories.findUnique({
        where: { id: parent_category_id },
      });

      if (!parentCategory) {
        return res.status(404).json({ message: "Parent category not found" });
      }
    }

    // Check slug uniqueness if provided and changed
    if (slug && slug !== existingCategory.slug) {
      const categoryWithSlug = await prisma.categories.findUnique({
        where: { slug },
      });

      if (categoryWithSlug) {
        return res.status(400).json({ message: "Slug already exists" });
      }
    }

    // Build update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;
    if (image_url !== undefined) updateData.image_url = image_url || null;
    if (icon_url !== undefined) updateData.icon_url = icon_url || null;
    if (slug !== undefined) updateData.slug = slug || null;
    if (parent_category_id !== undefined) updateData.parent_category_id = parent_category_id || null;
    if (display_order !== undefined) updateData.display_order = display_order;
    if (is_active !== undefined) updateData.is_active = is_active;

    // Update category
    const updatedCategory = await prisma.categories.update({
      where: { id: categoryId },
      data: updateData,
      include: {
        categories: true,
        other_categories: true,
      },
    });

    return res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Check if category exists
    const category = await prisma.categories.findUnique({
      where: { id: categoryId },
      include: {
        products: true,
        other_categories: true,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if category has products
    if (category.products && category.products.length > 0) {
      return res.status(400).json({
        message: "Cannot delete category with associated products",
      });
    }

    // Check if category has subcategories
    if (category.other_categories && category.other_categories.length > 0) {
      return res.status(400).json({
        message: "Cannot delete category with subcategories",
      });
    }

    // Delete the category
    await prisma.categories.delete({
      where: { id: categoryId },
    });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

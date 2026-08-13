import type { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { featured, available, categoryId, skip = 0, take = 20 } = req.query;

    // Build filter object
    const where: any = {};

    if (featured === "true") {
      where.is_featured = true;
    }

    if (available === "true") {
      where.is_available = true;
    }

    if (categoryId) {
      where.category_id = categoryId;
    }

    // Get total count
    const total = await prisma.products.count({ where });

    // Fetch products with pagination and sorting
    const products = await prisma.products.findMany({
      where,
      include: {
        categories: true,
      },
      orderBy: {
        sort_order: "asc",
      },
      skip: parseInt(skip as string) || 0,
      take: Math.min(parseInt(take as string) || 20, 100), // Max 100 per page
    });

    return res.status(200).json({
      message: "Products fetched successfully",
      data: products,
      pagination: {
        total,
        skip: parseInt(skip as string) || 0,
        take: parseInt(take as string) || 20,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId =
      typeof req.params?.productId === "string"
        ? req.params?.productId
        : req.params?.productId?.length
          ? req.params?.productId[0]
          : undefined;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await prisma.products.findUnique({
      where: { id: productId },
      include: {
        categories: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      category_id,
      name,
      description,
      sku,
      barcode,
      price,
      compare_at_price,
      cost_price,
      tax_percentage,
      stock_quantity,
      track_inventory,
      is_available,
      is_featured,
      sort_order,
    } = req.body;

    // Verify category exists
    const category = await prisma.categories.findUnique({
      where: { id: category_id },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Create product
    const product = await prisma.products.create({
      data: {
        category_id,
        name,
        description: description || null,
        sku: sku || null,
        barcode: barcode || null,
        price: parseFloat(price.toString()),
        compare_at_price: compare_at_price ? parseFloat(compare_at_price.toString()) : null,
        cost_price: cost_price ? parseFloat(cost_price.toString()) : null,
        tax_percentage: tax_percentage ? parseFloat(tax_percentage.toString()) : 0,
        stock_quantity: stock_quantity || 0,
        track_inventory: track_inventory || false,
        is_available: is_available !== undefined ? is_available : true,
        is_featured: is_featured || false,
        sort_order: sort_order || 0,
      },
      include: {
        categories: true,
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
        const  productId  = "asd";

    // const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists
    const existingProduct = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      category_id,
      name,
      description,
      sku,
      barcode,
      price,
      compare_at_price,
      cost_price,
      tax_percentage,
      stock_quantity,
      track_inventory,
      is_available,
      is_featured,
      sort_order,
    } = req.body;

    // Verify category exists if provided
    if (category_id) {
      const category = await prisma.categories.findUnique({
        where: { id: category_id },
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    // Build update data
    const updateData: any = {};
    if (category_id !== undefined) updateData.category_id = category_id;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;
    if (sku !== undefined) updateData.sku = sku || null;
    if (barcode !== undefined) updateData.barcode = barcode || null;
    if (price !== undefined) updateData.price = parseFloat(price.toString());
    if (compare_at_price !== undefined) updateData.compare_at_price = compare_at_price ? parseFloat(compare_at_price.toString()) : null;
    if (cost_price !== undefined) updateData.cost_price = cost_price ? parseFloat(cost_price.toString()) : null;
    if (tax_percentage !== undefined) updateData.tax_percentage = parseFloat(tax_percentage.toString());
    if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity;
    if (track_inventory !== undefined) updateData.track_inventory = track_inventory;
    if (is_available !== undefined) updateData.is_available = is_available;
    if (is_featured !== undefined) updateData.is_featured = is_featured;
    if (sort_order !== undefined) updateData.sort_order = sort_order;

    // Update product
    const updatedProduct = await prisma.products.update({
      where: { id: productId },
      data: updateData,
      include: {
        categories: true,
      },
    });

    return res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

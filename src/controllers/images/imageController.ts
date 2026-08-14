import fs from "fs";
import type { Request, Response } from "express";
import prisma from "../../utils/prisma";

const ENTITY_TYPES = [
  "USER",
  "PRODUCT",
  "CATEGORY",
  "BANNER",
  "STORE",
] as const;

type EntityType = (typeof ENTITY_TYPES)[number];

const isValidEntityType = (value: string): value is EntityType =>
  ENTITY_TYPES.includes(value as EntityType);

const ensureEntityExists = async (entityType: EntityType, entityId: string) => {
  switch (entityType) {
    case "USER":
      return prisma.users.findUnique({ where: { id: entityId } });
    case "PRODUCT":
      return prisma.products.findUnique({ where: { id: entityId } });
    case "CATEGORY":
      return prisma.categories.findUnique({ where: { id: entityId } });
    case "BANNER":
      return prisma.banners.findUnique({ where: { id: entityId } });
    case "STORE":
      return true;
    default:
      return false;
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  const uploadedFile = req.file as Express.Multer.File | undefined;

  try {
    const {
      entity_type,
      entity_id,
      image_url,
      image_type,
      alt_text,
      display_order,
      is_primary,
    } = req.body;

    const normalizedType =
      typeof entity_type === "string"
        ? entity_type.trim().toUpperCase()
        : undefined;

    if (!normalizedType || !isValidEntityType(normalizedType)) {
      return res.status(400).json({
        message:
          "Invalid entity_type. Allowed values: USER, PRODUCT, CATEGORY, BANNER, STORE",
      });
    }

    if (!entity_id) {
      return res.status(400).json({
        message: "entity_id is required",
      });
    }

    const resolvedImageUrl = uploadedFile
      ? `/uploads/images/${uploadedFile.filename}`
      : typeof image_url === "string"
        ? image_url.trim()
        : "";

    if (!resolvedImageUrl) {
      return res.status(400).json({
        message: "Please upload an image file or provide image_url",
      });
    }

    const existingEntity = await ensureEntityExists(normalizedType, entity_id);

    if (normalizedType !== "STORE" && !existingEntity) {
      return res.status(404).json({
        message: `${normalizedType} not found`,
      });
    }

    const image =
      normalizedType === "PRODUCT"
        ? await prisma.product_images.create({
            data: {
              product_id: entity_id,
              image_url: resolvedImageUrl,
              image_type: image_type || "IMAGE",
              alt_text: alt_text || null,
              display_order: display_order ?? 0,
              is_primary: is_primary ?? false,
            },
          })
        : await prisma.images.create({
            data: {
              entity_type: normalizedType,
              entity_id,
              image_url: resolvedImageUrl,
              image_type: image_type || "IMAGE",
              alt_text: alt_text || null,
              display_order: display_order ?? 0,
              is_primary: is_primary ?? false,
            },
          });

    return res.status(201).json({
      message: "Image uploaded successfully",
      data: image,
      image_url: resolvedImageUrl,
    });
  } catch (error) {
    if (uploadedFile) {
      const filePath = `/Users/hassan/Documents/Hassan/Research/restaurent/uploads/images/${uploadedFile.filename}`;
      try {
        fs.unlinkSync(filePath);
      } catch (_cleanupError) {
        console.error(
          "Failed to delete uploaded file after error:",
          _cleanupError,
        );
      }
    }

    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

import { z } from "zod";

// The schema defines the rules for creating a new sweet.
export const createSweetSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  category: z.string().min(3, { message: "Category is required" }),
  price: z.number().positive({ message: "Price must be a positive number" }),
  quantity: z
    .number()
    .int()
    .nonnegative({ message: "Quantity must be a non-negative integer" }),
});

// A separate schema for updates, where all fields are optional.
export const updateSweetSchema = createSweetSchema.partial();
export type sweet = z.infer<typeof createSweetSchema>;

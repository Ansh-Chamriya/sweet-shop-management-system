import { describe, expect, it } from "vitest";
import { createSweetSchema } from "../schema";

describe("CreateSweet: Unit tests", () => {
  it("should pass validation with correct and complete data", () => {
    const validData = {
      name: "Gulab Jamun",
      category: "Milk based",
      price: 20,
      quantity: 50,
    };
    const result = createSweetSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe("Required Field Testing", () => {
    it('should fail validation if "name" is missing', () => {
      // name is missing
      const invalidData = {
        category: "Chocolate",
        price: 10,
        quantity: 100,
      };
      const result = createSweetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
    it('should fail validation if "price" is missing', () => {
      // price is missing
      const invalidData = {
        name: "Cake",
        category: "Cake",
        quantity: 100,
      };
      const result = createSweetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
    describe("Data Type Testing", () => {
      it('should fail validation if "price" is a string', () => {
        // Invalid data type
        const invalidData = {
          name: "Lollipop",
          category: "Candy",
          price: "two dollars",
          quantity: 50,
        };
        const result = createSweetSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
      it('should fail validation if "quantity" is null', () => {
        // Invalid data type
        const invalidData = {
          name: "Lollipop",
          category: "Candy",
          price: 1.0,
          quantity: null,
        };
        const result = createSweetSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
    describe("String Constraint Testing", () => {
      it('should fail validation if "name" is shorter than the minimum length', () => {
        const invalidData = {
          name: "A", // Fails min(2)
          category: "Pastry",
          price: 4.0,
          quantity: 20,
        };
        const result = createSweetSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should fail validation if "category" is an empty string', () => {
        const invalidData = {
          name: "Valid Name",
          category: "", // Fails min(3)
          price: 4.0,
          quantity: 20,
        };
        const result = createSweetSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should pass validation if "name" is exactly the minimum length', () => {
        const validData = {
          name: "Go", // Passes min(2)
          category: "Candy",
          price: 1.0,
          quantity: 100,
        };
        const result = createSweetSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe("Number Constraint Testing", () => {
      it('should fail validation if "price" is zero', () => {
        const invalidData = {
          name: "Freebie",
          category: "Promo",
          price: 0, // Fails positive()
          quantity: 1000,
        };
        const result = createSweetSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should fail validation if "quantity" is a negative number', () => {
        const invalidData = {
          name: "Debt Sweet",
          category: "Imaginary",
          price: 9.99,
          quantity: -1, // Fails non-negative()
        };
        const result = createSweetSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should fail validation if "quantity" is a floating-point number', () => {
        const invalidData = {
          name: "Chocolate Cookie",
          category: "Cookie",
          price: 1.5,
          quantity: 10.5, // Fails int()
        };
        const result = createSweetSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should pass validation if "quantity" is zero', () => {
        const validData = {
          name: "Bar",
          category: "Chocolate",
          price: 2.0,
          quantity: 0, // Passes non-negative()
        };
        const result = createSweetSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe("Edge Case Testing", () => {
      it("should pass validation even if extra fields are present", () => {
        const dataWithExtraField = {
          name: "Super-Sweet",
          category: "special",
          price: 99.99,
          quantity: 1,
          supplier: "A-Corp", // Extra field
        };
        const result = createSweetSchema.safeParse(dataWithExtraField);
        // Zod strips extra fields by default, so validation succeeds.
        expect(result.success).toBe(true);
      });
    });
  });
});

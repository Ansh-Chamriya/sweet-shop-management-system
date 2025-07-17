import { FilterState } from "../components/SearchFilters";
import { Sweet } from "../components/SweetCard";

// API base URL - change this to your API server URL
const API_BASE_URL = "http://localhost:3000/api";

// API service functions
export const apiService = {
  // Get all sweets with optional filters
  async getSweets(filters?: FilterState): Promise<Sweet[]> {
    try {
      let url = `${API_BASE_URL}/sweets`;

      // Add query parameters if filters are provided
      if (filters) {
        const params = new URLSearchParams();
        if (filters.name) params.append("name", filters.name);
        if (filters.category) params.append("category", filters.category);
        if (filters.minPrice)
          params.append("minPrice", filters.minPrice.toString());
        if (filters.maxPrice)
          params.append("maxPrice", filters.maxPrice.toString());

        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      console.log("Fetching sweets from:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(
          `Failed to fetch sweets: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();
      console.log("API Response:", data);
      // Map API response to Sweet interface (adjust field names if needed)
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        stock: item.quantity, // Note: API uses 'quantity' but frontend uses 'stock'
      }));
    } catch (error) {
      console.error("Error fetching sweets:", error);
      throw error;
    }
  },

  // Create a new sweet
  async createSweet(sweet: Omit<Sweet, "id">): Promise<Sweet> {
    try {
      console.log("Creating sweet:", sweet);
      const payload = {
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.stock, // Convert stock to quantity for API
      };

      const response = await fetch(`${API_BASE_URL}/sweets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(
          `Failed to create sweet: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Sweet created:", data);
      return {
        id: data.id,
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.quantity,
      };
    } catch (error) {
      console.error("Error creating sweet:", error);
      throw error;
    }
  },

  // Purchase a sweet (decrease quantity)
  async purchaseSweet(id: number, quantity: number = 1): Promise<Sweet> {
    try {
      const response = await fetch(`${API_BASE_URL}/sweets/${id}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to purchase sweet");
      }

      const data = await response.json();
      return {
        id: data.id,
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.quantity,
      };
    } catch (error) {
      console.error("Error purchasing sweet:", error);
      throw error;
    }
  },

  // Restock a sweet (increase quantity)
  async restockSweet(id: number, quantity: number = 10): Promise<Sweet> {
    try {
      const response = await fetch(`${API_BASE_URL}/sweets/${id}/restock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) throw new Error("Failed to restock sweet");

      const data = await response.json();
      return {
        id: data.id,
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.quantity,
      };
    } catch (error) {
      console.error("Error restocking sweet:", error);
      throw error;
    }
  },

  // Delete a sweet
  async deleteSweet(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/sweets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete sweet");
    } catch (error) {
      console.error("Error deleting sweet:", error);
      throw error;
    }
  },
};

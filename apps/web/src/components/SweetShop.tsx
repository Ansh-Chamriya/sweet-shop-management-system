import { useState, useEffect } from "react";
import { Sweet } from "./SweetCard";
import { SearchFilters, FilterState } from "./SearchFilters";
import { Header } from "./Header";
import { SweetsList } from "./SweetsList";
import { toast } from "@/hooks/use-toast";
import { apiService } from "../services/apiService";

export const SweetShop = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    category: "",
    minPrice: 0,
    maxPrice: 500,
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for stored preference or default to true
    const savedTheme = localStorage.getItem("theme");
    // Return true for 'dark' or if no preference is saved
    return savedTheme === null ? true : savedTheme === "dark";
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial data fetch
  useEffect(() => {
    fetchSweets();
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Fetch sweets from API
  const fetchSweets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getSweets();
      setSweets(data);
      setFilteredSweets(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch sweets from API. Is the server running?");
      setLoading(false);
      toast({
        title: "Error",
        description:
          "Failed to connect to the API. Check if the server is running.",
        variant: "destructive",
      });
    }
  };

  // Apply filters directly from the API
  const applyFilters = async () => {
    try {
      setLoading(true);
      // Use API filtering if all filters are applied, otherwise filter client-side
      if (
        filters.name ||
        filters.category ||
        filters.minPrice > 0 ||
        filters.maxPrice < 500
      ) {
        const filteredData = await apiService.getSweets(filters);
        setFilteredSweets(filteredData);
      } else {
        setFilteredSweets(sweets);
      }
      setLoading(false);
    } catch (err) {
      setError("Error applying filters");
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to apply filters. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Apply filters when filters change
  useEffect(() => {
    if (sweets.length > 0) {
      applyFilters();
    }
  }, [filters]);

  const handlePurchase = async (id: number) => {
    try {
      const updatedSweet = await apiService.purchaseSweet(id, 1);

      // Update the sweet in the local state
      setSweets((prevSweets) =>
        prevSweets.map((sweet) =>
          sweet.id === id ? { ...sweet, stock: updatedSweet.stock } : sweet
        )
      );

      // Also update in the filtered sweets
      setFilteredSweets((prevSweets) =>
        prevSweets.map((sweet) =>
          sweet.id === id ? { ...sweet, stock: updatedSweet.stock } : sweet
        )
      );

      toast({
        title: "Purchase Successful",
        description: `Purchased 1 ${updatedSweet.name}`,
      });
    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.message || "Could not purchase sweet",
        variant: "destructive",
      });
    }
  };

  const handleRestock = async (id: number) => {
    try {
      const updatedSweet = await apiService.restockSweet(id, 10);

      // Update the sweet in the local state
      setSweets((prevSweets) =>
        prevSweets.map((sweet) =>
          sweet.id === id ? { ...sweet, stock: updatedSweet.stock } : sweet
        )
      );

      // Also update in the filtered sweets
      setFilteredSweets((prevSweets) =>
        prevSweets.map((sweet) =>
          sweet.id === id ? { ...sweet, stock: updatedSweet.stock } : sweet
        )
      );

      toast({
        title: "Restock Successful",
        description: `Added 10 more ${updatedSweet.name} to inventory`,
      });
    } catch (error: any) {
      toast({
        title: "Restock Failed",
        description: error.message || "Could not restock sweet",
        variant: "destructive",
      });
    }
  };

  const handleAddSweet = async (sweetData: Omit<Sweet, "id">) => {
    try {
      setLoading(true);
      const newSweet = await apiService.createSweet(sweetData);

      // Add the new sweet to the local state
      setSweets((prev) => [...prev, newSweet]);
      // Also add to filtered sweets if it matches the current filters
      setFilteredSweets((prev) => [...prev, newSweet]);

      toast({
        title: "Sweet Added",
        description: `Successfully added ${newSweet.name} to inventory`,
      });
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Failed to Add Sweet",
        description: error.message || "Could not add new sweet",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleAddDummyData = () => {
    const createDummySweet = async () => {
      try {
        const newSweet = await apiService.createSweet({
          name: `Dummy Sweet ${Math.floor(Math.random() * 100)}`,
          category: ["Chocolate", "Candy", "Pastry", "Ice Cream", "Cake"][
            Math.floor(Math.random() * 5)
          ],
          price: Math.floor(Math.random() * 300) + 50,
          stock: Math.floor(Math.random() * 50) + 10,
        });

        // Add the new sweet to the local state
        setSweets((prev) => [...prev, newSweet]);
        // Also add to filtered sweets if it matches the current filters
        setFilteredSweets((prev) => [...prev, newSweet]);

        toast({
          title: "Dummy Data Added",
          description: `Successfully added ${newSweet.name} to inventory`,
        });
      } catch (error: any) {
        toast({
          title: "Failed to Add Dummy Data",
          description: error.message || "Could not add dummy sweet",
          variant: "destructive",
        });
      }
    };

    createDummySweet();
  };

  const handleSearch = async () => {
    await applyFilters();
    toast({
      title: "Search Applied",
      description: `Found ${filteredSweets.length} sweets matching your criteria.`,
    });
  };

  const handleClear = async () => {
    // Reset filters
    setFilters({
      name: "",
      category: "",
      minPrice: 0,
      maxPrice: 500,
    });

    // Fetch all sweets again
    await fetchSweets();

    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
    });
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    // Save preference to localStorage
    localStorage.setItem("theme", newMode ? "dark" : "light");
    toast({
      title: newMode ? "Dark Mode" : "Light Mode",
      description: `Switched to ${newMode ? "dark" : "light"} mode.`,
    });
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header
        onRefresh={fetchSweets}
        onAddDummyData={handleAddDummyData}
        onAddSweet={handleAddSweet}
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        loading={loading}
      />

      <main className="container mx-auto px-4 sm:px-6 py-8 overflow-y-auto">
        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        <SweetsList
          sweets={filteredSweets}
          loading={loading}
          error={error}
          onPurchase={handlePurchase}
          onRestock={handleRestock}
          onRetry={fetchSweets}
        />
      </main>
    </div>
  );
};

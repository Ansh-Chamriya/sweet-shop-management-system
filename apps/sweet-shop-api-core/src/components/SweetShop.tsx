import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SweetCard, Sweet } from "./SweetCard";
import { SearchFilters, FilterState } from "./SearchFilters";
import { Plus, Moon, Sun, Store } from "lucide-react";
import { toast } from "@/hooks/use-toast";
// Mock data for demonstration
const mockSweets: Sweet[] = [
  {
    id: 257603,
    name: "Vanilla Cupcake",
    category: "Chocolate",
    price: 106.65,
    stock: 26,
  },
  {
    id: 843020,
    name: "Milkshake",
    category: "Donut",
    price: 463.52,
    stock: 97,
  },
  { id: 2911, name: "Praline", category: "Pie", price: 136.82, stock: 87 },
  {
    id: 489934,
    name: "Gumdrops",
    category: "Ice Cream",
    price: 190.43,
    stock: 33,
  },
  {
    id: 623683,
    name: "Cobbler",
    category: "Strawberry",
    price: 468.12,
    stock: 24,
  },
  {
    id: 291245,
    name: "Vanilla Cupcake 1",
    category: "Cake",
    price: 330.33,
    stock: 100,
  },
  { id: 976112, name: "Lollipop", category: "Candy", price: 89.99, stock: 45 },
  {
    id: 425917,
    name: "Chocolate Truffle",
    category: "Chocolate",
    price: 275.5,
    stock: 18,
  },
  { id: 871952, name: "Praline 1", category: "Pie", price: 142.3, stock: 62 },
];

export const SweetShop = () => {
  const [sweets, setSweets] = useState<Sweet[]>(mockSweets);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>(mockSweets);
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    category: "",
    minPrice: 0,
    maxPrice: 500,
  });
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    applyFilters();
  }, [filters, sweets]);

  const applyFilters = () => {
    let filtered = sweets;

    if (filters.name) {
      filtered = filtered.filter((sweet) =>
        sweet.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(
        (sweet) =>
          sweet.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    filtered = filtered.filter(
      (sweet) =>
        sweet.price >= filters.minPrice && sweet.price <= filters.maxPrice
    );

    setFilteredSweets(filtered);
  };

  const handlePurchase = (id: number) => {
    setSweets((prevSweets) =>
      prevSweets.map((sweet) =>
        sweet.id === id
          ? { ...sweet, stock: Math.max(0, sweet.stock - 1) }
          : sweet
      )
    );
  };

  const handleRestock = (id: number) => {
    setSweets((prevSweets) =>
      prevSweets.map((sweet) =>
        sweet.id === id ? { ...sweet, stock: sweet.stock + 10 } : sweet
      )
    );
  };

  const handleAddSweet = () => {
    toast({
      title: "Add Sweet",
      description: "Add sweet functionality would be implemented here.",
    });
  };

  const handleAddDummyData = () => {
    const newSweet: Sweet = {
      id: Math.floor(Math.random() * 999999),
      name: "New Sweet",
      category: "Chocolate",
      price: Math.floor(Math.random() * 300) + 50,
      stock: Math.floor(Math.random() * 50) + 10,
    };
    setSweets((prev) => [...prev, newSweet]);
    toast({
      title: "Dummy Data Added",
      description: "A new sweet has been added to the inventory.",
    });
  };

  const handleSearch = () => {
    applyFilters();
    toast({
      title: "Search Applied",
      description: `Found ${filteredSweets.length} sweets matching your criteria.`,
    });
  };

  const handleClear = () => {
    setFilteredSweets(sweets);
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toast({
      title: isDarkMode ? "Light Mode" : "Dark Mode",
      description: `Switched to ${isDarkMode ? "light" : "dark"} mode.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                Sweet Shop Management
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleAddDummyData}
                className="flex items-center gap-2"
              >
                Add Dummy Data
              </Button>
              <Button
                onClick={handleAddSweet}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Sweet
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="ml-2"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            All Sweets ({filteredSweets.length} items)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSweets.map((sweet) => (
            <SweetCard
              key={sweet.id}
              sweet={sweet}
              onPurchase={handlePurchase}
              onRestock={handleRestock}
            />
          ))}
        </div>

        {filteredSweets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No sweets found matching your criteria.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

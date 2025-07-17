import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useState } from "react";

export interface FilterState {
  name: string;
  category: string;
  minPrice: number;
  maxPrice: number;
}

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onSearch: () => void;
  onClear: () => void;
}

const categories = [
  "All Categories",
  "Chocolate",
  "Donut",
  "Milk based",
  "Nut based",
  "Pie",
  "Ice Cream",
  "Strawberry",
  "Cake",
  "Candy",
];

export const SearchFilters = ({
  filters,
  onFiltersChange,
  onSearch,
  onClear,
}: SearchFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (
    field: keyof FilterState,
    value: string | number
  ) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      name: "",
      category: "",
      minPrice: 0,
      maxPrice: 500,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClear();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Name
          </label>
          <Input
            placeholder="Search by name..."
            value={localFilters.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="filter-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Category
          </label>
          <Select
            value={localFilters.category}
            onValueChange={(value) =>
              handleInputChange(
                "category",
                value === "All Categories" ? "" : value
              )
            }
          >
            <SelectTrigger className="filter-input">
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Price Range (₹{localFilters.minPrice} - ₹{localFilters.maxPrice})
          </label>
          <div className="flex flex-col md:flex-row mt-3 gap-4">
            <div className="w-full flex mt-4 gap-3">
              <input
                type="range"
                min="0"
                max="500"
                value={localFilters.minPrice}
                onChange={(e) =>
                  handleInputChange("minPrice", Number(e.target.value))
                }
                className="price-range-slider flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onSearch} className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
};

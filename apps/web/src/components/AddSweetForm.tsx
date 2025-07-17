import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Sweet } from "./SweetCard";

interface AddSweetFormProps {
  onSweetAdded: (sweet: Omit<Sweet, "id">) => void;
  isLoading: boolean;
}

const categories = [
  "Chocolate",
  "Candy",
  "Milk based",
  "Nut based",
  "Pastry",
  "Ice Cream",
  "Cake",
  "Donut",
  "Pie",
  "Cookie",
];

export const AddSweetForm = ({
  onSweetAdded,
  isLoading,
}: AddSweetFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Sweet, "id">>({
    name: "",
    category: "Chocolate",
    price: 1.99,
    stock: 10,
  });

  const handleChange = (
    field: keyof Omit<Sweet, "id">,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSweetAdded(formData);
    // Reset form and close dialog
    setFormData({
      name: "",
      category: "Chocolate",
      price: 1.99,
      stock: 10,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" disabled={isLoading}>
          <Plus className="h-4 w-4" />
          Add Sweet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Sweet</DialogTitle>
            <DialogDescription>
              Enter the details for the new sweet item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
                placeholder="Chocolate Fudge"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger id="category" className="col-span-3">
                  <SelectValue placeholder="Select a category" />
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  handleChange("price", parseFloat(e.target.value))
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Quantity
              </Label>
              <Input
                id="stock"
                type="number"
                min="1"
                step="1"
                value={formData.stock}
                onChange={(e) =>
                  handleChange("stock", parseInt(e.target.value, 10))
                }
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !formData.name}>
              {isLoading ? "Adding..." : "Add Sweet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

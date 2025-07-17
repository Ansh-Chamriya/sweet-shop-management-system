import { Button } from "@/components/ui/button";
import { ShoppingCart, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: number) => void;
  onRestock: (id: number) => void;
}

export const SweetCard = ({ sweet, onPurchase, onRestock }: SweetCardProps) => {
  const handlePurchase = () => {
    if (sweet.stock > 0) {
      onPurchase(sweet.id);
      toast({
        title: "Purchase Successful",
        description: `${sweet.name} has been purchased!`,
      });
    } else {
      toast({
        title: "Out of Stock",
        description: `${sweet.name} is currently out of stock.`,
        variant: "destructive",
      });
    }
  };

  const handleRestock = () => {
    onRestock(sweet.id);
    toast({
      title: "Restock Successful",
      description: `${sweet.name} has been restocked!`,
    });
  };

  return (
    <div className="sweet-card">
      <div className="mb-4">
        <div className="text-sm text-muted-foreground mb-2">
          Sweet#{sweet.id.toString().padStart(6, '0')}
        </div>
        <h3 className="text-xl font-bold text-card-foreground mb-2">
          {sweet.name}
        </h3>
        <div className="text-sm text-muted-foreground mb-4">
          {sweet.category}
        </div>
        <div className="text-2xl font-bold text-primary mb-2">
          ₹{sweet.price.toFixed(2)}
        </div>
        <div className="text-sm text-muted-foreground mb-6">
          {sweet.stock} available
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button
          variant="purchase"
          className="flex-1"
          onClick={handlePurchase}
          disabled={sweet.stock === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          Purchase
        </Button>
        <Button
          variant="restock"
          className="flex-1"
          onClick={handleRestock}
        >
          <RefreshCw className="h-4 w-4" />
          Restock
        </Button>
      </div>
    </div>
  );
};
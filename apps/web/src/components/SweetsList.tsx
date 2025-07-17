import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Sweet, SweetCard } from "./SweetCard";

interface SweetsListProps {
  sweets: Sweet[];
  loading: boolean;
  error: string | null;
  onPurchase: (id: number) => void;
  onRestock: (id: number) => void;
  onRetry: () => void;
}

export const SweetsList = ({
  sweets,
  loading,
  error,
  onPurchase,
  onRestock,
  onRetry,
}: SweetsListProps) => {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">
          All Sweets ({sweets.length} items)
        </h2>
        {loading && (
          <div className="text-sm text-muted-foreground flex items-center">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Loading...
          </div>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 mb-6 rounded-md">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
          <Button variant="outline" className="mt-2" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweets.map((sweet) => (
            <SweetCard
              key={sweet.id}
              sweet={sweet}
              onPurchase={onPurchase}
              onRestock={onRestock}
            />
          ))}
        </div>
      )}

      {!loading && !error && sweets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No sweets found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

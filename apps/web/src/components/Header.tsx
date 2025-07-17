import { Button } from "@/components/ui/button";
import { Moon, Sun, Store, RefreshCw } from "lucide-react";
import { AddSweetForm } from "./AddSweetForm";
import { Sweet } from "./SweetCard";

interface HeaderProps {
  onRefresh: () => void;
  onAddDummyData: () => void;
  onAddSweet: (sweetData: Omit<Sweet, "id">) => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  loading: boolean;
}

export const Header = ({
  onRefresh,
  onAddDummyData,
  onAddSweet,
  onToggleDarkMode,
  isDarkMode,
  loading,
}: HeaderProps) => {
  return (
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
              onClick={onRefresh}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={onAddDummyData}
              className="flex items-center gap-2"
              disabled={loading}
            >
              Add Dummy Data
            </Button>
            <AddSweetForm onSweetAdded={onAddSweet} isLoading={loading} />
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
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
  );
};

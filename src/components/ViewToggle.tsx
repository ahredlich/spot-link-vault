import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  className?: string;
}

export const ViewToggle = ({ viewMode, onViewModeChange, className = "" }: ViewToggleProps) => {
  return (
    <div className={`view-toggle-group ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange("grid")}
        className={`view-toggle-button ${
          viewMode === "grid" ? "view-toggle-active" : "view-toggle-inactive"
        }`}
        aria-label="Grid view"
        aria-pressed={viewMode === "grid"}
      >
        <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange("list")}
        className={`view-toggle-button ${
          viewMode === "list" ? "view-toggle-active" : "view-toggle-inactive"
        }`}
        aria-label="List view"
        aria-pressed={viewMode === "list"}
      >
        <List className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
};
"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Upload, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ActionBarProps {
  selectedCount: number;
  onDeleteSelectedAction?: () => void;
  onAddCaseAction?: () => void;
  onExportAction?: () => void;
}

export function ActionBar({ selectedCount, onDeleteSelectedAction, onAddCaseAction, onExportAction }: ActionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        onClick={onAddCaseAction}
        className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 px-3 sm:px-4 rounded-md text-xs font-medium transition-all cursor-pointer"
      >
        <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
        <span className="hidden sm:inline">Add Data (One by One)</span>
        <span className="sm:hidden">Add</span>
      </Button>

      <Button
        size="sm"
        onClick={() =>
          toast.success("Bulk upload dialog would open here", {
            description: "Upload an Excel file (.xlsx) to import multiple cases at once.",
          })
        }
        className="bg-sky-600 hover:bg-sky-500 text-white h-8 px-3 sm:px-4 rounded-md text-xs font-medium transition-all cursor-pointer"
      >
        <Upload className="w-3.5 h-3.5 mr-1.5" />
        <span className="hidden sm:inline">Add Data (Bulk Excel)</span>
        <span className="sm:hidden">Bulk</span>
      </Button>

      <Button
        size="sm"
        onClick={onExportAction}
        className="bg-amber-600 hover:bg-amber-500 text-white h-8 px-3 sm:px-4 rounded-md text-xs font-medium transition-all cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 mr-1.5" />
        <span className="hidden sm:inline">Export to Excel</span>
        <span className="sm:hidden">Export</span>
      </Button>

      <Button
        size="sm"
        onClick={() => {
          if (selectedCount === 0) {
            toast.error("No cases selected", {
              description: "Please select at least one case to delete.",
            });
          } else {
            if (onDeleteSelectedAction) onDeleteSelectedAction();
          }
        }}
        className="bg-rose-600 hover:bg-rose-500 text-white h-8 px-3 sm:px-4 rounded-md text-xs font-medium transition-all cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
        <span className="hidden sm:inline">Delete Selected</span>
        <span className="sm:hidden">Delete</span>
        {selectedCount > 0 && (
          <span className="ml-1.5 bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {selectedCount}
          </span>
        )}
      </Button>
    </div>
  );
}

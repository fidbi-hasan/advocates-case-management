"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react";

interface SearchFilters {
  hearingDateFrom: string;
  hearingDateTo: string;
  filingDateFrom: string;
  filingDateTo: string;
  branch: string;
  chequeNo: string;
  accountNameOrPlaintiff: string;
}

interface AdvancedSearchProps {
  filters: SearchFilters;
  onFiltersChangeAction: (filters: SearchFilters) => void;
  onSearchAction: () => void;
  onResetAction: () => void;
}

const branches = ["Motijheel", "Gulshan", "Banani", "Dhanmondi"];

const emptyFilters: SearchFilters = {
  hearingDateFrom: "",
  hearingDateTo: "",
  filingDateFrom: "",
  filingDateTo: "",
  branch: "",
  chequeNo: "",
  accountNameOrPlaintiff: "",
};

export { emptyFilters };
export type { SearchFilters };

export function AdvancedSearch({
  filters,
  onFiltersChangeAction,
  onSearchAction,
  onResetAction,
}: AdvancedSearchProps) {
  const updateFilter = (key: keyof SearchFilters, value: string) => {
    onFiltersChangeAction({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-md border border-slate-200 p-3 sm:p-4 space-y-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {/* Hearing Date From */}
        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 uppercase tracking-wider">
            Hearing Date (From)
          </Label>
          <Input
            type="date"
            value={filters.hearingDateFrom}
            onChange={(e) => updateFilter("hearingDateFrom", e.target.value)}
            className="bg-slate-50 border-slate-200 text-slate-800 h-9 text-xs rounded-md"
          />
        </div>

        {/* Hearing Date To */}
        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 uppercase tracking-wider">
            Hearing Date (To)
          </Label>
          <Input
            type="date"
            value={filters.hearingDateTo}
            onChange={(e) => updateFilter("hearingDateTo", e.target.value)}
            className="bg-slate-50 border-slate-200 text-slate-800 h-9 text-xs rounded-md"
          />
        </div>

        {/* Filing Date From */}
        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 uppercase tracking-wider">
            Filing Date (From)
          </Label>
          <Input
            type="date"
            value={filters.filingDateFrom}
            onChange={(e) => updateFilter("filingDateFrom", e.target.value)}
            className="bg-slate-50 border-slate-200 text-slate-800 h-9 text-xs rounded-md"
          />
        </div>

        {/* Filing Date To */}
        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 uppercase tracking-wider">
            Filing Date (To)
          </Label>
          <Input
            type="date"
            value={filters.filingDateTo}
            onChange={(e) => updateFilter("filingDateTo", e.target.value)}
            className="bg-slate-50 border-slate-200 text-slate-800 h-9 text-xs rounded-md"
          />
        </div>

        {/* Branch */}
        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 uppercase tracking-wider">
            Branch
          </Label>
          <Select
            value={filters.branch}
            onValueChange={(v) => updateFilter("branch", v ?? "")}
          >
            <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-800 h-9 text-xs cursor-pointer rounded-md">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              {branches.map((b) => (
                <SelectItem key={b} value={b} className="text-slate-700 text-xs cursor-pointer hover:bg-slate-50">
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cheque No */}
        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 uppercase tracking-wider">
            Cheque No.
          </Label>
          <Input
            type="text"
            placeholder="CHQ-XXXXXX"
            value={filters.chequeNo}
            onChange={(e) => updateFilter("chequeNo", e.target.value)}
            className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 h-9 text-xs rounded-md"
          />
        </div>

        {/* Account Name / Plaintiff */}
        <div className="space-y-1.5">
          <Label className="text-[11px] text-slate-500 uppercase tracking-wider">
            Account / Plaintiff
          </Label>
          <Input
            type="text"
            placeholder="Search name..."
            value={filters.accountNameOrPlaintiff}
            onChange={(e) =>
              updateFilter("accountNameOrPlaintiff", e.target.value)
            }
            className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 h-9 text-xs rounded-md"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          onClick={onSearchAction}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white h-8 px-5 rounded-md text-xs font-medium transition-all duration-200 hover:shadow-md hover:shadow-violet-200 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 mr-1.5" />
          Search
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onResetAction}
          className="text-slate-500 hover:text-slate-800 h-8 px-5 rounded-md text-xs font-medium hover:bg-slate-100 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset
        </Button>
      </div>
    </div>
  );
}

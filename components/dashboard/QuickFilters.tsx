"use client";

import { Button } from "@/components/ui/button";
import {
  CalendarPlus,
  CalendarMinus,
  FileWarning,
  Gavel,
  BookMarked,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuickFiltersProps {
  activeFilter: string | null;
  onFilterChangeAction: (filter: string | null) => void;
}

export function QuickFilters({ activeFilter, onFilterChangeAction }: QuickFiltersProps) {
  const categoryFilters = [
    { key: "ni", label: "NI Cases", icon: FileWarning, color: "text-amber-600", bg: "bg-amber-50" },
    { key: "ara", label: "ARA Cases", icon: Gavel, color: "text-rose-600", bg: "bg-rose-50" },
    { key: "judgement", label: "Judgement List", icon: BookMarked, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  const activeCategory = categoryFilters.find(f => f.key === activeFilter);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Primary Quick Access */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFilterChangeAction(activeFilter === "tomorrow" ? null : "tomorrow")}
        className={`rounded-xl h-10 px-4 text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm ${
          activeFilter === "tomorrow" 
            ? "bg-emerald-600 text-white shadow-emerald-200" 
            : "bg-white text-emerald-700 border border-emerald-100 hover:bg-emerald-50"
        }`}
      >
        <CalendarPlus className="w-4 h-4 mr-2" />
        Tomorrow
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFilterChangeAction(activeFilter === "yesterday" ? null : "yesterday")}
        className={`rounded-xl h-10 px-4 text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm ${
          activeFilter === "yesterday" 
            ? "bg-sky-600 text-white shadow-sky-200" 
            : "bg-white text-sky-700 border border-sky-100 hover:bg-sky-50"
        }`}
      >
        <CalendarMinus className="w-4 h-4 mr-2" />
        Yesterday
      </Button>

      {/* Categories Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`rounded-xl h-10 px-4 text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm border flex items-center justify-center ${
            activeCategory 
              ? "bg-slate-50 border-violet-200 text-violet-700" 
              : "bg-white text-slate-700 border-slate-100 hover:bg-slate-50"
          }`}
        >
          {activeCategory ? (
            <>
              <activeCategory.icon className={`w-4 h-4 mr-2 ${activeCategory.color}`} />
              {activeCategory.label}
            </>
          ) : (
            <>
              <LayoutGrid className="w-4 h-4 mr-2 text-slate-500" />
              Case Categories
            </>
          )}
          <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 p-1.5 rounded-xl shadow-xl border-slate-200 animate-in fade-in-0 zoom-in-95">
          {categoryFilters.map((filter) => {
            const Icon = filter.icon;
            return (
              <DropdownMenuItem
                key={filter.key}
                onClick={() => onFilterChangeAction(filter.key)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors"
              >
                <div className={`p-1.5 rounded-md ${filter.bg}`}>
                  <Icon className={`w-4 h-4 ${filter.color}`} />
                </div>
                <span className="font-medium text-slate-700">{filter.label}</span>
                {activeFilter === filter.key && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFilterChangeAction(null)}
        className={`rounded-xl h-10 px-4 text-sm font-medium transition-all duration-200 cursor-pointer ${
          !activeFilter ? "text-violet-600 bg-violet-50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
        }`}
      >
        <LayoutGrid className="w-4 h-4 mr-2" />
        All Cases
      </Button>
    </div>
  );
}

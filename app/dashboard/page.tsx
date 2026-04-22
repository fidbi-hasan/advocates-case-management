"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { QuickFilters } from "@/components/dashboard/QuickFilters";
import {
  AdvancedSearch,
  emptyFilters,
  type SearchFilters,
} from "@/components/dashboard/AdvancedSearch";
import { ActionBar } from "@/components/dashboard/ActionBar";
import { CaseTable } from "@/components/dashboard/CaseTable";
import { CaseDialog } from "@/components/dashboard/CaseDialog";
import { getAllCases, getCasesByFilter, deleteCases } from "@/services/caseData";
import type { LegalCase } from "@/data/mockCases";
import { Briefcase, Filter, Zap } from "lucide-react";

export default function DashboardPage() {
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(
    null
  );
  const [searchFilters, setSearchFilters] =
    useState<SearchFilters>(emptyFilters);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<LegalCase | null>(null);

  // Initial load
  useEffect(() => {
    const loadCases = async () => {
      setLoading(true);
      const data = await getAllCases();
      setCases(data);
      setLoading(false);
    };
    loadCases();
  }, []);

  // Quick filter handler
  const handleQuickFilterChange = useCallback(
    async (filter: string | null) => {
      setActiveQuickFilter(filter);
      setIsSearchActive(false);
      setSearchFilters(emptyFilters);
      setSelectedIds(new Set());
      setLoading(true);

      if (filter) {
        const data = await getCasesByFilter({
          quickFilter: filter as
            | "tomorrow"
            | "yesterday"
            | "ni"
            | "ara"
            | "judgement",
        });
        setCases(data);
      } else {
        const data = await getAllCases();
        setCases(data);
      }
      setLoading(false);
    },
    []
  );

  // Advanced search handler
  const handleSearch = useCallback(async () => {
    setActiveQuickFilter(null);
    setIsSearchActive(true);
    setSelectedIds(new Set());
    setLoading(true);

    const data = await getCasesByFilter({
      hearingDateFrom: searchFilters.hearingDateFrom || undefined,
      hearingDateTo: searchFilters.hearingDateTo || undefined,
      filingDateFrom: searchFilters.filingDateFrom || undefined,
      filingDateTo: searchFilters.filingDateTo || undefined,
      branch: searchFilters.branch || undefined,
      chequeNo: searchFilters.chequeNo || undefined,
      accountNameOrPlaintiff:
        searchFilters.accountNameOrPlaintiff || undefined,
    });
    setCases(data);
    setLoading(false);
  }, [searchFilters]);

  // Reset handler
  const handleReset = useCallback(async () => {
    setActiveQuickFilter(null);
    setIsSearchActive(false);
    setSearchFilters(emptyFilters);
    setSelectedIds(new Set());
    setLoading(true);
    const data = await getAllCases();
    setCases(data);
    setLoading(false);
  }, []);

  // Delete handler
  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} case(s)?`)) return;

    setLoading(true);
    const { error } = await deleteCases(Array.from(selectedIds));
    
    if (error) {
      toast.error("Failed to delete cases");
    } else {
      toast.success(`${selectedIds.size} case(s) deleted successfully`);
      const data = await getAllCases();
      setCases(data);
      setSelectedIds(new Set());
    }
    setLoading(false);
  }, [selectedIds]);

  // Success handler for adding/editing case
  const handleDialogSuccess = async () => {
    const data = await getAllCases();
    setCases(data);
  };

  const handleAddCase = () => {
    setEditingCase(null);
    setIsDialogOpen(true);
  };

  const handleEditCase = (c: LegalCase) => {
    setEditingCase(c);
    setIsDialogOpen(true);
  };

  const handleExport = useCallback(() => {
    if (cases.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "Branch", "Case No", "Case Type", "Account Name", "Filing Date", 
      "Sessions No", "Plaintiff", "Cheque No", "Bank", "Prev Status Date", 
      "Court", "Status", "Hearing Date"
    ].join(",");

    const rows = cases.map(c => [
      `"${c.branch}"`, `"${c.caseNo}"`, `"${c.caseType}"`, `"${c.accountName}"`, `"${c.filingDate}"`,
      `"${c.sessionsNo}"`, `"${c.plaintiff}"`, `"${c.chequeNo}"`, `"${c.bank}"`, `"${c.previousStatusDate}"`,
      `"${c.court}"`, `"${c.status}"`, `"${c.hearingDate}"`
    ].join(","));

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `legal_cases_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Data exported successfully!");
  }, [cases]);

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      {/* Case Dialog (Add/Edit) */}
      <CaseDialog 
        open={isDialogOpen} 
        onOpenChangeAction={setIsDialogOpen} 
        onSuccessAction={handleDialogSuccess}
        initialData={editingCase}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-violet-50">
            <Briefcase className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
              Command Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage and monitor all active legal cases
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isSearchActive && (
            <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 rounded-md px-3 py-1.5">
              <Filter className="w-3 h-3 text-violet-600" />
              <span className="text-[11px] text-violet-700 font-medium">
                Search Active
              </span>
            </div>
          )}
          {activeQuickFilter && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-md px-3 py-1.5">
              <Zap className="w-3 h-3 text-amber-600" />
              <span className="text-[11px] text-amber-700 font-medium capitalize">
                {activeQuickFilter} Filter
              </span>
            </div>
          )}
          <div className="bg-white border border-slate-200 rounded-md px-3 py-1.5 shadow-sm">
            <span className="text-xs text-slate-500">
              Total: <span className="text-slate-800 font-semibold">{cases.length}</span> cases
            </span>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <QuickFilters
        activeFilter={activeQuickFilter}
        onFilterChangeAction={handleQuickFilterChange}
      />

      {/* Advanced Search */}
      <AdvancedSearch
        filters={searchFilters}
        onFiltersChangeAction={setSearchFilters}
        onSearchAction={handleSearch}
        onResetAction={handleReset}
      />

      {/* Action Bar */}
      <ActionBar 
        selectedCount={selectedIds.size} 
        onDeleteSelectedAction={handleDeleteSelected}
        onAddCaseAction={handleAddCase}
        onExportAction={handleExport}
      />

      {/* Data Table */}
      {loading ? (
        <div className="bg-white rounded-md border border-slate-200 p-16 flex items-center justify-center shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Loading cases...</p>
          </div>
        </div>
      ) : (
        <CaseTable
          cases={cases}
          selectedIds={selectedIds}
          onSelectionChangeAction={setSelectedIds}
          onEditCaseAction={handleEditCase}
          onRefreshAction={handleDialogSuccess}
        />
      )}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Upload,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pencil,
  FileText,
  Trash2,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import type { LegalCase } from "@/data/mockCases";
import { getAllCases, uploadCasePDF, deleteCasePDF } from "@/services/caseData";
import { PDFViewerDialog } from "./PDFViewerDialog";

interface CaseTableProps {
  cases: LegalCase[];
  selectedIds: Set<string>;
  onSelectionChangeAction: (ids: Set<string>) => void;
  onEditCaseAction?: (c: LegalCase) => void;
  onRefreshAction?: () => void;
}

const ROWS_PER_PAGE = 10;

function StatusBadge({ status }: { status: LegalCase["status"] }) {
  const config = {
    Pending: "bg-slate-100 text-slate-600 border border-slate-200",
    "In Process": "bg-amber-50 text-amber-700 border border-amber-200",
    Disposed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Adjourned: "bg-sky-50 text-sky-700 border border-sky-200",
  };

  return (
    <Badge
      variant="outline"
      className={`${config[status]} text-[10px] font-medium px-2 py-0.5 rounded`}
    >
      {status}
    </Badge>
  );
}

function UploadPDFButton({ caseObj, onUploadSuccess }: { caseObj: LegalCase, onUploadSuccess?: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCheck, setShowCheck] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Invalid file type", { description: "Please upload a PDF document." });
      return;
    }

    setUploading(true);
    setProgress(0);
    
    const { url, error } = await uploadCasePDF(caseObj, file, (percent) => {
      setProgress(percent);
    });

    if (error) {
      toast.error("Upload failed", { description: error.message || "Could not upload PDF." });
      setUploading(false);
    } else {
      setShowCheck(true);
      setUploading(false);
      toast.success("PDF uploaded successfully!", {
        description: `Document for case ${caseObj.caseNo} has been stored.`,
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      });
      if (onUploadSuccess) onUploadSuccess();
      
      // Hide checkmark after 3 seconds
      setTimeout(() => setShowCheck(false), 3000);
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />
      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="ghost"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className={`h-7 w-7 p-0 rounded cursor-pointer relative ${
            showCheck 
              ? "text-emerald-600 bg-emerald-50" 
              : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
          }`}
          title="Upload PDF"
        >
          {uploading ? (
            <div className="relative flex items-center justify-center">
              <svg className="w-6 h-6 transform -rotate-90">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 10}
                  strokeDashoffset={2 * Math.PI * 10 * (1 - progress / 100)}
                  className="text-emerald-500 transition-all duration-300"
                />
              </svg>
              <span className="absolute text-[8px] font-bold text-emerald-600">{progress}%</span>
            </div>
          ) : showCheck ? (
            <CheckCircle2 className="w-4 h-4 animate-in zoom-in duration-300" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </>
  );
}

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "dd MMM yyyy");
  } catch {
    return dateStr;
  }
}

export function CaseTable({
  cases,
  selectedIds,
  onSelectionChangeAction,
  onEditCaseAction,
  onRefreshAction,
}: CaseTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [activeCaseNo, setActiveCaseNo] = useState("");

  const handleViewPdf = (url: string, caseNo: string) => {
    setActivePdfUrl(url);
    setActiveCaseNo(caseNo);
    setViewerOpen(true);
  };

  const totalPages = Math.max(1, Math.ceil(cases.length / ROWS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  if (safePage !== currentPage) {
    setCurrentPage(safePage);
  }

  const totalDocs = cases.reduce((acc, c) => acc + (c.pdfUrls?.length || 0), 0);

  const startIdx = (safePage - 1) * ROWS_PER_PAGE;
  const pageData = cases.slice(startIdx, startIdx + ROWS_PER_PAGE);

  const allOnPageSelected =
    pageData.length > 0 && pageData.every((c) => selectedIds.has(c.id));

  const toggleAll = () => {
    const newSet = new Set(selectedIds);
    if (allOnPageSelected) {
      pageData.forEach((c) => newSet.delete(c.id));
    } else {
      pageData.forEach((c) => newSet.add(c.id));
    }
    onSelectionChangeAction(newSet);
  };

  const toggleOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    onSelectionChangeAction(newSet);
  };

  return (
    <div className="space-y-3">
      {/* Table */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="w-10">
                  <Checkbox
                    checked={allOnPageSelected}
                    onCheckedChange={toggleAll}
                    className="border-slate-300 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 cursor-pointer"
                  />
                </TableHead>
                <TableHead className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                  Branch
                </TableHead>
                <TableHead className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                  Case No.
                </TableHead>
                <TableHead className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                  Account Name
                </TableHead>
                <TableHead className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                  Filing Date
                </TableHead>
                <TableHead className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                  Sessions No.
                </TableHead>
                <TableHead className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                  Plaintiff
                </TableHead>
                <TableHead className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                  Cheque No.
                </TableHead>
                <TableHead className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                  Prev. Status
                </TableHead>
                <TableHead className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                  Court
                </TableHead>
                <TableHead className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                  Status
                </TableHead>
                <TableHead className="text-[11px] text-slate-500 uppercase tracking-wider font-medium text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    className="text-center py-12 text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-500">No cases found</p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((c, i) => (
                  <TableRow
                    key={c.id}
                    className={`border-b border-slate-100 transition-colors hover:bg-slate-50/50 ${
                      selectedIds.has(c.id) ? "bg-violet-50/50" : ""
                    } ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(c.id)}
                        onCheckedChange={() => toggleOne(c.id)}
                        className="border-slate-300 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 font-medium whitespace-nowrap">
                      {c.branch}
                    </TableCell>
                    <TableCell className="text-xs text-violet-600 font-mono font-medium whitespace-nowrap">
                      {c.caseNo}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 max-w-[140px] truncate">
                      {c.accountName}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(c.filingDate)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-mono whitespace-nowrap">
                      {c.sessionsNo}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 max-w-[160px] truncate">
                      {c.plaintiff}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-mono whitespace-nowrap">
                      {c.chequeNo || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(c.previousStatusDate)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 max-w-[140px] truncate">
                      {c.court}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={c.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEditCaseAction?.(c)}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <UploadPDFButton 
                          caseObj={c} 
                          onUploadSuccess={onRefreshAction}
                        />
                        {c.pdfUrls && c.pdfUrls.length > 0 && (
                          <Popover>
                            <PopoverTrigger 
                              className={cn(
                                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                                "text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer relative"
                              )}
                              title="View PDFs"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                                {c.pdfUrls.length}
                              </span>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-64 p-2">
                              <div className="space-y-1">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
                                  Case Documents ({c.pdfUrls.length})
                                </p>
                                {c.pdfUrls.map((url, idx) => {
                                  const rawName = url?.split("/").pop() || "";
                                  const fileName = decodeURIComponent(rawName.includes("-") ? rawName.split("-")[0] : rawName) || `Document ${idx + 1}`;
                                  return (
                                    <div 
                                      key={url} 
                                      className="flex items-center justify-between gap-2 p-1.5 hover:bg-slate-50 rounded-md group"
                                    >
                                      <button
                                        onClick={() => handleViewPdf(url, c.caseNo)}
                                        className="flex items-center gap-2 flex-1 text-left overflow-hidden cursor-pointer"
                                      >
                                        <FileText className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                        <span className="text-xs text-slate-700 truncate font-medium">
                                          {fileName}
                                        </span>
                                      </button>
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-6 w-6 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                          onClick={async () => {
                                            if (confirm("Delete this document?")) {
                                              const { error } = await deleteCasePDF(c.id, url);
                                              if (error) {
                                                toast.error("Failed to delete PDF");
                                              } else {
                                                toast.success("PDF deleted");
                                                onRefreshAction?.();
                                              }
                                            }
                                          }}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                        <a 
                                          href={url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="h-6 w-6 flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-md"
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                        </a>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <PDFViewerDialog 
        open={viewerOpen} 
        onOpenChangeAction={setViewerOpen} 
        pdfUrl={activePdfUrl} 
        caseNo={activeCaseNo} 
      />

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-2">
        <p className="text-xs text-slate-500">
          Showing{" "}
          <span className="text-slate-700 font-medium">
            {cases.length === 0 ? 0 : startIdx + 1}
          </span>{" "}
          to{" "}
          <span className="text-slate-700 font-medium">
            {Math.min(startIdx + ROWS_PER_PAGE, cases.length)}
          </span>{" "}
          of{" "}
          <span className="text-slate-700 font-medium">{cases.length}</span>{" "}
          cases
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={safePage === 1}
            className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer rounded"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalPages ||
                Math.abs(p - safePage) <= 1
            )
            .reduce<(number | "...")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((item, i) =>
              item === "..." ? (
                <span key={`dots-${i}`} className="text-slate-400 px-1 text-xs">
                  ...
                </span>
              ) : (
                <Button
                  key={item}
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage(item as number)}
                  className={`w-8 h-8 text-xs font-medium rounded cursor-pointer ${
                    safePage === item
                      ? "bg-violet-600 text-white hover:bg-violet-500"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {item}
                </Button>
              )
            )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={safePage === totalPages}
            className="w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer rounded"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

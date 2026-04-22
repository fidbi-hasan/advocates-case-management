"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, X } from "lucide-react";

interface PDFViewerDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  pdfUrl: string | null;
  caseNo: string;
}

export function PDFViewerDialog({ open, onOpenChangeAction, pdfUrl, caseNo }: PDFViewerDialogProps) {
  if (!pdfUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-4 bg-white border-b flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <ExternalLink className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-800">Case Document: {caseNo}</DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">Live Preview from Secure Storage</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pr-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(pdfUrl, "_blank")}
              className="h-9 rounded-lg border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 bg-slate-100 relative flex items-center justify-center">
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-full border-none shadow-inner"
          >
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4 border border-slate-100">
              <div className="p-4 bg-amber-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Browser Preview Blocked</h3>
              <p className="text-sm text-slate-600 mb-6">
                Your browser is preventing the PDF from being shown in this window. You can open it in a new tab instead.
              </p>
              <Button
                onClick={() => window.open(pdfUrl, "_blank")}
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 px-6 font-medium shadow-lg shadow-violet-100"
              >
                Open Document in New Tab
              </Button>
            </div>
          </object>
        </div>
      </DialogContent>
    </Dialog>
  );
}

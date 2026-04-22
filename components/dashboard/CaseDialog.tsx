"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { addCase, updateCase } from "@/services/caseData";
import { type LegalCase } from "@/data/mockCases";

interface CaseDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onSuccessAction: () => void;
  initialData?: LegalCase | null;
}

export function CaseDialog({ open, onOpenChangeAction, onSuccessAction, initialData }: CaseDialogProps) {
  const [loading, setLoading] = useState(false);

  const defaultValues: Omit<LegalCase, "id"> = {
    branch: "Motijheel",
    caseNo: "",
    caseType: "NI Act",
    accountName: "",
    filingDate: new Date().toISOString().split("T")[0],
    sessionsNo: "",
    plaintiff: "",
    chequeNo: "",
    bank: "",
    previousStatusDate: "",
    court: "",
    status: "Pending",
    hearingDate: new Date().toISOString().split("T")[0],
    isJudgement: false,
    pdfUrls: [],
  };

  const [formData, setFormData] = useState<Omit<LegalCase, "id">>(defaultValues);

  // Update form data when initialData changes or dialog opens
  useEffect(() => {
    if (initialData) {
      setFormData({
        branch: initialData.branch,
        caseNo: initialData.caseNo,
        caseType: initialData.caseType,
        accountName: initialData.accountName,
        filingDate: initialData.filingDate,
        sessionsNo: initialData.sessionsNo,
        plaintiff: initialData.plaintiff,
        chequeNo: initialData.chequeNo,
        bank: initialData.bank,
        previousStatusDate: initialData.previousStatusDate,
        court: initialData.court,
        status: initialData.status,
        hearingDate: initialData.hearingDate,
        isJudgement: initialData.isJudgement,
        pdfUrls: initialData.pdfUrls || [],
      });
    } else {
      setFormData(defaultValues);
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let result;
    if (initialData) {
      result = await updateCase(initialData.id, formData);
    } else {
      result = await addCase(formData);
    }

    const { error } = result;

    if (error) {
      toast.error(initialData ? "Failed to update case" : "Failed to add case", { description: error.message });
    } else {
      toast.success(initialData ? "Case updated successfully!" : "Case added successfully!");
      onSuccessAction();
      onOpenChangeAction(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            {initialData ? "Edit Case Record" : "Add New Case Record"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select
                value={formData.branch}
                onValueChange={(val) => setFormData({ ...formData, branch: val! })}
              >
                <SelectTrigger id="branch">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Motijheel">Motijheel</SelectItem>
                  <SelectItem value="Gulshan">Gulshan</SelectItem>
                  <SelectItem value="Banani">Banani</SelectItem>
                  <SelectItem value="Dhanmondi">Dhanmondi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caseNo">Case Number</Label>
              <Input
                id="caseNo"
                required
                value={formData.caseNo}
                onChange={(e) => setFormData({ ...formData, caseNo: e.target.value })}
                placeholder="e.g. NI-0223/2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="caseType">Case Type</Label>
              <Select
                value={formData.caseType}
                onValueChange={(val: any) => setFormData({ ...formData, caseType: val! })}
              >
                <SelectTrigger id="caseType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NI Act">NI Act</SelectItem>
                  <SelectItem value="CR/ARA">CR/ARA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val: any) => setFormData({ ...formData, status: val! })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Process">In Process</SelectItem>
                  <SelectItem value="Disposed">Disposed</SelectItem>
                  <SelectItem value="Adjourned">Adjourned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                required
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                placeholder="Client or account name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plaintiff">Plaintiff</Label>
              <Input
                id="plaintiff"
                required
                value={formData.plaintiff}
                onChange={(e) => setFormData({ ...formData, plaintiff: e.target.value })}
                placeholder="Plaintiff name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filingDate">Filing Date</Label>
              <Input
                id="filingDate"
                type="date"
                required
                value={formData.filingDate}
                onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hearingDate">Hearing Date</Label>
              <Input
                id="hearingDate"
                type="date"
                required
                value={formData.hearingDate}
                onChange={(e) => setFormData({ ...formData, hearingDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionsNo">Sessions Number</Label>
              <Input
                id="sessionsNo"
                required
                value={formData.sessionsNo}
                onChange={(e) => setFormData({ ...formData, sessionsNo: e.target.value })}
                placeholder="e.g. SJ-2024-0189"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="court">Court</Label>
              <Input
                id="court"
                required
                value={formData.court}
                onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                placeholder="Court name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chequeNo">Cheque Number (Optional)</Label>
              <Input
                id="chequeNo"
                value={formData.chequeNo}
                onChange={(e) => setFormData({ ...formData, chequeNo: e.target.value })}
                placeholder="e.g. CHQ-882301"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank">Bank (Optional)</Label>
              <Input
                id="bank"
                value={formData.bank}
                onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                placeholder="Bank name"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChangeAction(false)}
              disabled={loading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-violet-600 hover:bg-violet-700 text-white cursor-pointer"
            >
              {loading ? "Saving..." : "Save Case Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

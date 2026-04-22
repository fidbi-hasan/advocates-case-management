import { supabase } from "@/lib/supabase";
import { type LegalCase } from "@/data/mockCases";

export interface CaseFilters {
  hearingDateFrom?: string;
  hearingDateTo?: string;
  filingDateFrom?: string;
  filingDateTo?: string;
  branch?: string;
  chequeNo?: string;
  accountNameOrPlaintiff?: string;
  caseType?: "CR/ARA" | "NI Act";
  quickFilter?: "tomorrow" | "yesterday" | "ni" | "ara" | "judgement";
}

function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Map Supabase case record to LegalCase interface
 */
function mapCase(record: any): LegalCase {
  return {
    id: record.id,
    branch: record.branch,
    caseNo: record.case_no,
    caseType: record.case_type,
    accountName: record.account_name,
    filingDate: record.filing_date,
    sessionsNo: record.sessions_no,
    plaintiff: record.plaintiff,
    chequeNo: record.cheque_no || "",
    bank: record.bank || "",
    previousStatusDate: record.previous_status_date || "",
    court: record.court,
    status: record.status,
    hearingDate: record.hearing_date,
    isJudgement: record.is_judgement,
    pdfUrls: Array.isArray(record.pdf_urls) ? Array.from(new Set(record.pdf_urls.filter(Boolean))) : [],
  };
}

/**
 * Fetch all cases from Supabase.
 */
export async function getAllCases(): Promise<LegalCase[]> {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("hearing_date", { ascending: true });

  if (error) {
    console.error("Error fetching cases:", error.message, error);
    if (error.code === "PGRST205") {
      console.error("The 'cases' table does not exist. Please run the SQL script in your Supabase dashboard.");
    }
    return [];
  }

  return data.map(mapCase);
}

/**
 * Fetch cases filtered by the given criteria from Supabase.
 */
export async function getCasesByFilter(
  filters: CaseFilters
): Promise<LegalCase[]> {
  let query = supabase.from("cases").select("*");

  // Quick filters
  if (filters.quickFilter) {
    switch (filters.quickFilter) {
      case "tomorrow":
        query = query.eq("hearing_date", getTomorrow());
        break;
      case "yesterday":
        query = query.eq("hearing_date", getYesterday());
        break;
      case "ni":
        query = query.eq("case_type", "NI Act");
        break;
      case "ara":
        query = query.eq("case_type", "CR/ARA");
        break;
      case "judgement":
        query = query.eq("is_judgement", true);
        break;
    }
  }

  // Advanced filters
  if (filters.hearingDateFrom) {
    query = query.gte("hearing_date", filters.hearingDateFrom);
  }
  if (filters.hearingDateTo) {
    query = query.lte("hearing_date", filters.hearingDateTo);
  }
  if (filters.filingDateFrom) {
    query = query.gte("filing_date", filters.filingDateFrom);
  }
  if (filters.filingDateTo) {
    query = query.lte("filing_date", filters.filingDateTo);
  }
  if (filters.branch && filters.branch !== "All Branches") {
    query = query.eq("branch", filters.branch);
  }
  if (filters.chequeNo) {
    query = query.ilike("cheque_no", `%${filters.chequeNo}%`);
  }
  if (filters.accountNameOrPlaintiff) {
    const q = filters.accountNameOrPlaintiff;
    query = query.or(`account_name.ilike.%${q}%,plaintiff.ilike.%${q}%`);
  }

  const { data, error } = await query.order("hearing_date", { ascending: true });

  if (error) {
    console.error("Error filtering cases:", error.message, error);
    return [];
  }

  return data.map(mapCase);
}

/**
 * Get distinct branch names for the dropdown filter.
 */
export async function getBranches(): Promise<string[]> {
  const { data, error } = await supabase
    .from("cases")
    .select("branch")
    .order("branch");

  if (error) {
    console.error("Error fetching branches:", error.message, error);
    return ["Motijheel", "Gulshan", "Banani", "Dhanmondi"]; // Fallback
  }

  const branches = Array.from(new Set(data.map((item: any) => item.branch)));
  return branches as string[];
}

/**
 * Add a new case to Supabase.
 */
export async function addCase(caseData: Omit<LegalCase, "id">): Promise<{ data: LegalCase | null; error: any }> {
  const { data, error } = await supabase
    .from("cases")
    .insert([{
      branch: caseData.branch,
      case_no: caseData.caseNo,
      case_type: caseData.caseType,
      account_name: caseData.accountName,
      filing_date: caseData.filingDate,
      sessions_no: caseData.sessionsNo,
      plaintiff: caseData.plaintiff,
      cheque_no: caseData.chequeNo || null,
      bank: caseData.bank || null,
      previous_status_date: caseData.previousStatusDate || null,
      court: caseData.court,
      status: caseData.status,
      hearing_date: caseData.hearingDate,
      is_judgement: caseData.isJudgement,
    }])
    .select()
    .single();

  if (error) {
    console.error("Error adding case:", error.message, error);
    return { data: null, error };
  }

  return { data: mapCase(data), error: null };
}

/**
 * Update an existing case in Supabase.
 */
export async function updateCase(id: string, updates: Partial<LegalCase>): Promise<{ data: LegalCase | null; error: any }> {
  // Map camelCase to snake_case for the database
  const dbUpdates: any = {};
  if (updates.branch !== undefined) dbUpdates.branch = updates.branch;
  if (updates.caseNo !== undefined) dbUpdates.case_no = updates.caseNo;
  if (updates.caseType !== undefined) dbUpdates.case_type = updates.caseType;
  if (updates.accountName !== undefined) dbUpdates.account_name = updates.accountName;
  if (updates.filingDate !== undefined) dbUpdates.filing_date = updates.filingDate;
  if (updates.sessionsNo !== undefined) dbUpdates.sessions_no = updates.sessionsNo;
  if (updates.plaintiff !== undefined) dbUpdates.plaintiff = updates.plaintiff;
  if (updates.chequeNo !== undefined) dbUpdates.cheque_no = updates.chequeNo;
  if (updates.bank !== undefined) dbUpdates.bank = updates.bank;
  if (updates.previousStatusDate !== undefined) dbUpdates.previous_status_date = updates.previousStatusDate;
  if (updates.court !== undefined) dbUpdates.court = updates.court;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.hearingDate !== undefined) dbUpdates.hearing_date = updates.hearingDate;
  if (updates.isJudgement !== undefined) dbUpdates.is_judgement = updates.isJudgement;
  if (updates.pdfUrls !== undefined) dbUpdates.pdf_urls = updates.pdfUrls;

  const { data, error } = await supabase
    .from("cases")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating case:", error.message, error);
    return { data: null, error };
  }

  return { data: mapCase(data), error: null };
}

/**
 * Delete one or more cases from Supabase.
 */
export async function deleteCases(ids: string[]): Promise<{ error: any }> {
  const { error } = await supabase
    .from("cases")
    .delete()
    .in("id", ids);

  if (error) {
    console.error("Error deleting cases:", error.message, error);
    return { error };
  }

  return { error: null };
}

/**
 * Upload a PDF for a specific case with progress tracking.
 */
export async function uploadCasePDF(
  caseData: LegalCase, 
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ url: string | null; error: any }> {
  const caseId = caseData.id;
  const fileExt = file.name.split(".").pop();
  
  // Format: clientName_checqueNo_branch
  const safeName = caseData.accountName.replace(/\s+/g, "_");
  const safeChq = (caseData.chequeNo || "no_chq").replace(/\s+/g, "_");
  const safeBranch = caseData.branch.replace(/\s+/g, "_");
  
  const fileName = `${safeName}_${safeChq}_${safeBranch}-${Date.now()}.${fileExt}`;
  const filePath = `documents/${fileName}`;

  try {
    // 1. Get current case to get existing pdfUrls
    const { data, error: fetchError } = await supabase
      .from("cases")
      .select("pdf_urls")
      .eq("id", caseId)
      .single();

    if (fetchError) throw fetchError;
    const existingUrls = (data as any)?.pdf_urls || [];

    // 2. Upload to Storage using XMLHttpRequest for progress
    const url = await uploadWithProgress(filePath, file, onProgress);
    
    // 3. Update Database
    const newUrls = [...existingUrls, url];
    const { error: dbError } = await supabase
      .from("cases")
      .update({ pdf_urls: newUrls })
      .eq("id", caseId);

    if (dbError) throw dbError;

    return { url, error: null };
  } catch (error: any) {
    console.error("Error in uploadCasePDF:", error);
    return { url: null, error };
  }
}

/**
 * Helper to upload file to Supabase Storage with progress tracking
 */
async function uploadWithProgress(
  path: string, 
  file: File, 
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const bucket = "case-documents";
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;
    
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Authorization", `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
    xhr.setRequestHeader("apikey", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");
    
    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(path);
        resolve(publicUrl);
      } else {
        reject(new Error(xhr.responseText || "Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));
    
    const formData = new FormData();
    formData.append("file", file);
    // Note: Supabase expects the file body directly for some endpoints, 
    // but the storage API often uses multipart if using standard POST.
    // Actually, Supabase Storage API for /object/[path] expects the file body directly.
    xhr.send(file);
  });
}

/**
 * Delete a PDF for a specific case.
 */
export async function deleteCasePDF(caseId: string, pdfUrl: string): Promise<{ error: any }> {
  try {
    // 1. Extract file path from URL
    const bucket = "case-documents";
    const searchStr = `/storage/v1/object/public/${bucket}/`;
    const index = pdfUrl.indexOf(searchStr);
    
    if (index !== -1) {
      let filePath = pdfUrl.substring(index + searchStr.length);
      // Strip query parameters and decode
      filePath = decodeURIComponent(filePath.split("?")[0]);
      
      // 2. Delete from Storage
      const { data, error: storageError } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (storageError) {
        console.error("Storage removal failed:", storageError);
        return { error: storageError };
      }

      // Verify if something was actually deleted
      if (!data || data.length === 0) {
        console.warn("Storage removal returned no data, file might not have existed or path was wrong:", filePath);
      }
    } else {
      console.error("Could not parse storage path from URL:", pdfUrl);
    }

    // 3. Get current URLs and remove the deleted one from DB
    const { data, error: fetchError } = await supabase
      .from("cases")
      .select("pdf_urls")
      .eq("id", caseId)
      .single();

    if (fetchError) throw fetchError;
    const currentUrls = (data as any)?.pdf_urls || [];
    const updatedUrls = currentUrls.filter((url: string) => url !== pdfUrl);

    // 4. Update Database
    const { error: dbError } = await supabase
      .from("cases")
      .update({ pdf_urls: updatedUrls })
      .eq("id", caseId);

    return { error: dbError };
  } catch (error: any) {
    console.error("Error in deleteCasePDF:", error);
    return { error };
  }
}

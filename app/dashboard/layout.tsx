"use client";

import { Scale, LogOut, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Header */}
      <header className="h-14 sm:h-16 border-b border-slate-200 bg-white flex items-center justify-between px-3 sm:px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 rounded-md bg-violet-50">
            <Scale className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-800 tracking-tight">
              Digital Chambers
            </h1>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
              Case Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </Button>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
              AK
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-slate-700">Adv. Karim</p>
              <p className="text-[10px] text-slate-400">Senior Partner</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">{children}</main>
    </div>
  );
}

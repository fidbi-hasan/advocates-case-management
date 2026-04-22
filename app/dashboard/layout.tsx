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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-stone-50">
      {/* Top Header */}
      <header className="h-14 sm:h-16 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl flex items-center justify-between px-3 sm:px-6 shrink-0 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 rounded-lg bg-slate-900">
            <Scale className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 tracking-tight font-serif-display">
              Digital Chambers
            </h1>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block font-body">
              Case Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
          </Button>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-xs font-bold text-amber-400 ring-2 ring-amber-200/30">
              AK
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-700 font-body">Adv. Karim</p>
              <p className="text-[10px] text-slate-400 font-body">Senior Partner</p>
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

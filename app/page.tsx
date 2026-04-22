"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Scale,
  Shield,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Gavel,
  BookOpen,
  FileText,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push("/dashboard");
  };

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Persona / Branding (dark panel) */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex-col items-center justify-center p-8 xl:p-12">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "3s" }}
          />
          <div
            className="absolute top-1/3 right-1/4 w-64 h-64 bg-sky-600/8 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 text-center max-w-lg animate-fade-in">
          <div className="flex items-center justify-center mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/20 rounded-2xl blur-xl scale-125" />
              <div className="relative glass-dark-strong rounded-2xl p-8">
                <Scale className="w-16 h-16 text-violet-400" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 mb-10">
            <div className="glass-dark rounded-lg p-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Gavel className="w-6 h-6 text-amber-400/70" />
            </div>
            <div className="glass-dark rounded-lg p-3 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <BookOpen className="w-6 h-6 text-sky-400/70" />
            </div>
            <div className="glass-dark rounded-lg p-3 animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <FileText className="w-6 h-6 text-emerald-400/70" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Digital Chambers
          </h1>
          <p className="text-lg text-violet-300/90 font-light mb-3">
            Streamlined Legal Practice Management
          </p>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            A comprehensive platform for case management, hearing schedules,
            and document workflows — designed for the modern advocate.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-4 xl:gap-6">
            {[
              { label: "Cases Managed", value: "2,400+" },
              { label: "Courts Covered", value: "15+" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="glass-dark rounded-lg p-4 animate-slide-up"
                style={{ animationDelay: `${0.8 + i * 0.2}s` }}
              >
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form (light theme) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        {/* Decorative */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 mb-3">
              <Scale className="w-10 h-10 text-violet-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Digital Chambers</h2>
            <p className="text-xs text-slate-500">Legal Practice Management</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-md bg-violet-50">
                <Shield className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">
                Welcome Back
              </h2>
            </div>
            <p className="text-sm text-slate-500 mb-8">
              Enter your credentials to access the vault
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email / Username
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="advocate@chambers.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 h-11 rounded-md focus:border-violet-400 focus:ring-violet-200 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 h-11 pr-10 rounded-md focus:border-violet-400 focus:ring-violet-200 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-violet-300/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Accessing Vault...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Enter Vault</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Protected by 256-bit encryption
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            © {new Date().getFullYear()} Digital Chambers. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Info,
  CheckCircle2,
  Globe,
  UserCheck,
  Building2,
  Flame,
  Eye,
  EyeOff
} from "lucide-react";
import { UserRole } from "../../types";
import { useLanguage } from "../../lib/LanguageContext";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import ITParkLogo from "../../components/ITParkLogo";
import ITParkBrandBackground from "../../components/ITParkBrandBackground";

interface LoginModuleProps {
  onLoginSuccess: (user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department: string;
    avatarUrl?: string;
  }) => void;
}

// Quick-access profiles: selecting one fills in the email only — the
// password is never baked into the frontend, each person always types
// their own.
const PRESET_USERS = [
  {
    id: "u-1",
    name: "Hasan Abdukarimov",
    email: "h.abdukarimov@outsource.gov.uz",
    role: UserRole.SUPER_ADMIN,
    department: "Executive Board",
    roleLabel: "Super Admin",
    avatarColor: "bg-emerald-500 text-white",
    desc: "Full administrative control across every module."
  },
  {
    id: "u-2",
    name: "Bunyod Qutbiddinov",
    email: "b.qutbiddinov@outsource.gov.uz",
    role: UserRole.MANAGER,
    department: "Operations",
    roleLabel: "Manager",
    avatarColor: "bg-indigo-500 text-white",
    desc: "Operational access to residents, startups, events, and CRM."
  },
  {
    id: "u-3",
    name: "Islom Karimov",
    email: "i.karimov@365.it-park.uz",
    role: UserRole.MANAGER,
    department: "Operations",
    roleLabel: "Manager",
    avatarColor: "bg-blue-500 text-white",
    desc: "Operational access to residents, startups, events, and CRM."
  },
  {
    id: "u-4",
    name: "Shohjaxon Xudoyberdiyev",
    email: "sh.xudoyberdiyev@outsource.gov.uz",
    role: UserRole.MANAGER,
    department: "Operations",
    roleLabel: "Manager",
    avatarColor: "bg-amber-500 text-white",
    desc: "Operational access to residents, startups, events, and CRM."
  },
  {
    id: "u-5",
    name: "Jasurbek Beknazarov",
    email: "j.beknazarov@outsource.gov.uz",
    role: UserRole.MANAGER,
    department: "Operations",
    roleLabel: "Manager",
    avatarColor: "bg-violet-500 text-white",
    desc: "Operational access to residents, startups, events, and CRM."
  }
];

export default function LoginModule({ onLoginSuccess }: LoginModuleProps) {
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");

  // Translate labels locally if they are not in LanguageContext translations
  const getLocalTranslation = (key: string): string => {
    const localDict: Record<string, Record<string, string>> = {
      uz: {
        "Enterprise Sign In": "Tizimga kirish",
        "Sign in to access IT Park Uzbekistan Management System": "IT Park O'zbekiston boshqaruv tizimiga kirish",
        "Email Address": "Elektron pochta manzili",
        "Password": "Parol",
        "Forgot Password?": "Parolni unutdingizmi?",
        "Authenticating...": "Tizimga kirilmoqda...",
        "Sign In": "Tizimga kirish",
        "Quick Access Profiles": "Tezkor kirish profillari",
        "Select a system profile to log in instantly with appropriate permissions.": "Tegishli ruxsatnomalar bilan tezda tizimga kirish uchun profilni tanlang.",
        "Secure Platform Session": "Xavfsiz tizim sessiyasi",
        "This platform is protected by end-to-end sandbox policies. Administrative activities are tracked.": "Ushbu tizim to'liq xavfsizlik protokollari bilan himoyalangan. Barcha harakatlar nazorat qilinadi.",
        "System Administrator": "Tizim administratori",
        "Resident Manager": "Rezidentlar menedjeri",
        "Field Agent": "Dala agenti",
        "Active Resident": "Faol rezident",
        "Guest Auditor": "Mehmon auditor",
        "Invalid email or password": "Elektron pochta yoki parol noto'g'ri",
        "Management Portal": "Boshqaruv Portali",
        "Please enter a password": "Iltimos, parolni kiriting"
      },
      ru: {
        "Enterprise Sign In": "Вход в систему",
        "Sign in to access IT Park Uzbekistan Management System": "Войдите для доступа к системе управления IT Park Узбекистан",
        "Email Address": "Электронная почта",
        "Password": "Пароль",
        "Forgot Password?": "Забыли пароль?",
        "Authenticating...": "Авторизация...",
        "Sign In": "Войти в систему",
        "Quick Access Profiles": "Профили быстрого доступа",
        "Select a system profile to log in instantly with appropriate permissions.": "Выберите системный профиль для мгновенного входа с соответствующими правами.",
        "Secure Platform Session": "Безопасная сессия платформы",
        "This platform is protected by end-to-end sandbox policies. Administrative activities are tracked.": "Эта платформа защищена сквозными политиками безопасности. Все действия записываются.",
        "System Administrator": "Системный администратор",
        "Resident Manager": "Менеджер резидентов",
        "Field Agent": "Полевой агент",
        "Active Resident": "Активный резидент",
        "Guest Auditor": "Гостевой аудитор",
        "Invalid email or password": "Неверный email или пароль",
        "Management Portal": "Управляющий Портал",
        "Please enter a password": "Пожалуйста, введите пароль"
      }
    };

    if (language === "en") return key;
    return localDict[language]?.[key] || key;
  };

  const handlePresetSelect = (preset: typeof PRESET_USERS[0]) => {
    // Fills the email only — never the password. Each person still has to
    // type their own password to sign in.
    setSelectedPresetId(preset.id);
    setEmail(preset.email);
    setPassword("");
    setErrorMsg("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email) {
      setErrorMsg(getLocalTranslation("Invalid email or password"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || getLocalTranslation("Invalid email or password"));
      }

      const payload = result.data || result;

      if (result.success && payload.user) {
        if (payload.accessToken) {
          localStorage.setItem("itpms_access_token", payload.accessToken);
        }
        if (payload.refreshToken) {
          localStorage.setItem("itpms_refresh_token", payload.refreshToken);
        }
        onLoginSuccess(payload.user);
      } else {
        throw new Error(result.message || getLocalTranslation("Invalid email or password"));
      }
    } catch (err: any) {
      console.error("Login failure:", err);
      setErrorMsg(err.message || getLocalTranslation("Invalid email or password"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-[#74BD22] selection:text-slate-950 relative overflow-x-hidden">
      {/* Global Layered IT Park Uzbekistan Brand Background */}
      <ITParkBrandBackground variant="executive" intensity="prominent" />

      {/* Top Navigation / Language bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <ITParkLogo variant="full" size="sm" isDark={true} subtext="KASHKADARYA" />
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          {/* Language selector matching main header design */}
          <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-800 rounded-lg p-0.5">
            {[
              { code: "en" as const, label: "EN", flag: "🇬🇧" },
              { code: "uz" as const, label: "UZ", flag: "🇺🇿" },
              { code: "ru" as const, label: "RU", flag: "🇷🇺" }
            ].map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-slate-800 text-white shadow-xs" 
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <span>{item.flag}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Login content body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center relative z-10">
        
        {/* Left Side: System introduction & Quick logins */}
        <div className="w-full lg:w-[55%] space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[#74BD22] text-[10px] font-extrabold uppercase tracking-widest rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#74BD22] animate-pulse"></span>
              <span>Official Executive Management Platform</span>
            </div>
            
            <div className="pt-1">
              <ITParkLogo variant="full" size="xl" isDark={true} subtext="KASHKADARYA REGIONAL BRANCH" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mt-2">
              Kashkadarya Regional IT Ecosystem <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#74BD22] to-emerald-400">
                Management System
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
              Unified administrative framework tracking official registered tax-resident entities, investment startups, property cadastre leases, and technology outreach pipelines across regional offices.
            </p>
          </div>

          {/* Quick Access Profiles list */}
          <div className="bg-[#151D30] border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4.5 h-4.5 text-emerald-400" />
                <span>{getLocalTranslation("Quick Access Profiles")}</span>
              </h2>
              <p className="text-[10px] text-slate-400 mt-1">
                {getLocalTranslation("Select a system profile to log in instantly with appropriate permissions.")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {PRESET_USERS.map((user) => {
                const isSelected = selectedPresetId === user.id;
                const initials = user.name.split(" ").map(n => n[0]).join("");
                return (
                  <button
                    key={user.id}
                    onClick={() => handlePresetSelect(user)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex gap-3 h-[84px] items-start ${
                      isSelected 
                        ? "bg-slate-900 border-emerald-500/50 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/5" 
                        : "bg-slate-950/40 border-slate-800 hover:bg-slate-900 hover:border-slate-700"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold font-mono ${user.avatarColor}`}>
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-white text-[11px] truncate block">{user.name}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono tracking-wide block leading-none mt-0.5">
                        {getLocalTranslation(user.roleLabel)}
                      </span>
                      <p className="text-[9px] text-slate-500 truncate mt-1.5 font-medium">
                        {user.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Manual login card */}
        <div className="w-full lg:w-[45%] max-w-md">
          <div className="bg-[#111A2E] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Visual accent backdrop glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-4 mb-6">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <span>{getLocalTranslation("Enterprise Sign In")}</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                {getLocalTranslation("Sign in to access IT Park Uzbekistan Management System")}
              </p>
            </div>

            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-[11px] font-medium flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Email Address Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {getLocalTranslation("Email Address")}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSelectedPresetId("");
                      setErrorMsg("");
                    }}
                    placeholder="name@itpark.uz"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {getLocalTranslation("Password")}
                  </label>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-[10px] font-bold text-emerald-400 hover:underline"
                  >
                    {getLocalTranslation("Forgot Password?")}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-10 py-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all text-white placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-extrabold text-xs py-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 mt-6 disabled:opacity-50"
              >
                <span>{isSubmitting ? getLocalTranslation("Authenticating...") : getLocalTranslation("Sign In")}</span>
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Sandbox Notice / Verification info */}
            <div className="mt-6 border-t border-slate-800/60 pt-4 flex items-start gap-2.5 text-[10px] text-slate-500 leading-normal">
              <Shield className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <p>
                {getLocalTranslation("This platform is protected by end-to-end sandbox policies. Administrative activities are tracked.")}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="px-6 py-4 border-t border-slate-800 bg-[#070B13]/40 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-500 font-mono">
        <div className="flex items-center gap-1">
          <span>&copy; 2026 IT Park Uzbekistan.</span>
          <span className="hidden sm:inline">|</span>
          <span>Sovereign Tech Ecosystem Portal.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Encrypted Session</span>
          </span>
          <span>UTC 2026-07-15</span>
        </div>
      </footer>
    </div>
  );
}

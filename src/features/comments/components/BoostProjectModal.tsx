import React, { useState } from "react";
import { 
  Rocket, 
  Sparkles, 
  Flame, 
  Heart, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Share2, 
  X 
} from "lucide-react";
import { ProjectComment } from "../../../types";

interface BoostProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: ProjectComment[];
  currentUserName: string;
  onBoostOverallProject: (boostNote: string, category: string) => void;
}

export default function BoostProjectModal({
  isOpen,
  onClose,
  comments,
  currentUserName,
  onBoostOverallProject
}: BoostProjectModalProps) {
  const [selectedPillar, setSelectedPillar] = useState("startups");
  const [boostMessage, setBoostMessage] = useState("");
  const [boostSuccess, setBoostSuccess] = useState(false);

  if (!isOpen) return null;

  const totalBoosts = comments.reduce((acc, c) => acc + (c.boostCount || 0), 0);

  const pillars = [
    { id: "startups", title: "🚀 Startups & Incubation", desc: "Back regional seed grants and incubation cohorts" },
    { id: "residents", title: "🏢 Resident Exporters", desc: "Accelerate 0% VAT & international software exports" },
    { id: "infrastructure", title: "🏗️ Smart Infrastructure", desc: "Expand 10Gbps fiber networks & modern co-workings" },
    { id: "talent", title: "🎓 Youth IT & BPO Academy", desc: "Fund English/German conversational training camps" },
    { id: "innovation", title: "💡 Regional Innovation Fund", desc: "Support Kashkadarya tech solutions for agriculture & energy" }
  ];

  const handleConfirmBoost = (e: React.FormEvent) => {
    e.preventDefault();
    onBoostOverallProject(boostMessage.trim() || "Pledged stakeholder boost to accelerate IT Park Kashkadarya strategic growth!", selectedPillar);
    setBoostSuccess(true);
    setTimeout(() => {
      setBoostSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#74BD22]/20 to-transparent blur-xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {boostSuccess ? (
          <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#74BD22]/20 border border-[#74BD22]/40 text-[#74BD22] flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <Rocket className="w-8 h-8 text-[#74BD22]" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Project Boosted Successfully! 🚀
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
              Thank you, <span className="font-bold text-slate-900 dark:text-white">{currentUserName}</span>! Your booster has been logged and published to the executive dashboard.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#74BD22] to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/25">
                <Rocket className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  Boost IT Park Kashkadarya
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {totalBoosts.toLocaleString()} total boosts recorded from founders, residents, and mentors.
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmBoost} className="space-y-4">
              {/* Select Focus Pillar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Strategic Pillar to Boost:
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {pillars.map((p) => {
                    const isSelected = selectedPillar === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPillar(p.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-[#74BD22]/10 border-[#74BD22] text-slate-900 dark:text-white font-bold shadow-xs"
                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div>
                          <div className="font-extrabold">{p.title}</div>
                          <div className="text-[11px] text-slate-500 font-normal mt-0.5">{p.desc}</div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#74BD22] text-slate-950 flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Optional Motivation Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Booster Note / Endorsement (Optional)
                </label>
                <textarea
                  rows={2}
                  value={boostMessage}
                  onChange={(e) => setBoostMessage(e.target.value)}
                  placeholder="e.g. Fully backing this initiative to scale Kashkadarya's global software exports in 2026!"
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74BD22]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#74BD22] to-emerald-500 hover:from-[#62a31b] hover:to-emerald-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm cursor-pointer shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-101"
                >
                  <Rocket className="w-4 h-4 text-slate-950" />
                  <span>Confirm & Boost Project Now (+1 Boost)</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

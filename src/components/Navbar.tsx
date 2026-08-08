"use client";

import React, { useState } from "react";
import { Sprout, Menu, X, Play, Sun, Moon } from "lucide-react";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 bg-[#FFFFFF]/85 dark:bg-[#05070A]/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 transition-all duration-500 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="relative p-2 bg-emerald-100 dark:bg-emerald-950/40 rounded-2xl group-hover:scale-110 transition-transform duration-300">
            <Sprout className="w-5 h-5 text-farm-green animate-float" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-1 font-sans transition-colors">
            AgriTwin <span className="text-farm-green">OS</span>
          </span>
        </a>

        {/* Right controls: Theme Toggle + Button */}
        <div className="hidden md:flex items-center gap-6">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 text-slate-700 dark:text-slate-250 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-sky-500 fill-sky-100" />
            )}
          </button>

          {/* Enter Sandbox */}
          <a
            href="#scrollytelling"
            className="px-5 py-2 rounded-full font-sans text-xs font-extrabold tracking-wider text-white bg-farm-green hover:bg-farm-green-dark transition-all duration-300 shadow-farm hover:scale-105 active:scale-95"
          >
            Enter Sandbox
          </a>
        </div>

        {/* Mobile menu toggle controls */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-850 bg-[#FFFFFF] dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition-all"
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-sky-500 fill-sky-100" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-650 dark:text-slate-350 hover:text-farm-green transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Only CTA sandbox button remains) */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-b border-slate-100 dark:border-slate-900 bg-[#FFFFFF]/95 dark:bg-[#05070A]/95 backdrop-blur-lg flex flex-col py-6 px-8 gap-4 shadow-xl animate-fade-in transition-colors duration-500">
          <a
            href="#scrollytelling"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 font-sans text-center text-white bg-farm-green hover:bg-farm-green-dark py-3 rounded-full font-bold transition-all shadow-farm mt-2"
          >
            <Play className="w-4 h-4 fill-white" />
            Enter Sandbox
          </a>
        </div>
      )}
    </header>
  );
}

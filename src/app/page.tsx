"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import VideoScrubber from "@/components/VideoScrubber";
import Footer from "@/components/Footer";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Synchronize theme on load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="bg-[#FBF9F1] dark:bg-[#0B0F17] min-h-screen text-[#0F172A] dark:text-[#F8FAFC] relative selection:bg-farm-green/20 selection:text-slate-800 transition-colors duration-500">
      {/* Sticky header navbar with theme actions */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main>
        {/* Full-viewport Video Scrollytelling Scrubber */}
        <VideoScrubber theme={theme} />
      </main>

      {/* Footer system details */}
      <Footer />
    </div>
  );
}

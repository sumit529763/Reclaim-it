// src/features/home/pages/Home.jsx
import React from "react";
import Hero from "../../../components/layout/Hero";
import Inspiration from "../../../components/layout/Inspiration";
import HowItWorks from "../../../components/layout/HowItWorks";
import Contact from "@/components/layout/Contact";

export default function Home() {
  return (
    <div className="pt-20"> {/* padding-top to avoid navbar overlap */}
      <Hero />
      <Inspiration />
      <HowItWorks />
      <Contact />
    </div>
  );
}

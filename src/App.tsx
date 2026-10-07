"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar1 } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { SpotlightCards } from "./components/SpotlightCards";
import { CardFlipServices } from "./components/CardFlipServices";
import { BentoGrid } from "./components/BentoProcess";
import { SelectedWorkSection } from "./components/SelectedWorkSection";
import { DifferentiationSection } from "./components/DifferentiationSection";
import { FounderSection } from "./components/FounderSection";
import { FinalCTASection } from "./components/FinalCTASection";
import { Footer } from "./components/Footer";
import { ProjectModal } from "./components/ProjectModal";
import { AcquisitionModal } from "./components/AcquisitionModal";
import type { ProjectItem } from "./data/seekursorConfig";
import type { AcquisitionChannel, OpenAcquisition } from "./lib/acquisition";

function SeekursorLanding() {
  const locale = useLocale();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [acquisition, setAcquisition] = useState<{ channel: AcquisitionChannel; context?: string } | null>(null);
  const acquisitionReturnFocus = useRef<HTMLElement | null>(null);
  const projectReturnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {setSelectedProject(null); setAcquisition(null);}, [locale]);
  const openAcquisition: OpenAcquisition = (channel, trigger, context) => {
    acquisitionReturnFocus.current = selectedProject
      ? projectReturnFocus.current
      : trigger ?? document.activeElement as HTMLElement;
    setSelectedProject(null);
    setAcquisition({ channel, context });
  };

  return (
    <div className="min-h-screen bg-page text-ink flex flex-col font-sans selection:bg-brand selection:text-white transition-colors duration-200">
      <Navbar1 onAcquire={openAcquisition} />
      <main className="flex-1">
        <Hero onAcquire={openAcquisition} />
        <SpotlightCards />
        <CardFlipServices onAcquire={openAcquisition} />
        <SelectedWorkSection onSelectProject={project => {
          projectReturnFocus.current = document.activeElement as HTMLElement;
          setSelectedProject(project);
        }} />
        <BentoGrid />
        <DifferentiationSection />
        <FounderSection onAcquire={openAcquisition} />
        <div id="contact"><FinalCTASection onAcquire={openAcquisition} /></div>
      </main>
      <Footer onAcquire={openAcquisition} />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} onAcquire={openAcquisition} />
      <AcquisitionModal request={acquisition} onClose={() => setAcquisition(null)} returnFocusRef={acquisitionReturnFocus} />
    </div>
  );
}

export default function App() {
  return <ThemeProvider><MotionConfig reducedMotion="user"><SeekursorLanding /></MotionConfig></ThemeProvider>;
}

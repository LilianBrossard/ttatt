"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type SectionContextType = {
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
};

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export function SectionProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<string>("accueil");

  return (
    <SectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </SectionContext.Provider>
  );
}

export function useSection() {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error("useSection must be used within a SectionProvider");
  }
  return context;
}

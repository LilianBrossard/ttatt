"use client";

import React, { useEffect, useRef } from "react";
import { useSection } from "./SectionContext";

type SectionObserverProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

export default function SectionObserver({ id, children, className = "" }: SectionObserverProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { setActiveSection } = useSection();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        });
      },
      {
        // Trigger quand la section est au milieu de l'écran (approximativement)
        rootMargin: "-40% 0px -40% 0px", 
        threshold: 0,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [id, setActiveSection]);

  return (
    <div id={id} ref={sectionRef} className={className}>
      {children}
    </div>
  );
}

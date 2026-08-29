import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // If IntersectionObserver is not supported, reveal everything immediately
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "50px 0px 50px 0px",
      }
    );

    const root = containerRef.current || document;
    const elements = root.querySelectorAll("[data-reveal]");

    elements.forEach((el) => observer.observe(el));

    // Fallback: Reveal all above-the-fold elements after a short timeout
    const fallbackTimer = setTimeout(() => {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) {
          el.classList.add("is-revealed");
        }
      });
    }, 200);

    return () => {
      clearTimeout(fallbackTimer);
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return containerRef;
}

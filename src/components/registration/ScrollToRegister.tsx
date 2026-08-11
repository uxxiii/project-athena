"use client";

import { useEffect } from "react";

export function ScrollToRegister() {
  useEffect(() => {
    if (window.location.hash === "#register") {
      const timer = setTimeout(() => {
        const el = document.getElementById("register");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}

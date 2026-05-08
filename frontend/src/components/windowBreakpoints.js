import { useState, useEffect } from "react";

export function windowBreakpoints() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile: windowSize.width < 1200,
    isTablet: windowSize.width >= 1200 && windowSize.width < 1000,
    isDesktop: windowSize.width >= 1000,
  };
}

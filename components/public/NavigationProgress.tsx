"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";

function Bar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => timerRef.current.forEach(clearTimeout);

  useEffect(() => {
    clear();
    setVisible(true);
    setWidth(0);

    const t1 = setTimeout(() => setWidth(30), 20);
    const t2 = setTimeout(() => setWidth(60), 200);
    const t3 = setTimeout(() => setWidth(85), 500);
    const t4 = setTimeout(() => {
      setWidth(100);
      const t5 = setTimeout(() => setVisible(false), 300);
      timerRef.current.push(t5);
    }, 800);

    timerRef.current = [t1, t2, t3, t4];
    return clear;
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[3px] pointer-events-none">
      <div
        className="h-full bg-[#D7242A] transition-all ease-out"
        style={{ width: `${width}%`, transitionDuration: width === 100 ? "200ms" : "600ms" }}
      />
    </div>
  );
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}

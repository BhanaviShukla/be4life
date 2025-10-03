"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="inline-flex items-center gap-0 p-1 bg-muted/20 rounded-full">
      {(["his", "hers"] as const).map((t, idx) => (
        <Button
          key={t}
          type="button"
          size="sm"
          variant={theme === t ? "default" : "ghost"}
          onClick={() => setTheme(t)}
          className={cn(
            "min-w-20 rounded-full",
            theme !== t && "bg-transparent hover:bg-transparent"
          )}
        >
          {t === "his" ? "His" : "Hers"}
        </Button>
      ))}
    </div>
  );
}

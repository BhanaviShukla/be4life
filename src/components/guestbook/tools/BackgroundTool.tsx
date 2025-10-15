"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Paintbrush, Grid3x3, Layers } from "lucide-react";
import { useCanvas, CANVAS_WIDTH, CANVAS_HEIGHT } from "@/lib/canvas-context";
import { useTheme } from "next-themes";

export function BackgroundTool() {
  const { contextRef, saveToHistory } = useCanvas();
  const { theme } = useTheme();
  
  const [backgroundType, setBackgroundType] = useState<"solid" | "gradient" | "pattern">("solid");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [gradientStart, setGradientStart] = useState("#FFFFFF");
  const [gradientEnd, setGradientEnd] = useState("#F0F0F0");
  const [selectedPattern, setSelectedPattern] = useState("dots");

  // Theme-based color suggestions
  const themeColors = theme === "his" 
    ? ["#0D1418", "#D4AF6A", "#5F2A2C", "#2A3D33", "#FFFFFF"]
    : ["#F8F4E3", "#7B1E28", "#B77C87", "#98AE87", "#C4A95B"];

  const applyBackground = () => {
    if (!contextRef.current) return;
    
    const ctx = contextRef.current;
    
    // Save current content
    const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    if (backgroundType === "solid") {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else if (backgroundType === "gradient") {
      const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      gradient.addColorStop(0, gradientStart);
      gradient.addColorStop(1, gradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else if (backgroundType === "pattern") {
      applyPattern(ctx);
    }
    
    // Restore content on top (optional - remove if you want to replace everything)
    // ctx.putImageData(imageData, 0, 0);
    
    saveToHistory();
  };

  const applyPattern = (ctx: CanvasRenderingContext2D) => {
    // First fill with base color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.strokeStyle = theme === "his" ? "#D4AF6A30" : "#B77C8730"; // Theme-based pattern color
    ctx.lineWidth = 1;
    
    if (selectedPattern === "dots") {
      // Draw dots pattern
      for (let x = 10; x < CANVAS_WIDTH; x += 20) {
        for (let y = 10; y < CANVAS_HEIGHT; y += 20) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = theme === "his" ? "#D4AF6A30" : "#B77C8730";
          ctx.fill();
        }
      }
    } else if (selectedPattern === "stripes") {
      // Draw diagonal stripes
      for (let i = -CANVAS_HEIGHT; i < CANVAS_WIDTH; i += 15) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + CANVAS_HEIGHT, CANVAS_HEIGHT);
        ctx.stroke();
      }
    } else if (selectedPattern === "grid") {
      // Draw grid pattern
      for (let x = 0; x < CANVAS_WIDTH; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }
    } else if (selectedPattern === "floral") {
      // Draw simple floral pattern
      for (let x = 20; x < CANVAS_WIDTH; x += 40) {
        for (let y = 20; y < CANVAS_HEIGHT; y += 40) {
          // Draw a simple flower
          ctx.strokeStyle = theme === "his" ? "#D4AF6A20" : "#B77C8720";
          for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
            ctx.beginPath();
            ctx.arc(
              x + Math.cos(angle) * 8,
              y + Math.sin(angle) * 8,
              4,
              0,
              Math.PI * 2
            );
            ctx.stroke();
          }
        }
      }
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Background Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Background Type</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={backgroundType === "solid" ? "default" : "outline"}
            size="sm"
            onClick={() => setBackgroundType("solid")}
            className="px-2"
          >
            <Paintbrush className="w-4 h-4 mr-1" />
            Solid
          </Button>
          <Button
            variant={backgroundType === "gradient" ? "default" : "outline"}
            size="sm"
            onClick={() => setBackgroundType("gradient")}
            className="px-2"
          >
            <Layers className="w-4 h-4 mr-1" />
            Gradient
          </Button>
          <Button
            variant={backgroundType === "pattern" ? "default" : "outline"}
            size="sm"
            onClick={() => setBackgroundType("pattern")}
            className="px-2"
          >
            <Grid3x3 className="w-4 h-4 mr-1" />
            Pattern
          </Button>
        </div>
      </div>

      {/* Solid Color */}
      {backgroundType === "solid" && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Background Color</Label>
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-8 h-8 rounded-md border-2 border-border"
              style={{ backgroundColor }}
            />
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="h-8 flex-1 cursor-pointer"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {themeColors.map((color) => (
              <button
                key={color}
                onClick={() => setBackgroundColor(color)}
                className={`h-8 rounded-md border-2 transition-all ${
                  backgroundColor === color ? "border-accent scale-110" : "border-border hover:border-accent/50"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Gradient Colors */}
      {backgroundType === "gradient" && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Start Color</Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-md border-2 border-border"
                style={{ backgroundColor: gradientStart }}
              />
              <input
                type="color"
                value={gradientStart}
                onChange={(e) => setGradientStart(e.target.value)}
                className="h-8 flex-1 cursor-pointer"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">End Color</Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-md border-2 border-border"
                style={{ backgroundColor: gradientEnd }}
              />
              <input
                type="color"
                value={gradientEnd}
                onChange={(e) => setGradientEnd(e.target.value)}
                className="h-8 flex-1 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Pattern Selection */}
      {backgroundType === "pattern" && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Pattern</Label>
          <div className="grid grid-cols-2 gap-2">
            {["dots", "stripes", "grid", "floral"].map((pattern) => (
              <Button
                key={pattern}
                variant={selectedPattern === pattern ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPattern(pattern)}
                className="capitalize"
              >
                {pattern}
              </Button>
            ))}
          </div>
          
          <div className="space-y-2 mt-3">
            <Label className="text-sm font-medium">Base Color</Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-md border-2 border-border"
                style={{ backgroundColor }}
              />
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="h-8 flex-1 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Apply Button */}
      <Button 
        onClick={applyBackground}
        className="w-full"
        size="sm"
      >
        Apply Background
      </Button>

      {/* Tips */}
      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
        <p>🎨 Use subtle patterns for elegance</p>
        <p>🌈 Gradients add depth to your tile</p>
        <p>⚠️ Applying replaces current background</p>
      </div>
    </div>
  );
}
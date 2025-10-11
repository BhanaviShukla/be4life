"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Palette, Eraser, Circle } from "lucide-react";
import { useCanvas, BrushSize } from "@/lib/canvas-context";
import { useTheme } from "next-themes";

export function DrawingTool() {
  const { 
    selectedTool, 
    setSelectedTool, 
    brushSize, 
    setBrushSize, 
    brushColor, 
    setBrushColor,
    contextRef 
  } = useCanvas();
  
  const { theme } = useTheme();

  // Theme-based color palette
  const colorPalette = [
    // His theme colors
    "#0D1418", // Deep teal
    "#D4AF6A", // Warm gold
    "#5F2A2C", // Burgundy
    "#2A3D33", // Emerald
    
    // Hers theme colors
    "#F8F4E3", // Ivory
    "#7B1E28", // Burgundy
    "#B77C87", // Dusty rose
    "#98AE87", // Sage
    
    // Standard colors
    "#000000", // Black
    "#FFFFFF", // White
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
  ];

  const brushSizes: { size: BrushSize; label: string; pixels: number }[] = [
    { size: "xs", label: "XS", pixels: 2 },
    { size: "s", label: "S", pixels: 4 },
    { size: "m", label: "M", pixels: 8 },
    { size: "l", label: "L", pixels: 12 },
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Tool Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tool</Label>
        <div className="flex gap-2">
          <Button
            variant={selectedTool === "draw" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("draw")}
            className="flex-1"
          >
            <Palette className="w-4 h-4 mr-1" />
            Draw
          </Button>
          <Button
            variant={selectedTool === "eraser" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("eraser")}
            className="flex-1"
          >
            <Eraser className="w-4 h-4 mr-1" />
            Erase
          </Button>
        </div>
      </div>

      {/* Brush Size */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Brush Size</Label>
        <div className="flex gap-2">
          {brushSizes.map((size) => (
            <Button
              key={size.size}
              variant={brushSize === size.size ? "default" : "outline"}
              size="sm"
              onClick={() => setBrushSize(size.size)}
              className="flex-1 p-2"
              title={`${size.label} (${size.pixels}px)`}
            >
              <div className="flex flex-col items-center gap-1">
                <Circle 
                  className={`fill-current ${
                    size.size === "xs" ? "w-2 h-2" :
                    size.size === "s" ? "w-3 h-3" :
                    size.size === "m" ? "w-4 h-4" :
                    "w-5 h-5"
                  }`}
                />
                <span className="text-xs">{size.label}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      {selectedTool === "draw" && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Color</Label>
          
          {/* Current Color Display */}
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-8 h-8 rounded-md border-2 border-border"
              style={{ backgroundColor: brushColor }}
            />
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="h-8 w-full cursor-pointer"
              title="Choose custom color"
            />
          </div>
          
          {/* Preset Colors */}
          <div className="grid grid-cols-4 gap-2">
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => setBrushColor(color)}
                className={`w-full h-8 rounded-md border-2 transition-all ${
                  brushColor === color ? "border-accent scale-110" : "border-border hover:border-accent/50"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Opacity Slider */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Opacity</Label>
        <input
          type="range"
          min="10"
          max="100"
          defaultValue="100"
          className="w-full"
          onChange={(e) => {
            // Update canvas context alpha
            const alpha = parseInt(e.target.value) / 100;
            if (contextRef.current) {
              contextRef.current.globalAlpha = alpha;
            }
          }}
        />
      </div>

      {/* Tips */}
      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
        <p>💡 Use the eraser to fix mistakes</p>
        <p>🎨 Mix colors for unique effects</p>
        <p>✏️ Start with a light sketch</p>
      </div>
    </div>
  );
}
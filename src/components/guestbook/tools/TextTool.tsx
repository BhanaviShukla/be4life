"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Type, Plus, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useCanvas } from "@/lib/canvas-context";

const fonts = [
  { value: "serif", label: "Serif", family: "serif" },
  { value: "sans-serif", label: "Sans", family: "sans-serif" },
  { value: "cursive", label: "Cursive", family: "cursive" },
  { value: "fantasy", label: "Fantasy", family: "fantasy" },
  { value: "monospace", label: "Mono", family: "monospace" },
  { value: "georgia", label: "Georgia", family: "Georgia, serif" },
];

const fontSizes = [8, 12, 16, 20, 24, 32, 48];

export function TextTool() {
  const { canvasRef, contextRef, saveToHistory } = useCanvas();
  
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [fontColor, setFontColor] = useState("#000000");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");

  const addTextToCanvas = () => {
    if (!text.trim() || !contextRef.current || !canvasRef.current) return;

    const ctx = contextRef.current;
    
    // Set font properties
    const fontStyle = `${isBold ? "bold" : ""} ${isItalic ? "italic" : ""} ${fontSize}px ${fontFamily}`;
    ctx.font = fontStyle.trim();
    ctx.fillStyle = fontColor;
    ctx.textAlign = textAlign;
    ctx.textBaseline = "top";
    
    // Calculate position (center of canvas for now)
    let x = 150; // Center X
    if (textAlign === "left") x = 10;
    if (textAlign === "right") x = 290;
    
    const y = 100 - fontSize / 2; // Center Y
    
    // Draw text
    ctx.fillText(text, x, y);
    
    // Save to history
    saveToHistory();
    
    // Clear input
    setText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addTextToCanvas();
    }
  };

  return (
    <div className="space-y-4 p-4">
      {/* Text Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Text</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter text..."
            className="flex-1"
            maxLength={50}
          />
          <Button
            size="sm"
            onClick={addTextToCanvas}
            disabled={!text.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{text.length}/50 characters</p>
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Font</Label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full p-2 rounded-md border border-border bg-background text-sm"
        >
          {fonts.map((font) => (
            <option key={font.value} value={font.family}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Size</Label>
        <div className="flex gap-1 flex-wrap">
          {fontSizes.map((size) => (
            <Button
              key={size}
              variant={fontSize === size ? "default" : "outline"}
              size="sm"
              onClick={() => setFontSize(size)}
              className="px-2 py-1 h-7"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Text Style */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Style</Label>
        <div className="flex gap-2">
          <Button
            variant={isBold ? "default" : "outline"}
            size="sm"
            onClick={() => setIsBold(!isBold)}
            className="flex-1"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant={isItalic ? "default" : "outline"}
            size="sm"
            onClick={() => setIsItalic(!isItalic)}
            className="flex-1"
          >
            <Italic className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Text Alignment */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Alignment</Label>
        <div className="flex gap-2">
          <Button
            variant={textAlign === "left" ? "default" : "outline"}
            size="sm"
            onClick={() => setTextAlign("left")}
            className="flex-1"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant={textAlign === "center" ? "default" : "outline"}
            size="sm"
            onClick={() => setTextAlign("center")}
            className="flex-1"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            variant={textAlign === "right" ? "default" : "outline"}
            size="sm"
            onClick={() => setTextAlign("right")}
            className="flex-1"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Color</Label>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-md border-2 border-border"
            style={{ backgroundColor: fontColor }}
          />
          <input
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            className="h-8 flex-1 cursor-pointer"
          />
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
        <p>💡 Press Enter to add text</p>
        <p>📝 Keep messages short and sweet</p>
        <p>🎨 Try different fonts for variety</p>
      </div>
    </div>
  );
}
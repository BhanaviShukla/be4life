"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Heart, 
  Star, 
  Sparkles, 
  Flower, 
  Gift,
  Music,
  Camera,
  Smile,
  Sun,
  Moon,
  Cloud,
  Rainbow,
  Coffee,
  Wine,
  Cake,
  Crown,
  Diamond,
  Zap,
  Award,
  Bell,
  Bird,
  Bookmark,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Plus
} from "lucide-react";
import { useCanvas } from "@/lib/canvas-context";
import { useTheme } from "next-themes";

// Sticker categories
const stickerCategories = {
  wedding: [
    { icon: Heart, label: "Heart" },
    { icon: Gift, label: "Gift" },
    { icon: Bell, label: "Bell" },
    { icon: Flower, label: "Flower" },
    { icon: Diamond, label: "Diamond" },
    { icon: Crown, label: "Crown" },
  ],
  celebration: [
    { icon: Star, label: "Star" },
    { icon: Sparkles, label: "Sparkles" },
    { icon: Music, label: "Music" },
    { icon: Camera, label: "Camera" },
    { icon: Wine, label: "Wine" },
    { icon: Cake, label: "Cake" },
  ],
  nature: [
    { icon: Sun, label: "Sun" },
    { icon: Moon, label: "Moon" },
    { icon: Cloud, label: "Cloud" },
    { icon: Rainbow, label: "Rainbow" },
    { icon: Bird, label: "Bird" },
    { icon: Coffee, label: "Coffee" },
  ],
  shapes: [
    { icon: Circle, label: "Circle" },
    { icon: Square, label: "Square" },
    { icon: Triangle, label: "Triangle" },
    { icon: Hexagon, label: "Hexagon" },
    { icon: Award, label: "Award" },
    { icon: Zap, label: "Zap" },
  ],
};

// Custom emoji stickers
const emojiStickers = [
  "❤️", "💕", "💖", "💝", "💐", "🌹", 
  "🌺", "🌸", "🌼", "🌻", "🌷", "🌵",
  "🎉", "🎊", "🎈", "🎁", "🎀", "🎂",
  "🥂", "🍾", "🥳", "😊", "😍", "🤗",
  "✨", "💫", "⭐", "🌟", "🌈", "☀️",
  "🌙", "🌤️", "⛅", "☁️", "🌦️", "🍀"
];

export function StickerTool() {
  const { canvasRef, contextRef, saveToHistory } = useCanvas();
  const { theme } = useTheme();
  
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof stickerCategories>("wedding");
  const [stickerSize, setStickerSize] = useState(30);
  const [stickerColor, setStickerColor] = useState(theme === "his" ? "#D4AF6A" : "#B77C87");
  const [rotation, setRotation] = useState(0);
  const [customEmoji, setCustomEmoji] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Theme-based colors
  const themeColors = theme === "his" 
    ? ["#D4AF6A", "#0D1418", "#5F2A2C", "#2A3D33", "#FFFFFF"]
    : ["#B77C87", "#7B1E28", "#F8F4E3", "#98AE87", "#C4A95B"];

  const addSticker = (StickerIcon: any, label: string) => {
    if (!contextRef.current || !canvasRef.current) return;

    const ctx = contextRef.current;
    
    // Create a temporary canvas to render the icon
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = stickerSize * 2;
    tempCanvas.height = stickerSize * 2;
    const tempCtx = tempCanvas.getContext("2d");
    
    if (!tempCtx) return;

    // Save the current context state
    ctx.save();
    
    // Position at center of main canvas
    const x = 150;
    const y = 100;
    
    // Apply rotation
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Draw the icon as a path (simplified representation)
    ctx.fillStyle = stickerColor;
    ctx.strokeStyle = stickerColor;
    ctx.lineWidth = 2;
    
    // Create simple shapes based on icon type
    ctx.beginPath();
    
    switch (label) {
      case "Heart":
        drawHeart(ctx, 0, 0, stickerSize);
        break;
      case "Star":
        drawStar(ctx, 0, 0, stickerSize, 5);
        break;
      case "Circle":
        ctx.arc(0, 0, stickerSize / 2, 0, Math.PI * 2);
        break;
      case "Square":
        ctx.rect(-stickerSize / 2, -stickerSize / 2, stickerSize, stickerSize);
        break;
      case "Triangle":
        drawTriangle(ctx, 0, 0, stickerSize);
        break;
      case "Diamond":
        drawDiamond(ctx, 0, 0, stickerSize);
        break;
      default:
        // Default circle for unimplemented shapes
        ctx.arc(0, 0, stickerSize / 2, 0, Math.PI * 2);
    }
    
    ctx.fill();
    
    // Restore the context state
    ctx.restore();
    
    // Save to history
    saveToHistory();
  };

  const addEmoji = (emoji: string) => {
    if (!contextRef.current || !canvasRef.current) return;

    const ctx = contextRef.current;
    
    ctx.save();
    ctx.font = `${stickerSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Position at center
    const x = 150;
    const y = 100;
    
    // Apply rotation
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Draw emoji
    ctx.fillText(emoji, 0, 0);
    
    ctx.restore();
    saveToHistory();
  };

  // Helper functions to draw shapes
  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const width = size;
    const height = size;
    ctx.moveTo(x, y + height / 4);
    ctx.quadraticCurveTo(x, y, x + width / 4, y);
    ctx.quadraticCurveTo(x + width / 2, y, x + width / 2, y + height / 4);
    ctx.quadraticCurveTo(x + width / 2, y, x + width * 3/4, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + height / 4);
    ctx.quadraticCurveTo(x + width, y + height / 2, x + width * 3/4, y + height * 3/4);
    ctx.lineTo(x + width / 2, y + height);
    ctx.lineTo(x + width / 4, y + height * 3/4);
    ctx.quadraticCurveTo(x, y + height / 2, x, y + height / 4);
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, points: number) => {
    const outerRadius = size / 2;
    const innerRadius = size / 4;
    let angle = -Math.PI / 2;
    const step = Math.PI / points;
    
    ctx.moveTo(x + Math.cos(angle) * outerRadius, y + Math.sin(angle) * outerRadius);
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      angle += step;
      ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    }
    ctx.closePath();
  };

  const drawTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x - size / 2, y + size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.closePath();
  };

  const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x + size / 2, y);
    ctx.lineTo(x, y + size / 2);
    ctx.lineTo(x - size / 2, y);
    ctx.closePath();
  };

  return (
    <div className="space-y-4 p-4">
      {/* Sticker Categories */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Category</Label>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(stickerCategories).map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category as keyof typeof stickerCategories)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Icon Stickers */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Stickers</Label>
        <div className="grid grid-cols-3 gap-2">
          {stickerCategories[selectedCategory].map(({ icon: Icon, label }) => (
            <Button
              key={label}
              variant="outline"
              size="sm"
              onClick={() => addSticker(Icon, label)}
              className="h-12 p-0"
              title={label}
            >
              <Icon className="w-5 h-5" />
            </Button>
          ))}
        </div>
      </div>

      {/* Emoji Stickers */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Emoji</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            {showEmojiPicker ? "Hide" : "Show"} Emoji
          </Button>
        </div>
        
        {showEmojiPicker && (
          <div className="grid grid-cols-6 gap-1 max-h-32 overflow-y-auto">
            {emojiStickers.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="text-2xl p-1 hover:bg-muted rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        
        {/* Custom Emoji Input */}
        <div className="flex gap-2">
          <Input
            type="text"
            value={customEmoji}
            onChange={(e) => setCustomEmoji(e.target.value)}
            placeholder="Type emoji..."
            maxLength={2}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={() => {
              if (customEmoji) {
                addEmoji(customEmoji);
                setCustomEmoji("");
              }
            }}
            disabled={!customEmoji}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Sticker Size */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Size: {stickerSize}px</Label>
        <Slider
          value={[stickerSize]}
          onValueChange={([value]) => setStickerSize(value)}
          min={10}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Rotation */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Rotation: {rotation}°</Label>
        <Slider
          value={[rotation]}
          onValueChange={([value]) => setRotation(value)}
          min={-180}
          max={180}
          step={15}
          className="w-full"
        />
      </div>

      {/* Sticker Color */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Color</Label>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-md border-2 border-border"
            style={{ backgroundColor: stickerColor }}
          />
          <input
            type="color"
            value={stickerColor}
            onChange={(e) => setStickerColor(e.target.value)}
            className="h-8 flex-1 cursor-pointer"
          />
        </div>
        <div className="grid grid-cols-5 gap-2">
          {themeColors.map((color) => (
            <button
              key={color}
              onClick={() => setStickerColor(color)}
              className={`h-8 rounded-md border-2 transition-all ${
                stickerColor === color ? "border-accent scale-110" : "border-border hover:border-accent/50"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
        <p>🎨 Rotate stickers for variety</p>
        <p>💖 Mix emojis with drawings</p>
        <p>⭐ Layer stickers for depth</p>
      </div>
    </div>
  );
}
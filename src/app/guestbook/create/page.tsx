"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { 
  ArrowLeft,
  Save,
  Download,
  Eye,
  Pencil,
  Type,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  Image as ImageIcon,
  Smile,
  Trash2,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Palette,
  Layers,
  PaintBucket,
  Eraser,
  Upload,
  Check,
  X
} from "lucide-react";
import { supabase, getSessionId } from "@/lib/supabase";
import { fabric } from "fabric";
import { cn } from "@/lib/utils";

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 200;

// Custom hook for fabric canvas
function useFabricCanvas(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || canvas) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: 'white',
      preserveObjectStacking: true
    });

    // Selection events
    fabricCanvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    fabricCanvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Save initial state
    const initialState = JSON.stringify(fabricCanvas.toJSON());
    setHistory([initialState]);
    setHistoryIndex(0);

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Save to history
  const saveToHistory = useCallback(() => {
    if (!canvas) return;
    
    const state = JSON.stringify(canvas.toJSON());
    setHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1), state];
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [canvas, historyIndex]);

  // Undo
  const undo = useCallback(() => {
    if (!canvas || historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    canvas.loadFromJSON(history[newIndex], () => {
      canvas.renderAll();
      setHistoryIndex(newIndex);
    });
  }, [canvas, history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (!canvas || historyIndex >= history.length - 1) return;
    
    const newIndex = historyIndex + 1;
    canvas.loadFromJSON(history[newIndex], () => {
      canvas.renderAll();
      setHistoryIndex(newIndex);
    });
  }, [canvas, history, historyIndex]);

  return {
    canvas,
    selectedObject,
    history,
    historyIndex,
    saveToHistory,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
}

// Enhanced Canvas Editor Component
function EnhancedCanvasEditor({ tileNumber, guestName, guestEmail, onSave }: {
  tileNumber: number | null;
  guestName: string;
  guestEmail: string;
  onSave: (dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    canvas, 
    selectedObject, 
    saveToHistory, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useFabricCanvas(canvasRef);

  const [activeTool, setActiveTool] = useState("select");
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#FF0000");
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [zoom, setZoom] = useState(100);
  const [isDrawing, setIsDrawing] = useState(false);

  // Color presets
  const colorPresets = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080"
  ];

  // Font options
  const fontOptions = [
    "Arial", "Times New Roman", "Courier New", "Georgia", 
    "Verdana", "Comic Sans MS", "Impact", "Trebuchet MS"
  ];

  // Emoji stickers
  const emojis = [
    "❤️", "💕", "💖", "💝", "💐", "🌹",
    "🌺", "🌸", "🎉", "🎊", "🎈", "🎁",
    "✨", "💫", "⭐", "🌟", "😊", "🥰"
  ];

  // Tool handlers
  const handleToolChange = (tool: string) => {
    if (!canvas) return;
    
    setActiveTool(tool);
    
    // Reset drawing mode
    canvas.isDrawingMode = false;
    canvas.selection = true;
    
    switch(tool) {
      case "draw":
        canvas.isDrawingMode = true;
        canvas.selection = false;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = brushColor;
        canvas.freeDrawingBrush.width = brushSize;
        setIsDrawing(true);
        break;
      
      case "eraser":
        canvas.isDrawingMode = true;
        canvas.selection = false;
        const eraserBrush = new fabric.PencilBrush(canvas);
        eraserBrush.color = "white";
        eraserBrush.width = brushSize * 2;
        canvas.freeDrawingBrush = eraserBrush;
        setIsDrawing(true);
        break;
      
      default:
        setIsDrawing(false);
        break;
    }
  };

  // Update brush settings
  useEffect(() => {
    if (!canvas || !canvas.freeDrawingBrush) return;
    
    if (activeTool === "draw") {
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushSize;
    } else if (activeTool === "eraser") {
      canvas.freeDrawingBrush.color = "white";
      canvas.freeDrawingBrush.width = brushSize * 2;
    }
  }, [canvas, brushColor, brushSize, activeTool]);

  // Add text
  const addText = () => {
    if (!canvas) return;
    
    const text = new fabric.IText('Click to edit', {
      left: 50,
      top: 50,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: brushColor
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveToHistory();
  };

  // Add shapes
  const addShape = (type: string) => {
    if (!canvas) return;
    
    let shape: fabric.Object | null = null;
    
    switch(type) {
      case "rectangle":
        shape = new fabric.Rect({
          left: 50,
          top: 50,
          width: 80,
          height: 60,
          fill: fillColor,
          stroke: brushColor,
          strokeWidth: 2
        });
        break;
      
      case "circle":
        shape = new fabric.Circle({
          left: 50,
          top: 50,
          radius: 30,
          fill: fillColor,
          stroke: brushColor,
          strokeWidth: 2
        });
        break;
      
      case "triangle":
        shape = new fabric.Triangle({
          left: 50,
          top: 50,
          width: 60,
          height: 60,
          fill: fillColor,
          stroke: brushColor,
          strokeWidth: 2
        });
        break;
      
      case "star":
        const starPoints = [
          {x: 0, y: -30},
          {x: 8, y: -10},
          {x: 26, y: -8},
          {x: 12, y: 6},
          {x: 15, y: 24},
          {x: 0, y: 15},
          {x: -15, y: 24},
          {x: -12, y: 6},
          {x: -26, y: -8},
          {x: -8, y: -10}
        ];
        
        shape = new fabric.Polygon(starPoints, {
          left: 100,
          top: 100,
          fill: fillColor,
          stroke: brushColor,
          strokeWidth: 2
        });
        break;
      
      case "heart":
        const heartPath = 'M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z';
        shape = new fabric.Path(heartPath, {
          left: 50,
          top: 50,
          fill: fillColor,
          stroke: brushColor,
          strokeWidth: 2,
          scaleX: 0.8,
          scaleY: 0.8
        });
        break;
    }
    
    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
      saveToHistory();
    }
  };

  // Add emoji
  const addEmoji = (emoji: string) => {
    if (!canvas) return;
    
    const text = new fabric.Text(emoji, {
      left: 100,
      top: 100,
      fontSize: 30,
      fontFamily: 'Arial'
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveToHistory();
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target?.result as string, (img) => {
        // Scale image to fit
        const maxSize = 100;
        const scale = maxSize / Math.max(img.width!, img.height!);
        img.scale(scale);
        
        img.set({
          left: 50,
          top: 50
        });
        
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        saveToHistory();
      });
    };
    reader.readAsDataURL(file);
  };

  // Delete selected
  const deleteSelected = () => {
    if (!canvas || !selectedObject) return;
    
    canvas.remove(selectedObject);
    canvas.renderAll();
    saveToHistory();
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!canvas) return;
    
    if (confirm("Are you sure you want to clear the canvas?")) {
      canvas.clear();
      canvas.backgroundColor = 'white';
      canvas.renderAll();
      saveToHistory();
    }
  };

  // Export canvas
  const exportCanvas = () => {
    if (!canvas) return '';
    
    return canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
  };

  // Download image
  const downloadImage = () => {
    const dataUrl = exportCanvas();
    const link = document.createElement('a');
    link.download = `wedding-tile-${tileNumber || Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Handle save
  const handleSave = () => {
    const dataUrl = exportCanvas();
    onSave(dataUrl);
  };

  // Load draft on mount
  useEffect(() => {
    if (!canvas || !tileNumber) return;
    
    const loadDraft = async () => {
      try {
        const { data } = await supabase
          .from("guestbook_drafts")
          .select("*")
          .eq("tile_number", tileNumber)
          .single();

        if (data && data.canvas_data_url) {
          fabric.Image.fromURL(data.canvas_data_url, (img) => {
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
          });
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    };
    
    loadDraft();
  }, [canvas, tileNumber]);

  // Auto-save
  useEffect(() => {
    if (!canvas || !tileNumber) return;
    
    const interval = setInterval(async () => {
      try {
        const dataUrl = exportCanvas();
        await supabase.from("guestbook_drafts").upsert({
          tile_number: tileNumber,
          guest_name: guestName,
          guest_email: guestEmail,
          session_id: getSessionId(),
          canvas_data_url: dataUrl,
          last_saved_at: new Date().toISOString()
        });
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [canvas, tileNumber, guestName, guestEmail]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvas) return;
      
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelected();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canvas, selectedObject, undo, redo]);

  // Update zoom
  const updateZoom = (newZoom: number) => {
    if (!canvas) return;
    setZoom(newZoom);
    canvas.setZoom(newZoom / 100);
    canvas.renderAll();
  };

  return (
    <div className="flex h-full bg-background">
      {/* Left Toolbar */}
      <div className="w-64 bg-muted/30 border-r border-border p-4">
        <Tabs value={activeTool} onValueChange={handleToolChange}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="select">Select</TabsTrigger>
            <TabsTrigger value="draw">Draw</TabsTrigger>
          </TabsList>

          {/* Drawing Tools */}
          {(activeTool === "draw" || activeTool === "eraser") && (
            <div className="space-y-4">
              <div>
                <Label>Tool</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant={activeTool === "draw" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("draw")}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Draw
                  </Button>
                  <Button
                    variant={activeTool === "eraser" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToolChange("eraser")}
                  >
                    <Eraser className="h-4 w-4 mr-1" />
                    Erase
                  </Button>
                </div>
              </div>

              <div>
                <Label>Brush Size: {brushSize}px</Label>
                <Slider
                  value={[brushSize]}
                  onValueChange={([value]) => setBrushSize(value)}
                  min={1}
                  max={20}
                  className="mt-2"
                />
              </div>

              {activeTool === "draw" && (
                <div>
                  <Label>Brush Color</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <div 
                      className="w-10 h-10 rounded border-2"
                      style={{ backgroundColor: brushColor }}
                    />
                    <Input
                      type="color"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-1 mt-2">
                    {colorPresets.map(color => (
                      <button
                        key={color}
                        className="w-full h-8 rounded border-2 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => setBrushColor(color)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Tabs>

        <Separator className="my-4" />

        {/* Text Tool */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={addText}
          >
            <Type className="h-4 w-4 mr-2" />
            Add Text
          </Button>

          <div>
            <Label>Font Size: {fontSize}px</Label>
            <Slider
              value={[fontSize]}
              onValueChange={([value]) => setFontSize(value)}
              min={8}
              max={48}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Font</Label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full mt-1 p-2 rounded border bg-background"
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Shapes */}
        <div className="space-y-3">
          <Label>Shapes</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addShape("rectangle")}
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addShape("circle")}
            >
              <Circle className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addShape("triangle")}
            >
              <Triangle className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addShape("star")}
            >
              <Star className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addShape("heart")}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <Label>Fill Color</Label>
            <div className="flex items-center gap-2 mt-2">
              <div 
                className="w-10 h-10 rounded border-2"
                style={{ backgroundColor: fillColor }}
              />
              <Input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="h-10"
              />
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Emojis */}
        <div className="space-y-3">
          <Label>Emojis</Label>
          <div className="grid grid-cols-6 gap-1">
            {emojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="text-xl hover:bg-muted rounded p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Image Upload */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-14 bg-background border-b border-border px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
            >
              <Redo className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteSelected}
              disabled={!selectedObject}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCanvas}
            >
              Clear All
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateZoom(Math.max(50, zoom - 25))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-12 text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateZoom(Math.min(200, zoom + 25))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 flex items-center justify-center bg-muted/10 p-8">
          <div className="bg-white rounded-lg shadow-xl">
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="h-16 bg-background border-t border-border px-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={downloadImage}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
function CreatePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [tileNumber, setTileNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeTile = async () => {
      const name = searchParams.get("name");
      const email = searchParams.get("email");
      const tile = searchParams.get("tile");

      if (name) setGuestName(name);
      if (email) setGuestEmail(email);

      if (tile) {
        setTileNumber(parseInt(tile));
        setIsLoading(false);
      } else {
        // Check if email already has a tile
        if (email) {
          const { data: existingTile } = await supabase
            .from("guestbook_tiles")
            .select("tile_number")
            .eq("guest_email", email)
            .single();

          if (existingTile) {
            setTileNumber(existingTile.tile_number);
            setIsLoading(false);
            return;
          }
        }

        // Claim new tile
        try {
          const { data, error } = await supabase.rpc("claim_next_tile", {
            p_guest_name: name || "Anonymous",
            p_guest_email: email || null,
          });

          if (error) throw error;

          if (data && data[0]) {
            setTileNumber(data[0].tile_number);
          } else {
            setError("All tiles have been claimed!");
          }
        } catch (err: any) {
          setError(err.message || "Failed to claim tile");
        }
      }
      
      setIsLoading(false);
    };

    initializeTile();
  }, [searchParams]);

  const saveTile = async (canvasDataUrl: string) => {
    if (!tileNumber) return;

    try {
      // Save to storage
      const fileName = `tile-${tileNumber}.png`;
      const base64Data = canvasDataUrl.replace(/^data:image\/\w+;base64,/, '');
      
      // Convert base64 to blob for browser compatibility
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      
      const { error: uploadError } = await supabase.storage
        .from('guestbook_canvas')
        .upload(`originals/${fileName}`, blob, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Update tile record
      await supabase
        .from("guestbook_tiles")
        .update({
          canvas_data_url: canvasDataUrl,
          storage_path: `originals/${fileName}`,
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("tile_number", tileNumber);

      // Save final draft
      await supabase.from("guestbook_drafts").upsert({
        tile_number: tileNumber,
        guest_name: guestName,
        guest_email: guestEmail,
        session_id: getSessionId(),
        canvas_data_url: canvasDataUrl,
        last_saved_at: new Date().toISOString(),
      });

      router.push(`/guestbook/reveal?highlight=${tileNumber}`);
    } catch (error: any) {
      console.error("Error saving tile:", error);
      alert(`Failed to save: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-accent mx-auto mb-4 animate-pulse" />
          <p>Preparing your canvas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <X className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Oops!</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/guestbook">
            <Button>Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="h-16 bg-background border-b border-border px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/guestbook">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-lg font-semibold">Create Your Wedding Tile</h1>
            <p className="text-xs text-muted-foreground">
              Tile #{tileNumber} • {guestName || "Guest"} • {guestEmail || "No email"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/guestbook/reveal?highlight=${tileNumber}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview Grid
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Canvas Editor */}
      <div className="flex-1 overflow-hidden">
        <EnhancedCanvasEditor
          tileNumber={tileNumber}
          guestName={guestName}
          guestEmail={guestEmail}
          onSave={saveTile}
        />
      </div>
    </div>
  );
}

export default function EnhancedCanvasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-accent animate-pulse" />
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  );
}
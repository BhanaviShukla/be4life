"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Eye,
  Palette,
  Type,
  Image,
  Sparkles,
  Undo,
  Redo,
  Trash2,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { supabase, getSessionId, GuestbookTile, GuestbookDraft } from "@/lib/supabase";
import html2canvas from "html2canvas";

// Canvas dimensions (3cm x 2cm at 100dpi = 300px x 200px)
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 200;

function CreatePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [tileNumber, setTileNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [zoom, setZoom] = useState(100);
  const [selectedTool, setSelectedTool] = useState<string>("draw");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const tile = searchParams.get("tile");

    if (name) setGuestName(name);
    if (email) setGuestEmail(email);
    if (tile) setTileNumber(parseInt(tile));

    initializeCanvas();
  }, [searchParams]);

  const initializeCanvas = async () => {
    setIsLoading(true);
    
    try {
      // If no tile number, claim one
      if (!tileNumber) {
        const { data, error } = await supabase.rpc("claim_next_tile", {
          p_guest_name: guestName || "Anonymous",
          p_guest_email: guestEmail || null,
        });

        if (error) throw error;
        if (data && data[0]) {
          setTileNumber(data[0].tile_number);
        }
      }

      // Dynamically import Fabric.js
      if (canvasRef.current && !fabricCanvasRef.current) {
        const { fabric } = await import("fabric");
        
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          backgroundColor: "white",
        });
        
        fabricCanvasRef.current = canvas;

        // Set up event listeners
        canvas.on("path:created", () => {
          updateUndoRedoState();
          autoSave();
        });

        canvas.on("object:added", () => {
          updateUndoRedoState();
        });

        canvas.on("object:modified", () => {
          updateUndoRedoState();
          autoSave();
        });
      }

      // Load existing draft if available
      await loadDraft();
    } catch (error) {
      console.error("Error initializing canvas:", error);
      alert("Failed to initialize canvas. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDraft = async () => {
    if (!tileNumber) return;

    try {
      const { data } = await supabase
        .from("guestbook_drafts")
        .select("*")
        .eq("tile_number", tileNumber)
        .single();

      if (data && data.canvas_data_json && fabricCanvasRef.current) {
        fabricCanvasRef.current.loadFromJSON(data.canvas_data_json, () => {
          fabricCanvasRef.current?.renderAll();
        });
        setLastSaved(new Date(data.last_saved_at));
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  };

  const autoSave = async () => {
    if (!fabricCanvasRef.current || !tileNumber || isSaving) return;

    setIsSaving(true);
    try {
      const canvasData = fabricCanvasRef.current.toJSON();
      const canvasDataUrl = fabricCanvasRef.current.toDataURL();

      const { error } = await supabase.from("guestbook_drafts").upsert({
        tile_number: tileNumber,
        guest_name: guestName,
        guest_email: guestEmail || null,
        session_id: getSessionId(),
        canvas_data_json: canvasData,
        canvas_data_url: canvasDataUrl,
        last_saved_at: new Date().toISOString(),
      });

      if (!error) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error("Error auto-saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateUndoRedoState = () => {
    if (!fabricCanvasRef.current) return;
    // For now, simple state tracking
    setCanUndo(fabricCanvasRef.current.getObjects().length > 0);
  };

  const handleUndo = () => {
    if (!fabricCanvasRef.current) return;
    const objects = fabricCanvasRef.current.getObjects();
    if (objects.length > 0) {
      fabricCanvasRef.current.remove(objects[objects.length - 1]);
      updateUndoRedoState();
    }
  };

  const handleRedo = () => {
    // Implement redo functionality
  };

  const handleClear = () => {
    if (!fabricCanvasRef.current) return;
    if (confirm("Are you sure you want to clear the canvas? This cannot be undone.")) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = "white";
      fabricCanvasRef.current.renderAll();
      updateUndoRedoState();
      autoSave();
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(200, zoom + 25));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(50, zoom - 25));
  };

  const handlePreview = () => {
    // Navigate to preview page
    router.push(`/guestbook/preview?tile=${tileNumber}`);
  };

  const handleDownload = async () => {
    if (!fabricCanvasRef.current) return;

    const dataUrl = fabricCanvasRef.current.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2, // 2x resolution
    });

    const link = document.createElement("a");
    link.download = `my-wedding-tile-${tileNumber}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [tileNumber, guestName, guestEmail]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-accent mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Preparing your canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/guestbook">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold">Your Canvas - {guestName}</h1>
              <p className="text-xs text-muted-foreground">
                Tile #{tileNumber} • {lastSaved ? `Last saved ${lastSaved.toLocaleTimeString()}` : "Not saved yet"}
                {isSaving && " • Saving..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex h-screen pt-16">
        {/* Tools Panel */}
        <div className="w-16 bg-muted/20 border-r border-border p-2 flex flex-col gap-2">
          <Button
            variant={selectedTool === "draw" ? "default" : "ghost"}
            size="icon"
            onClick={() => setSelectedTool("draw")}
            title="Draw"
          >
            <Palette className="h-4 w-4" />
          </Button>
          <Button
            variant={selectedTool === "text" ? "default" : "ghost"}
            size="icon"
            onClick={() => setSelectedTool("text")}
            title="Text"
          >
            <Type className="h-4 w-4" />
          </Button>
          <Button
            variant={selectedTool === "image" ? "default" : "ghost"}
            size="icon"
            onClick={() => setSelectedTool("image")}
            title="Upload Image"
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button
            variant={selectedTool === "stickers" ? "default" : "ghost"}
            size="icon"
            onClick={() => setSelectedTool("stickers")}
            title="Stickers"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
          <div className="h-px bg-border my-2" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRedo}
            disabled={!canRedo}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            title="Clear Canvas"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div className="relative">
            <div
              className="bg-white rounded-lg shadow-card border border-border"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center",
              }}
            >
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="rounded-lg"
              />
            </div>
            
            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreatePage() {
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
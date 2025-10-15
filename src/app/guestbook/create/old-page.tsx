"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  Download,
  Eye,
  Palette,
  Type,
  Sticker,
  Grid3x3,
  Undo,
  Redo,
  Trash2,
  ZoomIn,
  ZoomOut,
  Sparkles
} from "lucide-react";
import { supabase, getSessionId } from "@/lib/supabase";
import { motion } from "framer-motion";
import { CanvasProvider, useCanvas, CANVAS_WIDTH, CANVAS_HEIGHT } from "@/lib/canvas-context";
import { DrawingTool } from "@/components/guestbook/tools/DrawingTool";
import { TextTool } from "@/components/guestbook/tools/TextTool";
import { BackgroundTool } from "@/components/guestbook/tools/BackgroundTool";
import { StickerTool } from "@/components/guestbook/tools/StickerTool";

function CanvasEditor({ tileNumber, guestName, guestEmail, onSave }: {
  tileNumber: number | null;
  guestName: string;
  guestEmail: string;
  onSave: (dataUrl: string) => void;
}) {
  const { 
    canvasRef, 
    contextRef,
    startDrawing, 
    draw, 
    stopDrawing,
    undo,
    redo,
    clear,
    exportCanvas,
    history,
    historyIndex,
    loadFromJSON
  } = useCanvas();
  
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState("draw");

  // Load draft when component mounts
  useEffect(() => {
    if (tileNumber) {
      loadDraft(tileNumber);
    }
  }, [tileNumber]);

  const loadDraft = async (tileNum: number) => {
    try {
      const { data } = await supabase
        .from("guestbook_drafts")
        .select("*")
        .eq("tile_number", tileNum)
        .single();

      if (data && data.canvas_data_url) {
        loadFromJSON({ dataUrl: data.canvas_data_url });
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  };

  const handleZoomIn = () => setZoom(Math.min(200, zoom + 25));
  const handleZoomOut = () => setZoom(Math.max(50, zoom - 25));

  const handleDownload = () => {
    const dataUrl = exportCanvas();
    const link = document.createElement("a");
    link.download = `wedding-tile-${tileNumber || Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleSave = () => {
    const dataUrl = exportCanvas();
    onSave(dataUrl);
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!tileNumber) return;
    
    const interval = setInterval(async () => {
      const canvasDataUrl = exportCanvas();
      
      try {
        await supabase.from("guestbook_drafts").upsert({
          tile_number: tileNumber,
          guest_name: guestName,
          guest_email: guestEmail || null,
          session_id: getSessionId(),
          canvas_data_json: null,
          canvas_data_url: canvasDataUrl,
          last_saved_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error auto-saving:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [tileNumber, guestName, guestEmail, exportCanvas]);

  return (
    <div className="flex h-full">
      {/* Tools Panel */}
      <div className="w-80 bg-muted/10 border-r border-border flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4 gap-1 m-2">
            <TabsTrigger value="draw" className="flex flex-col gap-1 h-auto py-2">
              <Palette className="h-4 w-4" />
              <span className="text-xs">Draw</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex flex-col gap-1 h-auto py-2">
              <Type className="h-4 w-4" />
              <span className="text-xs">Text</span>
            </TabsTrigger>
            <TabsTrigger value="sticker" className="flex flex-col gap-1 h-auto py-2">
              <Sticker className="h-4 w-4" />
              <span className="text-xs">Sticker</span>
            </TabsTrigger>
            <TabsTrigger value="background" className="flex flex-col gap-1 h-auto py-2">
              <Grid3x3 className="h-4 w-4" />
              <span className="text-xs">BG</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="draw" className="mt-0">
              <DrawingTool />
            </TabsContent>
            <TabsContent value="text" className="mt-0">
              <TextTool />
            </TabsContent>
            <TabsContent value="sticker" className="mt-0">
              <StickerTool />
            </TabsContent>
            <TabsContent value="background" className="mt-0">
              <BackgroundTool />
            </TabsContent>
          </div>
        </Tabs>

        {/* Action Buttons */}
        <div className="border-t border-border p-2 space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
              className="flex-1"
            >
              <Undo className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="flex-1"
            >
              <Redo className="h-4 w-4 mr-1" />
              Redo
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clear}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Canvas
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Image
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Progress
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto bg-muted/5">
        <div className="relative">
          <motion.div
            className="bg-white rounded-xl shadow-card border-2 border-border overflow-hidden"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: zoom / 100 }}
            transition={{ duration: 0.3 }}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </motion.div>
          
          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 border border-border shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreatePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [tileNumber, setTileNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const tile = searchParams.get("tile");

    if (name) setGuestName(name);
    if (email) setGuestEmail(email);
    if (tile) {
      setTileNumber(parseInt(tile));
    } else {
      claimTile(name || "Anonymous", email || null);
    }
    setIsLoading(false);
  }, [searchParams]);

  const claimTile = async (name: string, email: string | null) => {
    try {
      const { data, error } = await supabase.rpc("claim_next_tile", {
        p_guest_name: name,
        p_guest_email: email,
      });

      if (data && data[0]) {
        setTileNumber(data[0].tile_number);
      }
    } catch (error) {
      console.error("Error claiming tile:", error);
    }
  };

  const saveTile = async (canvasDataUrl: string) => {
    if (!tileNumber) return;

    setIsSaving(true);
    
    try {
      // Save final draft
      await supabase.from("guestbook_drafts").upsert({
        tile_number: tileNumber,
        guest_name: guestName,
        guest_email: guestEmail || null,
        session_id: getSessionId(),
        canvas_data_json: null,
        canvas_data_url: canvasDataUrl,
        last_saved_at: new Date().toISOString(),
      });

      // Update tile
      await supabase
        .from("guestbook_tiles")
        .update({
          canvas_data_url: canvasDataUrl,
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("tile_number", tileNumber);

      setLastSaved(new Date());
      
      // Navigate to reveal page
      router.push(`/guestbook/reveal?highlight=${tileNumber}`);
    } catch (error) {
      console.error("Error saving tile:", error);
      alert("Failed to save your tile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

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
    <CanvasProvider>
      <div className="relative h-screen flex flex-col bg-background text-foreground">
        {/* Header */}
        <div className="bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <Link href="/guestbook">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold">Create Your Tile</h1>
                <p className="text-xs text-muted-foreground">
                  Tile #{tileNumber} • {guestName || "Guest"}
                  {lastSaved && ` • Auto-saved ${lastSaved.toLocaleTimeString()}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <CanvasEditor 
            tileNumber={tileNumber}
            guestName={guestName}
            guestEmail={guestEmail}
            onSave={saveTile}
          />
        </div>
      </div>
    </CanvasProvider>
  );
}

export default function CreateGuestbookPage() {
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
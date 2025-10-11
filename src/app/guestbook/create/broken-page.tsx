"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { 
  ArrowLeft,
  Save,
  Download,
  Eye,
  MousePointer,
  Pencil,
  Type,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  Image,
  Smile,
  Trash2,
  Copy,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid,
  Layers,
  Lock,
  Unlock,
  FlipHorizontal,
  FlipVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Group,
  Ungroup,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Sparkles,
  Palette,
  Settings,
  Upload,
  X,
  Check,
  Plus,
  Minus,
  RotateCw
} from "lucide-react";
import { supabase, getSessionId } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { FabricCanvasProvider, useFabricCanvas, CANVAS_WIDTH, CANVAS_HEIGHT } from "@/lib/fabric-canvas-context";
import { fabric } from "fabric";
import { cn } from "@/lib/utils";

// Tool button component
const ToolButton = ({ icon: Icon, label, active, onClick, shortcut, disabled = false }: {
  icon: any;
  label: string;
  active?: boolean;
  onClick: () => void;
  shortcut?: string;
  disabled?: boolean;
}) => (
  <div className="relative group">
    <Button
      variant={active ? "default" : "ghost"}
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-10 w-10 transition-all",
        active && "ring-2 ring-accent ring-offset-2"
      )}
    >
      <Icon className="h-5 w-5" />
    </Button>
    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
      {label}
      {shortcut && <span className="text-muted-foreground ml-2">({shortcut})</span>}
    </div>
  </div>
);

// Color picker component
const ColorPicker = ({ color, onChange, label = "Color" }: {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}) => {
  const presetColors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
    "#FFC0CB", "#A52A2A", "#808080", "#FFD700", "#4B0082"
  ];

  return (
    <div className="space-y-3">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <div 
          className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
          style={{ backgroundColor: color }}
        />
        <Input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full cursor-pointer"
        />
      </div>
      <div className="grid grid-cols-5 gap-1">
        {presetColors.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={cn(
              "w-full h-7 rounded-md border-2 transition-all hover:scale-110",
              color === c ? "border-accent" : "border-border"
            )}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
};

// Property panel component
const PropertyPanel = () => {
  const { 
    selectedObject, 
    selectedObjects,
    brushColor,
    setBrushColor,
    canvas 
  } = useFabricCanvas();
  
  const [fillColor, setFillColor] = useState("#000000");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [opacity, setOpacity] = useState(100);
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Arial");

  useEffect(() => {
    if (selectedObject) {
      setFillColor(selectedObject.fill as string || "#000000");
      setStrokeColor(selectedObject.stroke || "#000000");
      setStrokeWidth(selectedObject.strokeWidth || 1);
      setOpacity(Math.round((selectedObject.opacity || 1) * 100));
      
      if (selectedObject.type === 'i-text' || selectedObject.type === 'text') {
        const textObj = selectedObject as fabric.Text;
        setFontSize(textObj.fontSize || 20);
        setFontFamily(textObj.fontFamily || "Arial");
      }
    }
  }, [selectedObject]);

  const updateProperty = (property: string, value: any) => {
    if (!canvas || selectedObjects.length === 0) return;
    
    selectedObjects.forEach(obj => {
      obj.set({ [property]: value });
    });
    canvas.renderAll();
  };

  if (!selectedObject) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <MousePointer className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select an object to edit properties</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="font-medium text-sm mb-3">Object Properties</h3>
        
        {/* Fill color */}
        <ColorPicker
          color={fillColor}
          onChange={(color) => {
            setFillColor(color);
            updateProperty('fill', color);
          }}
          label="Fill Color"
        />
      </div>

      <Separator />

      {/* Stroke */}
      <div className="space-y-3">
        <ColorPicker
          color={strokeColor}
          onChange={(color) => {
            setStrokeColor(color);
            updateProperty('stroke', color);
          }}
          label="Stroke Color"
        />
        
        <div>
          <Label className="text-xs">Stroke Width</Label>
          <Slider
            value={[strokeWidth]}
            onValueChange={([value]) => {
              setStrokeWidth(value);
              updateProperty('strokeWidth', value);
            }}
            min={0}
            max={20}
            step={1}
            className="mt-2"
          />
        </div>
      </div>

      <Separator />

      {/* Opacity */}
      <div>
        <Label className="text-xs">Opacity ({opacity}%)</Label>
        <Slider
          value={[opacity]}
          onValueChange={([value]) => {
            setOpacity(value);
            updateProperty('opacity', value / 100);
          }}
          min={0}
          max={100}
          step={5}
          className="mt-2"
        />
      </div>

      {/* Text properties */}
      {(selectedObject.type === 'i-text' || selectedObject.type === 'text') && (
        <>
          <Separator />
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Font Size</Label>
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => {
                  setFontSize(value);
                  updateProperty('fontSize', value);
                }}
                min={8}
                max={72}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-xs">Font Family</Label>
              <select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  updateProperty('fontFamily', e.target.value);
                }}
                className="w-full mt-1 p-2 rounded-md border border-border bg-background text-sm"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times</option>
                <option value="Courier New">Courier</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Comic Sans MS">Comic Sans</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Layers panel component
const LayersPanel = () => {
  const { objects, canvas, selectedObject } = useFabricCanvas();
  
  const selectObject = (index: number) => {
    if (!canvas) return;
    const obj = canvas.getObjects()[index];
    canvas.setActiveObject(obj);
    canvas.renderAll();
  };

  const toggleVisibility = (index: number) => {
    if (!canvas) return;
    const obj = canvas.getObjects()[index];
    obj.set({ visible: !obj.visible });
    canvas.renderAll();
  };

  const toggleLock = (index: number) => {
    if (!canvas) return;
    const obj = canvas.getObjects()[index];
    const isLocked = obj.lockMovementX;
    obj.set({
      lockMovementX: !isLocked,
      lockMovementY: !isLocked,
      lockRotation: !isLocked,
      lockScalingX: !isLocked,
      lockScalingY: !isLocked
    });
    canvas.renderAll();
  };

  return (
    <div className="p-4">
      <h3 className="font-medium text-sm mb-3">Layers</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-1">
          {objects.map((obj, index) => (
            <div
              key={obj.id}
              className={cn(
                "flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer",
                selectedObject?.data?.id === obj.id && "bg-muted"
              )}
              onClick={() => selectObject(index)}
            >
              <div className="flex-1 text-sm truncate">{obj.name}</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisibility(index);
                }}
              >
                <Eye className={cn("h-3 w-3", !obj.visible && "opacity-50")} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLock(index);
                }}
              >
                {obj.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

// Main canvas editor component
function CanvasEditor({ tileNumber, guestName, guestEmail, onSave }: {
  tileNumber: number | null;
  guestName: string;
  guestEmail: string;
  onSave: (dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePanel, setActivePanel] = useState<"properties" | "layers">("properties");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const {
    canvas,
    setCanvas,
    selectedTool,
    setSelectedTool,
    brushSize,
    setBrushSize,
    brushColor,
    setBrushColor,
    selectedObject,
    selectedObjects,
    addText,
    addShape,
    addSticker,
    deleteSelected,
    duplicateSelected,
    undo,
    redo,
    canUndo,
    canRedo,
    clearCanvas,
    exportCanvas,
    loadFromJSON,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    alignLeft,
    alignCenter,
    alignRight,
    alignTop,
    alignMiddle,
    alignBottom,
    flipHorizontal,
    flipVertical,
    group,
    ungroup,
    lock,
    unlock,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid
  } = useFabricCanvas();

  // Initialize Fabric canvas
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (!canvasRef.current) return;
        
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          backgroundColor: 'white',
          renderOnAddRemove: true,
          selection: true,
          preserveObjectStacking: true
        });
        
        // Wait for canvas to be fully initialized
        fabricCanvas.requestRenderAll();
        
        setCanvas(fabricCanvas);
      }, 100);
    }
    
    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);

  // Set up keyboard shortcuts after canvas is ready
  useEffect(() => {
    if (!canvas) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelected();
      }
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z' && !e.shiftKey) undo();
        if (e.key === 'z' && e.shiftKey) redo();
        if (e.key === 'c') duplicateSelected();
        if (e.key === 'g') group();
        if (e.key === 'u') ungroup();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, deleteSelected, undo, redo, duplicateSelected, group, ungroup]);

  // Load draft
  useEffect(() => {
    if (tileNumber && canvas) {
      loadDraft(tileNumber);
    }
  }, [tileNumber, canvas]);

  const loadDraft = async (tileNum: number) => {
    try {
      const { data } = await supabase
        .from("guestbook_drafts")
        .select("*")
        .eq("tile_number", tileNum)
        .single();

      if (data && data.canvas_data_url) {
        loadFromJSON(data.canvas_data_url);
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  };

  const handleSave = () => {
    const dataUrl = exportCanvas();
    onSave(dataUrl);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (event) => {
        fabric.Image.fromURL(event.target?.result as string, (img) => {
          img.scaleToWidth(100);
          img.set({
            left: 50,
            top: 50
          });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const emojis = [
    "❤️", "💕", "💖", "💝", "💐", "🌹",
    "🌺", "🌸", "🌼", "🌻", "🌷", "🎉",
    "🎊", "🎈", "🎁", "🎀", "🎂", "🥂",
    "🍾", "✨", "💫", "⭐", "🌟", "🌈"
  ];

  return (
    <div className="flex h-full bg-background">
      {/* Left Toolbar */}
      <div className="w-16 bg-muted/30 border-r border-border flex flex-col items-center py-4 gap-2">
        <ToolButton
          icon={MousePointer}
          label="Select"
          active={selectedTool === "select"}
          onClick={() => setSelectedTool("select")}
          shortcut="V"
        />
        
        <ToolButton
          icon={Pencil}
          label="Draw"
          active={selectedTool === "draw"}
          onClick={() => setSelectedTool("draw")}
          shortcut="P"
        />
        
        <ToolButton
          icon={Type}
          label="Text"
          active={selectedTool === "text"}
          onClick={() => {
            setSelectedTool("text");
            // Add text only if canvas is ready
            if (canvas && canvas.contextContainer) {
              addText("Click to edit");
            }
          }}
          shortcut="T"
        />
        
        <Separator className="w-10" />
        
        {/* Shapes */}
        <ToolButton
          icon={Square}
          label="Rectangle"
          onClick={() => addShape("rectangle")}
        />
        
        <ToolButton
          icon={Circle}
          label="Circle"
          onClick={() => addShape("circle")}
        />
        
        <ToolButton
          icon={Triangle}
          label="Triangle"
          onClick={() => addShape("triangle")}
        />
        
        <ToolButton
          icon={Star}
          label="Star"
          onClick={() => addShape("star")}
        />
        
        <ToolButton
          icon={Heart}
          label="Heart"
          onClick={() => addShape("heart")}
        />
        
        <Separator className="w-10" />
        
        <ToolButton
          icon={Image}
          label="Upload Image"
          onClick={() => document.getElementById('image-upload')?.click()}
        />
        
        <ToolButton
          icon={Smile}
          label="Emoji"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-14 bg-background border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <ToolButton
              icon={Undo}
              label="Undo"
              onClick={undo}
              disabled={!canUndo}
              shortcut="⌘Z"
            />
            
            <ToolButton
              icon={Redo}
              label="Redo"
              onClick={redo}
              disabled={!canRedo}
              shortcut="⌘⇧Z"
            />
            
            <Separator orientation="vertical" className="h-6" />
            
            <ToolButton
              icon={Copy}
              label="Duplicate"
              onClick={duplicateSelected}
              disabled={!selectedObject}
              shortcut="⌘D"
            />
            
            <ToolButton
              icon={Trash2}
              label="Delete"
              onClick={deleteSelected}
              disabled={!selectedObject}
              shortcut="Del"
            />
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Alignment tools */}
            <ToolButton
              icon={AlignLeft}
              label="Align Left"
              onClick={alignLeft}
              disabled={selectedObjects.length === 0}
            />
            
            <ToolButton
              icon={AlignCenter}
              label="Align Center"
              onClick={alignCenter}
              disabled={selectedObjects.length === 0}
            />
            
            <ToolButton
              icon={AlignRight}
              label="Align Right"
              onClick={alignRight}
              disabled={selectedObjects.length === 0}
            />
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Layer tools */}
            <ToolButton
              icon={ChevronsUp}
              label="Bring to Front"
              onClick={bringToFront}
              disabled={!selectedObject}
            />
            
            <ToolButton
              icon={ChevronUp}
              label="Bring Forward"
              onClick={bringForward}
              disabled={!selectedObject}
            />
            
            <ToolButton
              icon={ChevronDown}
              label="Send Backward"
              onClick={sendBackward}
              disabled={!selectedObject}
            />
            
            <ToolButton
              icon={ChevronsDown}
              label="Send to Back"
              onClick={sendToBack}
              disabled={!selectedObject}
            />
            
            <Separator orientation="vertical" className="h-6" />
            
            <ToolButton
              icon={Group}
              label="Group"
              onClick={group}
              disabled={selectedObjects.length < 2}
              shortcut="⌘G"
            />
            
            <ToolButton
              icon={Ungroup}
              label="Ungroup"
              onClick={ungroup}
              disabled={selectedObject?.type !== 'group'}
              shortcut="⌘U"
            />
            
            <ToolButton
              icon={selectedObject?.lockMovementX ? Lock : Unlock}
              label={selectedObject?.lockMovementX ? "Unlock" : "Lock"}
              onClick={selectedObject?.lockMovementX ? unlock : lock}
              disabled={!selectedObject}
            />
          </div>

          <div className="flex items-center gap-2">
            <ToolButton
              icon={Grid}
              label="Toggle Grid"
              active={showGrid}
              onClick={() => setShowGrid(!showGrid)}
            />
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={zoomOut}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xs font-medium w-12 text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={zoomIn}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={resetZoom}
              >
                <Maximize className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 bg-muted/10 flex items-center justify-center overflow-hidden relative">
          <div className="relative bg-white rounded-lg shadow-xl">
            <canvas
              ref={canvasRef}
              className="rounded-lg"
            />
            
            {/* Grid overlay */}
            {showGrid && (
              <div 
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, transparent 1px, transparent 10px, #000 11px), repeating-linear-gradient(90deg, #000 0px, transparent 1px, transparent 10px, #000 11px)',
                  backgroundSize: '10px 10px'
                }}
              />
            )}
          </div>

          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute left-20 top-20 bg-popover border border-border rounded-lg shadow-lg p-4 z-50"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium">Emojis</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setShowEmojiPicker(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        addSticker(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-2xl hover:bg-muted rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 bg-muted/30 border-l border-border flex flex-col">
        {/* Panel Tabs */}
        <div className="flex border-b border-border">
          <button
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors",
              activePanel === "properties" 
                ? "bg-background border-b-2 border-accent" 
                : "hover:bg-muted/50"
            )}
            onClick={() => setActivePanel("properties")}
          >
            <Settings className="h-4 w-4 inline-block mr-2" />
            Properties
          </button>
          <button
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors",
              activePanel === "layers" 
                ? "bg-background border-b-2 border-accent" 
                : "hover:bg-muted/50"
            )}
            onClick={() => setActivePanel("layers")}
          >
            <Layers className="h-4 w-4 inline-block mr-2" />
            Layers
          </button>
        </div>

        {/* Panel Content */}
        <ScrollArea className="flex-1">
          {activePanel === "properties" ? <PropertyPanel /> : <LayersPanel />}
        </ScrollArea>

        {/* Action Buttons */}
        <div className="p-4 border-t border-border space-y-2">
          <Button
            onClick={() => clearCanvas()}
            variant="outline"
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Canvas
          </Button>
          
          <Button
            onClick={() => {
              const dataUrl = exportCanvas();
              const link = document.createElement("a");
              link.download = `wedding-tile-${tileNumber || Date.now()}.png`;
              link.href = dataUrl;
              link.click();
            }}
            variant="outline"
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          <Button
            onClick={handleSave}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main page component
function CreatePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [tileNumber, setTileNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
      const { data } = await supabase.rpc("claim_next_tile", {
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
      // Save draft
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
    <FabricCanvasProvider>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <div className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
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
                Tile #{tileNumber} • {guestName || "Guest"}
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
          <CanvasEditor 
            tileNumber={tileNumber}
            guestName={guestName}
            guestEmail={guestEmail}
            onSave={saveTile}
          />
        </div>
      </div>
    </FabricCanvasProvider>
  );
}

export default function ModernCanvasPage() {
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
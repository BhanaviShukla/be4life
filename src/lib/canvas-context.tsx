"use client";

import React, { createContext, useContext, useRef, useState, useCallback, ReactNode } from "react";

// Canvas dimensions
export const CANVAS_WIDTH = 300;
export const CANVAS_HEIGHT = 200;

// Tool types
export type ToolType = "draw" | "text" | "eraser" | "select";
export type BrushSize = "xs" | "s" | "m" | "l";

interface CanvasContextType {
  // Canvas refs
  canvasRef: React.RefObject<HTMLCanvasElement>;
  contextRef: React.RefObject<CanvasRenderingContext2D | null>;
  
  // Tool state
  selectedTool: ToolType;
  setSelectedTool: (tool: ToolType) => void;
  brushSize: BrushSize;
  setBrushSize: (size: BrushSize) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  
  // Drawing state
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  
  // History
  history: ImageData[];
  historyIndex: number;
  
  // Actions
  startDrawing: (e: React.MouseEvent | React.TouchEvent) => void;
  draw: (e: React.MouseEvent | React.TouchEvent) => void;
  stopDrawing: () => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  saveToHistory: () => void;
  
  // Export
  exportCanvas: () => string;
  exportAsJSON: () => any;
  loadFromJSON: (data: any) => void;
}

const CanvasContext = createContext<CanvasContextType | null>(null);

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within CanvasProvider");
  }
  return context;
};

const BRUSH_SIZES = {
  xs: 2,
  s: 4,
  m: 8,
  l: 12,
};

export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const [selectedTool, setSelectedTool] = useState<ToolType>("draw");
  const [brushSize, setBrushSize] = useState<BrushSize>("m");
  const [brushColor, setBrushColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize canvas context when canvas is mounted
  const initializeCanvas = useCallback(() => {
    if (canvasRef.current && !canvasInitialized) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.lineJoin = "round";
        contextRef.current = context;
        
        // Set initial background
        context.fillStyle = "white";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        setCanvasInitialized(true);
        
        // Save initial state after a small delay to ensure canvas is ready
        setTimeout(() => {
          if (contextRef.current && canvasRef.current) {
            const imageData = contextRef.current.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            setHistory([imageData]);
            setHistoryIndex(0);
          }
        }, 100);
      }
    }
  }, [canvasInitialized]);

  // Try to initialize canvas whenever children change
  React.useEffect(() => {
    const checkCanvas = setInterval(() => {
      if (canvasRef.current && !canvasInitialized) {
        initializeCanvas();
        clearInterval(checkCanvas);
      }
    }, 100);

    return () => clearInterval(checkCanvas);
  }, [initializeCanvas, canvasInitialized]);

  // Update brush settings when they change
  React.useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = selectedTool === "eraser" ? "white" : brushColor;
      contextRef.current.lineWidth = BRUSH_SIZES[brushSize];
      contextRef.current.globalCompositeOperation = 
        selectedTool === "eraser" ? "destination-out" : "source-over";
    }
  }, [brushColor, brushSize, selectedTool]);

  const saveToHistory = useCallback(() => {
    if (contextRef.current && canvasRef.current) {
      const imageData = contextRef.current.getImageData(
        0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
      );
      
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(imageData);
        return newHistory.slice(-20); // Keep last 20 states
      });
      setHistoryIndex(prev => Math.min(prev + 1, 19));
    }
  }, [historyIndex]);

  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (selectedTool !== "draw" && selectedTool !== "eraser") return;
    
    const { x, y } = getCoordinates(e);
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
      setIsDrawing(true);
    }
  }, [selectedTool, getCoordinates]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || (selectedTool !== "draw" && selectedTool !== "eraser")) return;
    
    const { x, y } = getCoordinates(e);
    if (contextRef.current) {
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    }
  }, [isDrawing, selectedTool, getCoordinates]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  }, [isDrawing, saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0 && contextRef.current) {
      const newIndex = historyIndex - 1;
      contextRef.current.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && contextRef.current) {
      const newIndex = historyIndex + 1;
      contextRef.current.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const clear = useCallback(() => {
    if (contextRef.current && canvasRef.current) {
      contextRef.current.fillStyle = "white";
      contextRef.current.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      saveToHistory();
    }
  }, [saveToHistory]);

  const exportCanvas = useCallback(() => {
    if (canvasRef.current) {
      return canvasRef.current.toDataURL("image/png");
    }
    return "";
  }, []);

  const exportAsJSON = useCallback(() => {
    if (canvasRef.current) {
      return {
        dataUrl: canvasRef.current.toDataURL("image/png"),
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        tool: selectedTool,
        brushSize: brushSize,
        brushColor: brushColor,
      };
    }
    return null;
  }, [selectedTool, brushSize, brushColor]);

  const loadFromJSON = useCallback((data: any) => {
    if (data?.dataUrl && contextRef.current) {
      const img = new Image();
      img.onload = () => {
        contextRef.current?.drawImage(img, 0, 0);
        saveToHistory();
      };
      img.src = data.dataUrl;
    }
  }, [saveToHistory]);

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        contextRef,
        selectedTool,
        setSelectedTool,
        brushSize,
        setBrushSize,
        brushColor,
        setBrushColor,
        isDrawing,
        setIsDrawing,
        history,
        historyIndex,
        startDrawing,
        draw,
        stopDrawing,
        undo,
        redo,
        clear,
        saveToHistory,
        exportCanvas,
        exportAsJSON,
        loadFromJSON,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
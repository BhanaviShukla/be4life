"use client";

import React, { createContext, useContext, useRef, useState, useCallback, useEffect, ReactNode } from "react";
import { fabric } from "fabric";

// Canvas dimensions
export const CANVAS_WIDTH = 300;
export const CANVAS_HEIGHT = 200;

// Tool types
export type ToolType = "select" | "draw" | "text" | "shapes" | "image" | "sticker";
export type ShapeType = "rectangle" | "circle" | "triangle" | "star" | "heart";

interface CanvasObject {
  id: string;
  type: string;
  name: string;
  locked: boolean;
  visible: boolean;
  zIndex: number;
}

interface FabricCanvasContextType {
  // Canvas refs
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  
  // Tool state
  selectedTool: ToolType;
  setSelectedTool: (tool: ToolType) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  
  // Selected object
  selectedObject: fabric.Object | null;
  setSelectedObject: (obj: fabric.Object | null) => void;
  selectedObjects: fabric.Object[];
  setSelectedObjects: (objs: fabric.Object[]) => void;
  
  // Canvas objects
  objects: CanvasObject[];
  updateObjects: () => void;
  
  // Actions
  addText: (text: string, options?: fabric.ITextOptions) => void;
  addShape: (shape: ShapeType, options?: any) => void;
  addImage: (url: string) => void;
  addSticker: (emoji: string) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  group: () => void;
  ungroup: () => void;
  alignLeft: () => void;
  alignCenter: () => void;
  alignRight: () => void;
  alignTop: () => void;
  alignMiddle: () => void;
  alignBottom: () => void;
  distributeHorizontal: () => void;
  distributeVertical: () => void;
  flipHorizontal: () => void;
  flipVertical: () => void;
  lock: () => void;
  unlock: () => void;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Canvas actions
  clearCanvas: () => void;
  exportCanvas: () => string;
  exportAsJSON: () => any;
  loadFromJSON: (data: any) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  fitToScreen: () => void;
  zoom: number;
  
  // Grid and guides
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  showRulers: boolean;
  setShowRulers: (show: boolean) => void;
}

const FabricCanvasContext = createContext<FabricCanvasContextType | null>(null);

export const useFabricCanvas = () => {
  const context = useContext(FabricCanvasContext);
  if (!context) {
    throw new Error("useFabricCanvas must be used within FabricCanvasProvider");
  }
  return context;
};

export const FabricCanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvasState] = useState<fabric.Canvas | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolType>("select");
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#000000");
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [showRulers, setShowRulers] = useState(false);

  // Initialize canvas
  const setCanvas = useCallback((fabricCanvas: fabric.Canvas) => {
    if (!fabricCanvas) return;
    
    setCanvasState(fabricCanvas);
    
    // Ensure canvas is properly initialized
    fabricCanvas.backgroundColor = 'white';
    fabricCanvas.renderAll();
    
    // Set up event handlers
    fabricCanvas.on('selection:created', (e) => {
      if (e.selected) {
        setSelectedObject(e.selected[0]);
        setSelectedObjects(e.selected);
        setSelectedTool('select');
      }
    });
    
    fabricCanvas.on('selection:updated', (e) => {
      if (e.selected) {
        setSelectedObject(e.selected[0]);
        setSelectedObjects(e.selected);
      }
    });
    
    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
      setSelectedObjects([]);
    });
    
    fabricCanvas.on('object:modified', () => {
      if (fabricCanvas.contextContainer) {
        saveToHistory();
        updateObjects();
      }
    });
    
    fabricCanvas.on('object:added', () => {
      if (fabricCanvas.contextContainer) {
        updateObjects();
      }
    });
    
    fabricCanvas.on('object:removed', () => {
      if (fabricCanvas.contextContainer) {
        updateObjects();
      }
    });
    
    // Save initial state after a small delay to ensure canvas is ready
    setTimeout(() => {
      if (fabricCanvas.contextContainer) {
        saveToHistory();
      }
    }, 100);
  }, []);

  // Update objects list
  const updateObjects = useCallback(() => {
    if (!canvas) return;
    
    const objs = canvas.getObjects().map((obj, index) => ({
      id: obj.data?.id || `object-${index}`,
      type: obj.type || 'unknown',
      name: obj.data?.name || `${obj.type} ${index + 1}`,
      locked: obj.lockMovementX || false,
      visible: obj.visible || true,
      zIndex: index
    }));
    
    setObjects(objs);
  }, [canvas]);

  // Save to history
  const saveToHistory = useCallback(() => {
    if (!canvas || !canvas.contextContainer) return;
    
    try {
      const json = JSON.stringify(canvas.toJSON());
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(json);
        return newHistory.slice(-50); // Keep last 50 states
      });
      setHistoryIndex(prev => Math.min(prev + 1, 49));
      setCanUndo(true);
      setCanRedo(false);
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }, [canvas, historyIndex]);

  // Tool switching
  useEffect(() => {
    if (!canvas) return;
    
    switch (selectedTool) {
      case 'draw':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = brushColor;
        break;
      default:
        canvas.isDrawingMode = false;
        break;
    }
  }, [canvas, selectedTool, brushSize, brushColor]);

  // Add text
  const addText = useCallback((text: string = 'Double click to edit', options?: fabric.ITextOptions) => {
    if (!canvas || !canvas.contextContainer) return;
    
    const iText = new fabric.IText(text, {
      left: 50,
      top: 50,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: brushColor,
      ...options
    });
    
    iText.data = {
      id: `text-${Date.now()}`,
      name: `Text ${canvas.getObjects().length + 1}`
    };
    
    canvas.add(iText);
    canvas.setActiveObject(iText);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, brushColor, saveToHistory]);

  // Add shapes
  const addShape = useCallback((shape: ShapeType, options?: any) => {
    if (!canvas || !canvas.contextContainer) return;
    
    let shapeObj: fabric.Object | null = null;
    
    switch (shape) {
      case 'rectangle':
        shapeObj = new fabric.Rect({
          left: 50,
          top: 50,
          width: 100,
          height: 60,
          fill: brushColor,
          ...options
        });
        break;
      
      case 'circle':
        shapeObj = new fabric.Circle({
          left: 50,
          top: 50,
          radius: 30,
          fill: brushColor,
          ...options
        });
        break;
      
      case 'triangle':
        shapeObj = new fabric.Triangle({
          left: 50,
          top: 50,
          width: 60,
          height: 60,
          fill: brushColor,
          ...options
        });
        break;
      
      case 'star':
        const starPoints = [];
        const outerRadius = 30;
        const innerRadius = 15;
        const numPoints = 5;
        
        for (let i = 0; i < numPoints * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / numPoints;
          starPoints.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
          });
        }
        
        shapeObj = new fabric.Polygon(starPoints, {
          left: 50,
          top: 50,
          fill: brushColor,
          ...options
        });
        break;
      
      case 'heart':
        const heartPath = 'M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z';
        shapeObj = new fabric.Path(heartPath, {
          left: 50,
          top: 50,
          fill: brushColor,
          scaleX: 1,
          scaleY: 1,
          ...options
        });
        break;
    }
    
    if (shapeObj) {
      shapeObj.data = {
        id: `shape-${Date.now()}`,
        name: `${shape} ${canvas.getObjects().length + 1}`
      };
      
      canvas.add(shapeObj);
      canvas.setActiveObject(shapeObj);
      canvas.renderAll();
      saveToHistory();
    }
  }, [canvas, brushColor, saveToHistory]);

  // Add image
  const addImage = useCallback((url: string) => {
    if (!canvas || !canvas.contextContainer) return;
    
    fabric.Image.fromURL(url, (img) => {
      img.scaleToWidth(100);
      img.set({
        left: 50,
        top: 50
      });
      
      img.data = {
        id: `image-${Date.now()}`,
        name: `Image ${canvas.getObjects().length + 1}`
      };
      
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      saveToHistory();
    });
  }, [canvas, saveToHistory]);

  // Add sticker (emoji)
  const addSticker = useCallback((emoji: string) => {
    if (!canvas || !canvas.contextContainer) return;
    
    const text = new fabric.Text(emoji, {
      left: 50,
      top: 50,
      fontSize: 40,
      fontFamily: 'Arial'
    });
    
    text.data = {
      id: `sticker-${Date.now()}`,
      name: `Emoji ${canvas.getObjects().length + 1}`
    };
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, saveToHistory]);

  // Delete selected
  const deleteSelected = useCallback(() => {
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach(obj => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
      saveToHistory();
    }
  }, [canvas, saveToHistory]);

  // Duplicate selected
  const duplicateSelected = useCallback(() => {
    if (!canvas || !selectedObject) return;
    
    selectedObject.clone((cloned: fabric.Object) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20
      });
      
      cloned.data = {
        id: `${selectedObject.data?.type || 'object'}-${Date.now()}`,
        name: `${selectedObject.data?.name || 'Object'} copy`
      };
      
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      saveToHistory();
    });
  }, [canvas, selectedObject, saveToHistory]);

  // Layer controls
  const bringForward = useCallback(() => {
    if (!canvas || !selectedObject) return;
    canvas.bringForward(selectedObject);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObject, saveToHistory]);

  const sendBackward = useCallback(() => {
    if (!canvas || !selectedObject) return;
    canvas.sendBackward(selectedObject);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObject, saveToHistory]);

  const bringToFront = useCallback(() => {
    if (!canvas || !selectedObject) return;
    canvas.bringToFront(selectedObject);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObject, saveToHistory]);

  const sendToBack = useCallback(() => {
    if (!canvas || !selectedObject) return;
    canvas.sendToBack(selectedObject);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObject, saveToHistory]);

  // Group/Ungroup
  const group = useCallback(() => {
    if (!canvas || selectedObjects.length < 2) return;
    
    const group = new fabric.Group(selectedObjects, {
      canvas: canvas
    });
    
    selectedObjects.forEach(obj => canvas.remove(obj));
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObjects, saveToHistory]);

  const ungroup = useCallback(() => {
    if (!canvas || !selectedObject) return;
    
    if (selectedObject.type === 'group') {
      const items = (selectedObject as fabric.Group).getObjects();
      (selectedObject as fabric.Group).destroy();
      canvas.remove(selectedObject);
      
      items.forEach(item => {
        canvas.add(item);
      });
      
      canvas.renderAll();
      saveToHistory();
    }
  }, [canvas, selectedObject, saveToHistory]);

  // Alignment functions
  const alignLeft = useCallback(() => {
    if (!canvas || selectedObjects.length === 0) return;
    const left = Math.min(...selectedObjects.map(obj => obj.left || 0));
    selectedObjects.forEach(obj => obj.set({ left }));
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObjects, saveToHistory]);

  const alignCenter = useCallback(() => {
    if (!canvas || selectedObjects.length === 0) return;
    const center = CANVAS_WIDTH / 2;
    selectedObjects.forEach(obj => {
      const width = obj.getScaledWidth();
      obj.set({ left: center - width / 2 });
    });
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObjects, saveToHistory]);

  const alignRight = useCallback(() => {
    if (!canvas || selectedObjects.length === 0) return;
    const maxRight = Math.max(...selectedObjects.map(obj => (obj.left || 0) + obj.getScaledWidth()));
    selectedObjects.forEach(obj => {
      const width = obj.getScaledWidth();
      obj.set({ left: maxRight - width });
    });
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObjects, saveToHistory]);

  const alignTop = useCallback(() => {
    if (!canvas || selectedObjects.length === 0) return;
    const top = Math.min(...selectedObjects.map(obj => obj.top || 0));
    selectedObjects.forEach(obj => obj.set({ top }));
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObjects, saveToHistory]);

  const alignMiddle = useCallback(() => {
    if (!canvas || selectedObjects.length === 0) return;
    const middle = CANVAS_HEIGHT / 2;
    selectedObjects.forEach(obj => {
      const height = obj.getScaledHeight();
      obj.set({ top: middle - height / 2 });
    });
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObjects, saveToHistory]);

  const alignBottom = useCallback(() => {
    if (!canvas || selectedObjects.length === 0) return;
    const maxBottom = Math.max(...selectedObjects.map(obj => (obj.top || 0) + obj.getScaledHeight()));
    selectedObjects.forEach(obj => {
      const height = obj.getScaledHeight();
      obj.set({ top: maxBottom - height });
    });
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObjects, saveToHistory]);

  const distributeHorizontal = useCallback(() => {
    if (!canvas || selectedObjects.length < 3) return;
    
    const sorted = [...selectedObjects].sort((a, b) => (a.left || 0) - (b.left || 0));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const totalSpace = (last.left || 0) - (first.left || 0);
    const spacing = totalSpace / (sorted.length - 1);
    
    sorted.forEach((obj, index) => {
      if (index !== 0 && index !== sorted.length - 1) {
        obj.set({ left: (first.left || 0) + spacing * index });
      }
    });
    
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObjects, saveToHistory]);

  const distributeVertical = useCallback(() => {
    if (!canvas || selectedObjects.length < 3) return;
    
    const sorted = [...selectedObjects].sort((a, b) => (a.top || 0) - (b.top || 0));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const totalSpace = (last.top || 0) - (first.top || 0);
    const spacing = totalSpace / (sorted.length - 1);
    
    sorted.forEach((obj, index) => {
      if (index !== 0 && index !== sorted.length - 1) {
        obj.set({ top: (first.top || 0) + spacing * index });
      }
    });
    
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObjects, saveToHistory]);

  // Flip functions
  const flipHorizontal = useCallback(() => {
    if (!canvas || !selectedObject) return;
    selectedObject.set({ flipX: !selectedObject.flipX });
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObject, saveToHistory]);

  const flipVertical = useCallback(() => {
    if (!canvas || !selectedObject) return;
    selectedObject.set({ flipY: !selectedObject.flipY });
    canvas.renderAll();
    saveToHistory();
  }, [canvas, selectedObject, saveToHistory]);

  // Lock/Unlock
  const lock = useCallback(() => {
    if (!canvas || selectedObjects.length === 0) return;
    selectedObjects.forEach(obj => {
      obj.set({
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true
      });
    });
    canvas.renderAll();
    updateObjects();
  }, [canvas, selectedObjects, updateObjects]);

  const unlock = useCallback(() => {
    if (!canvas || selectedObjects.length === 0) return;
    selectedObjects.forEach(obj => {
      obj.set({
        lockMovementX: false,
        lockMovementY: false,
        lockRotation: false,
        lockScalingX: false,
        lockScalingY: false
      });
    });
    canvas.renderAll();
    updateObjects();
  }, [canvas, selectedObjects, updateObjects]);

  // Undo/Redo
  const undo = useCallback(() => {
    if (!canvas || historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    const state = history[newIndex];
    
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
      setHistoryIndex(newIndex);
      setCanUndo(newIndex > 0);
      setCanRedo(true);
      updateObjects();
    });
  }, [canvas, history, historyIndex, updateObjects]);

  const redo = useCallback(() => {
    if (!canvas || historyIndex >= history.length - 1) return;
    
    const newIndex = historyIndex + 1;
    const state = history[newIndex];
    
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
      setHistoryIndex(newIndex);
      setCanRedo(newIndex < history.length - 1);
      setCanUndo(true);
      updateObjects();
    });
  }, [canvas, history, historyIndex, updateObjects]);

  // Canvas actions
  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = 'white';
    canvas.renderAll();
    saveToHistory();
  }, [canvas, saveToHistory]);

  const exportCanvas = useCallback(() => {
    if (!canvas) return '';
    return canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
  }, [canvas]);

  const exportAsJSON = useCallback(() => {
    if (!canvas) return null;
    return canvas.toJSON();
  }, [canvas]);

  const loadFromJSON = useCallback((data: any) => {
    if (!canvas) return;
    
    if (typeof data === 'string') {
      // If it's a data URL, load as background image
      fabric.Image.fromURL(data, (img) => {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    } else {
      // Load as JSON
      canvas.loadFromJSON(data, () => {
        canvas.renderAll();
        saveToHistory();
      });
    }
  }, [canvas, saveToHistory]);

  // Zoom functions
  const zoomIn = useCallback(() => {
    if (!canvas) return;
    const newZoom = Math.min(zoom + 25, 200);
    setZoom(newZoom);
    canvas.setZoom(newZoom / 100);
    canvas.renderAll();
  }, [canvas, zoom]);

  const zoomOut = useCallback(() => {
    if (!canvas) return;
    const newZoom = Math.max(zoom - 25, 50);
    setZoom(newZoom);
    canvas.setZoom(newZoom / 100);
    canvas.renderAll();
  }, [canvas, zoom]);

  const resetZoom = useCallback(() => {
    if (!canvas) return;
    setZoom(100);
    canvas.setZoom(1);
    canvas.renderAll();
  }, [canvas]);

  const fitToScreen = useCallback(() => {
    if (!canvas) return;
    // Implementation for fit to screen
    canvas.setZoom(1);
    setZoom(100);
    canvas.renderAll();
  }, [canvas]);

  return (
    <FabricCanvasContext.Provider
      value={{
        canvas,
        setCanvas,
        canvasRef,
        selectedTool,
        setSelectedTool,
        brushSize,
        setBrushSize,
        brushColor,
        setBrushColor,
        selectedObject,
        setSelectedObject,
        selectedObjects,
        setSelectedObjects,
        objects,
        updateObjects,
        addText,
        addShape,
        addImage,
        addSticker,
        deleteSelected,
        duplicateSelected,
        bringForward,
        sendBackward,
        bringToFront,
        sendToBack,
        group,
        ungroup,
        alignLeft,
        alignCenter,
        alignRight,
        alignTop,
        alignMiddle,
        alignBottom,
        distributeHorizontal,
        distributeVertical,
        flipHorizontal,
        flipVertical,
        lock,
        unlock,
        undo,
        redo,
        canUndo,
        canRedo,
        clearCanvas,
        exportCanvas,
        exportAsJSON,
        loadFromJSON,
        zoomIn,
        zoomOut,
        resetZoom,
        fitToScreen,
        zoom,
        showGrid,
        setShowGrid,
        snapToGrid,
        setSnapToGrid,
        showRulers,
        setShowRulers
      }}
    >
      {children}
    </FabricCanvasContext.Provider>
  );
};
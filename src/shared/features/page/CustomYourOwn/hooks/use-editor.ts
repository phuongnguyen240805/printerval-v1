"use client";

import * as fabric from "fabric";
import { useCallback, useState, useMemo, useRef } from "react";

import { 
  Editor, 
  FILL_COLOR,
  STROKE_WIDTH,
  STROKE_COLOR,
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  TRIANGLE_OPTIONS,
  BuildEditorProps, 
  RECTANGLE_OPTIONS,
  EditorHookProps,
  STROKE_DASH_ARRAY,
  TEXT_OPTIONS,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  JSON_KEYS,
} from "../types";
import { useHistory } from "./use-history";
import { useHotkeys } from "./use-hotkeys";
import { useClipboard } from "./use-clipboard";
import { useAutoResize } from "./use-auto-resize";
import { useCanvasEvents } from "./use-canvas-events";
import { useWindowEvents } from "./use-window-events";
import { useLoadState } from "./use-load-state";
import { ITextboxOptions } from "fabric/fabric-impl";

const isTextType = (type: string): boolean => {
  return type === "text" || type === "i-text" || type === "textbox";
};

const downloadFile = (dataUrl: string, format: string) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `design.${format}`;
  link.click();
};

const transformText = async (objects: any[] = []) => objects;

const createFilter = (filterId: string) => {
  switch (filterId) {
    case "polaroid":
      return new fabric.filters.Polaroid();
    case "sepia":
      return new fabric.filters.Sepia();
    case "kodachrome":
      return new fabric.filters.Kodachrome();
    case "contrast":
      return new fabric.filters.Contrast({ contrast: 0.3 });
    case "brightness":
      return new fabric.filters.Brightness({ brightness: 0.1 });
    case "greyscale":
      return new fabric.filters.Grayscale();
    case "brownie":
      return new fabric.filters.Brownie();
    case "vintage":
      return new fabric.filters.Vintage();
    case "technicolor":
      return new fabric.filters.Technicolor();
    case "pixelate":
      return new fabric.filters.Pixelate({ blocksize: 5 });
    case "invert":
      return new fabric.filters.Invert();
    case "blur":
      return new fabric.filters.Blur({ blur: 0.3 });
    default:
      return null;
  }
};

const buildEditor = ({
  save,
  undo,
  redo,
  canRedo,
  canUndo,
  autoZoom,
  copy,
  paste,
  canvas,
  fillColor,
  fontFamily,
  setFontFamily,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  selectedObjects,
  strokeDashArray,
  setStrokeDashArray,
}: BuildEditorProps): Editor => {
  const generateSaveOptions = () => {
    const workspace = getWorkspace() as fabric.Rect;
    if (!workspace) {
      return {
        name: "Image",
        quality: 1,
        width: 800,
        height: 600,
        left: 0,
        top: 0,
      };
    }

    const { width = 800, height = 600, left = 0, top = 0 } = workspace;

    return {
      name: "Image",
      quality: 1,
      width,
      height,
      left,
      top,
    };
  };

  const savePng = () => {
    const options = generateSaveOptions();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 1, ...options });
    downloadFile(dataUrl, "png");
    autoZoom();
  };

  const saveSvg = () => {
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const svg = canvas.toSVG();
    const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    downloadFile(svgDataUrl, "svg");
    autoZoom();
  };

  const saveJpg = () => {
    const options = generateSaveOptions();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL({ format: "jpeg", multiplier: 1, ...options });
    downloadFile(dataUrl, "jpg");
    autoZoom();
  };

  const saveJson = async () => {
    const dataUrl = canvas.toJSON() as any;
    await transformText(dataUrl.objects);
    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataUrl, null, "\t"))}`;
    downloadFile(fileString, "json");
  };

  const loadJson = (json: string) => {
    const data = JSON.parse(json);
    canvas.loadFromJSON(data, () => {
      autoZoom();
    });
  };

  const getWorkspace = () => {
    return canvas.getObjects().find((object: any) => object.name === "clip");
  };

  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();
    if (!center) return;
    // @ts-ignore
    canvas._centerObject(object, center);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  return {
    savePng,
    saveJpg,
    saveSvg,
    saveJson,
    loadJson,
    canUndo,
    canRedo,
    autoZoom,
    getWorkspace,
    zoomIn: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio += 0.05;
      const center = canvas.getVpCenter();
      canvas.zoomToPoint(center, zoomRatio > 1 ? 1 : zoomRatio);
    },
    zoomOut: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio -= 0.05;
      const center = canvas.getVpCenter();
      canvas.zoomToPoint(center, zoomRatio < 0.2 ? 0.2 : zoomRatio);
    },
    changeSize: (value: { width: number; height: number }) => {
      const workspace = getWorkspace();
      workspace?.set(value);
      autoZoom();
      save();
    },
    changeBackground: (value: string) => {
      const workspace = getWorkspace();
      workspace?.set({ fill: value });
      canvas.renderAll();
      save();
    },
    enableDrawingMode: () => {
      canvas.discardActiveObject();
      canvas.renderAll();
      canvas.isDrawingMode = true;
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = strokeWidth;
        canvas.freeDrawingBrush.color = strokeColor;
      }
    },
    disableDrawingMode: () => {
      canvas.isDrawingMode = false;
    },
    onUndo: () => undo(),
    onRedo: () => redo(),
    onCopy: () => copy(),
    onPaste: () => paste(),
    changeImageFilter: (value: string) => {
      const objects = canvas.getActiveObjects();
      objects.forEach((object: any) => {
        if (object.type === "image") {
          const imageObject = object as fabric.Image;
          const effect = createFilter(value);
          imageObject.filters = effect ? [effect] : [];
          imageObject.applyFilters();
          canvas.renderAll();
        }
      });
    },
    addImage: (value: string) => {
      fabric.Image.fromURL(value).then((image) => {
        const workspace = getWorkspace();
        image.scaleToWidth((workspace as any)?.width || 0);
        image.scaleToHeight((workspace as any)?.height || 0);
        addToCanvas(image);
      });
    },
    delete: () => {
      canvas.getActiveObjects().forEach((object: any) => canvas.remove(object));
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    addText: (value: string, options?: ITextboxOptions) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor as any,
        ...options,
      } as any);
      addToCanvas(object);
    },
    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return 1;
      return selectedObject.get("opacity") || 1;
    },
    changeFontSize: (value: number) => {
      canvas.getActiveObjects().forEach((object: any) => {
        if (isTextType(object.type)) {
          object.set({ fontSize: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return FONT_SIZE;
      return selectedObject.get("fontSize") || FONT_SIZE;
    },
    changeTextAlign: (value: string) => {
      canvas.getActiveObjects().forEach((object: any) => {
        if (isTextType(object.type)) {
          object.set({ textAlign: value });
        }
      });
      canvas.renderAll();
    },
    getActiveTextAlign: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return "left";
      return selectedObject.get("textAlign") || "left";
    },
    changeFontUnderline: (value: boolean) => {
      canvas.getActiveObjects().forEach((object: any) => {
        if (isTextType(object.type)) {
          object.set({ underline: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return false;
      return selectedObject.get("underline") || false;
    },
    changeFontLinethrough: (value: boolean) => {
      canvas.getActiveObjects().forEach((object: any) => {
        if (isTextType(object.type)) {
          object.set({ linethrough: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontLinethrough: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return false;
      return selectedObject.get("linethrough") || false;
    },
    changeFontStyle: (value: string) => {
      canvas.getActiveObjects().forEach((object: any) => {
        if (isTextType(object.type)) {
          object.set({ fontStyle: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return "normal";
      return selectedObject.get("fontStyle") || "normal";
    },
    changeFontWeight: (value: number) => {
      canvas.getActiveObjects().forEach((object: any) => {
        if (isTextType(object.type)) {
          object.set({ fontWeight: value });
        }
      });
      canvas.renderAll();
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object: any) => {
        object.set({ opacity: value });
      });
      canvas.renderAll();
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object: any) => {
        canvas.bringObjectToFront(object);
      });
      canvas.renderAll();
      const workspace = getWorkspace() as any;
      canvas.sendObjectToBack(workspace);
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object: any) => {
        canvas.sendObjectToBack(object);
      });
      canvas.renderAll();
      const workspace = getWorkspace() as any;
      canvas.sendObjectToBack(workspace);
    },
    changeFontFamily: (value: string) => {
      setFontFamily(value);
      canvas.getActiveObjects().forEach((object: any) => {
        if (isTextType(object.type)) {
          object.set({ fontFamily: value });
        }
      });
      canvas.renderAll();
    },
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object: any) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object: any) => {
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }
        object.set({ stroke: value });
      });
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = value;
      }
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object: any) => {
        object.set({ strokeWidth: value });
      });
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = value;
      }
      canvas.renderAll();
    },
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object: any) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor as any,
        stroke: strokeColor as any,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
        fill: fillColor as any,
        stroke: strokeColor as any,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor as any,
        stroke: strokeColor as any,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor as any,
        stroke: strokeColor as any,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const HEIGHT = TRIANGLE_OPTIONS.height;
      const WIDTH = TRIANGLE_OPTIONS.width;
      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...TRIANGLE_OPTIONS,
          fill: fillColor as any,
          stroke: strokeColor as any,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      );
      addToCanvas(object);
    },
    addDiamond: () => {
      const HEIGHT = DIAMOND_OPTIONS.height;
      const WIDTH = DIAMOND_OPTIONS.width;
      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        {
          ...DIAMOND_OPTIONS,
          fill: fillColor as any,
          stroke: strokeColor as any,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      );
      addToCanvas(object);
    },
    addShape: (shapeType: "circle" | "rectangle" | "triangle") => {
      if (shapeType === "circle") return buildEditor({ save, undo, redo, canRedo, canUndo, autoZoom, copy, paste, canvas, fillColor, fontFamily, setFontFamily, setFillColor, strokeColor, setStrokeColor, strokeWidth, setStrokeWidth, selectedObjects, strokeDashArray, setStrokeDashArray }).addCircle();
      if (shapeType === "rectangle") return buildEditor({ save, undo, redo, canRedo, canUndo, autoZoom, copy, paste, canvas, fillColor, fontFamily, setFontFamily, setFillColor, strokeColor, setStrokeColor, strokeWidth, setStrokeWidth, selectedObjects, strokeDashArray, setStrokeDashArray }).addRectangle();
      return buildEditor({ save, undo, redo, canRedo, canUndo, autoZoom, copy, paste, canvas, fillColor, fontFamily, setFontFamily, setFillColor, strokeColor, setStrokeColor, strokeWidth, setStrokeWidth, selectedObjects, strokeDashArray, setStrokeDashArray }).addTriangle();
    },
    changeFilter: (value: string) => {
      return buildEditor({ save, undo, redo, canRedo, canUndo, autoZoom, copy, paste, canvas, fillColor, fontFamily, setFontFamily, setFillColor, strokeColor, setStrokeColor, strokeWidth, setStrokeWidth, selectedObjects, strokeDashArray, setStrokeDashArray }).changeImageFilter(value);
    },
    duplicate: () => {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;
      const cloned = JSON.parse(JSON.stringify(activeObject.toJSON()));
      cloned.left = (cloned.left || 0) + 10;
      cloned.top = (cloned.top || 0) + 10;
      fabric.util.enlivenObjects([cloned]).then((objects: any) => {
        if (objects[0]) {
          canvas.add(objects[0]);
          canvas.setActiveObject(objects[0]);
          canvas.renderAll();
        }
      });
    },
    zoom: (value: number) => {
      canvas.setZoom(value);
      canvas.renderAll();
    },
    copy: () => copy(),
    paste: () => paste(),
    changeBold: (value: boolean) => {
      canvas.getActiveObjects().forEach((object: any) => {
        if (isTextType(object.type)) {
          object.set({ fontWeight: value ? 700 : 400 });
        }
      });
      canvas.renderAll();
    },
    changeItalic: (value: boolean) => {
      canvas.getActiveObjects().forEach((object: any) => {
        if (isTextType(object.type)) {
          object.set({ fontStyle: value ? "italic" : "normal" });
        }
      });
      canvas.renderAll();
    },
    changeUnderline: (value: boolean) => {
      canvas.getActiveObjects().forEach((object: any) => {
        if (isTextType(object.type)) {
          object.set({ underline: value });
        }
      });
      canvas.renderAll();
    },
    changeStrikethrough: (value: boolean) => {
      canvas.getActiveObjects().forEach((object: any) => {
        if (isTextType(object.type)) {
          object.set({ linethrough: value });
        }
      });
      canvas.renderAll();
    },
    canvas,
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return FONT_WEIGHT;
      return selectedObject.get("fontWeight") || FONT_WEIGHT;
    },
    getActiveFontFamily: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return fontFamily;
      return selectedObject.get("fontFamily") || fontFamily;
    },
    getActiveFillColor: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return fillColor;
      return selectedObject.get("fill") || fillColor;
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return strokeColor;
      return selectedObject.get("stroke") || strokeColor;
    },
    getActiveStrokeWidth: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return strokeWidth;
      return selectedObject.get("strokeWidth") || strokeWidth;
    },
    getActiveStrokeDashArray: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) return strokeDashArray;
      return selectedObject.get("strokeDashArray") || strokeDashArray;
    },
    selectedObjects,
  };
};

export const useEditor = ({
  defaultState,
  defaultHeight,
  defaultWidth,
  clearSelectionCallback,
  onSave,
}: EditorHookProps) => {
  const initialState = useRef(defaultState);
  const initialWidth = useRef(defaultWidth);
  const initialHeight = useRef(defaultHeight);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);

  useWindowEvents();

  const { 
    save, 
    canRedo, 
    canUndo, 
    undo, 
    redo,
    canvasHistory,
    setHistoryIndex,
  } = useHistory({ 
    canvas,
    saveCallback: onSave,
  });

  const { copy, paste } = useClipboard({ canvas });

  const { autoZoom } = useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    save,
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
  });

  useHotkeys({
    undo,
    redo,
    copy,
    paste,
    save,
    canvas,
  });

  useLoadState({
    canvas,
    autoZoom,
    initialState: initialState.current,
  });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        save,
        undo,
        redo,
        canUndo,
        canRedo,
        autoZoom,
        copy,
        paste,
        canvas,
        fillColor,
        strokeWidth,
        strokeColor,
        setFillColor,
        setStrokeColor,
        setStrokeWidth,
        strokeDashArray,
        selectedObjects,
        setStrokeDashArray,
        fontFamily,
        setFontFamily,
      });
    }

    return undefined;
  }, 
  [
    canRedo,
    canUndo,
    undo,
    redo,
    save,
    autoZoom,
    copy,
    paste,
    canvas,
    fillColor,
    strokeWidth,
    strokeColor,
    selectedObjects,
    strokeDashArray,
    fontFamily,
  ]);

  const init = useCallback(
    (element: HTMLDivElement, initialJson?: string) => {
      // Clear element first
      element.innerHTML = '';
      
      const canvasElement = document.createElement('canvas');
      canvasElement.width = element.offsetWidth;
      canvasElement.height = element.offsetHeight;
      element.appendChild(canvasElement);
      
      const initialCanvas = new fabric.Canvas(canvasElement, {
        backgroundColor: "#f3f4f6",
      });

      fabric.Object.prototype.set({
        cornerColor: "#FFF",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });

      const initialWorkspace = new fabric.Rect({
        width: initialWidth.current,
        height: initialHeight.current,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.8)",
          blur: 5,
        }),
      });

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(element);
    },
    []
  );

  return { init, editor };
};

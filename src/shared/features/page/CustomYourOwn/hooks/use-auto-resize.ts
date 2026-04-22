import * as fabric from "fabric";
import { useCallback } from "react";

interface UseAutoResizeProps {
  canvas: fabric.Canvas | null;
  container?: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas }: UseAutoResizeProps) => {
  const autoZoom = useCallback(() => {
    if (!canvas) return;
    canvas.setZoom(1);
    canvas.renderAll();
  }, [canvas]);

  return {
    autoZoom,
  };
};

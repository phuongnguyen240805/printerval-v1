import * as fabric from "fabric";
import { useEffect, useRef } from "react";

interface UseLoadStateProps {
  autoZoom?: () => void;
  canvas: fabric.Canvas | null;
  initialState?: string;
}

export const useLoadState = ({
  canvas,
  autoZoom,
  initialState,
}: UseLoadStateProps) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && initialState && canvas) {
      const data = JSON.parse(initialState);
      canvas.loadFromJSON(data, () => {
        canvas.renderAll();
        autoZoom?.();
      });
      initialized.current = true;
    }
  }, [canvas, initialState, autoZoom]);
};

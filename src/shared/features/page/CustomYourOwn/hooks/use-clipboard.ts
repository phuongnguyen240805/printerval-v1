import * as fabric from "fabric";
import { useCallback, useRef } from "react";

interface UseClipboardProps {
  canvas: fabric.Canvas | null;
}

export const useClipboard = ({ canvas }: UseClipboardProps) => {
  const clipboard = useRef<any>(null);

  const copy = useCallback(() => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) {
      activeObject.clone([], (cloned: any) => {
        clipboard.current = cloned;
      });
    }
  }, [canvas]);

  const paste = useCallback(() => {
    if (!clipboard.current || !canvas) return;

    clipboard.current.clone([], (cloned: any) => {
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  }, [canvas]);

  return {
    copy,
    paste,
  };
};

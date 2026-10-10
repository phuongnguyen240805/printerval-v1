"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { ActiveTool, Editor } from "../../types";
import { MockupLibrary } from "../mockup-library/MockupLibrary";
import styles from "../mockup-library/MockupLibrary.module.css";

interface CategoryImagesSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const CategoryImagesSidebar = ({
  activeTool,
  onChangeActiveTool,
}: CategoryImagesSidebarProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = activeTool === "category-images";

  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      // Keep editor hotkeys (delete, undo, paste) from changing the canvas behind the dialog.
      event.stopPropagation();
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        onChangeActiveTool("none");
      }
      if (event.key !== "Tab") return;
      const elements = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(
          'button, a[href], iframe, [tabindex="0"]',
        ) ?? [],
      ).filter((element) => !element.hasAttribute("disabled"));
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [isOpen, onChangeActiveTool]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => onChangeActiveTool("none")}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="choose-images-title"
        aria-describedby="choose-images-description"
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-2xl flex flex-col ${styles.modal}`}
      >
        <div
          className={`flex items-center justify-between p-6 border-b border-gray-200 ${styles.header}`}
        >
          <div>
            <h2
              id="choose-images-title"
              className="text-xl font-semibold text-gray-900"
            >
              Choose Images
            </h2>
            <p id="choose-images-description" className="text-sm text-gray-500">
              Browse the Placeit mockup library
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close Choose Images"
            onClick={() => onChangeActiveTool("none")}
            className={`text-gray-500 hover:text-gray-700 ${styles.close}`}
          >
            <X className="size-6" />
          </button>
        </div>
        <div className={styles.body}>
          <MockupLibrary />
        </div>
      </div>
    </>
  );
};

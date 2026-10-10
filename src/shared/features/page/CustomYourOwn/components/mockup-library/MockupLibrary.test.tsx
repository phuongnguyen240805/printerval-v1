import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import type { act as Act } from "react-dom/test-utils";
import { MockupLibrary } from "./MockupLibrary";
import {
  isLibraryMessage,
  LOAD_TIMEOUT_MS,
  resolveIntegration,
} from "./integration";
import { CategoryImagesSidebar } from "../sidebar/category-images-sidebar";

const act = (React as typeof React & { act: typeof Act }).act;
let root: Root;
let host: HTMLDivElement;
const originalEnv = { ...process.env };
beforeEach(() => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  delete process.env.NEXT_PUBLIC_MOCKUP_LIBRARY_MODE;
  delete process.env.NEXT_PUBLIC_MOCKUP_LIBRARY_PERMISSION_VERIFIED;
  delete process.env.NEXT_PUBLIC_MOCKUP_LIBRARY_GATEWAY_URL;
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  jest.useRealTimers();
  process.env = { ...originalEnv };
});

test("default and direct modes fail closed; gateway requires permission and an isolated HTTPS origin", () => {
  expect(resolveIntegration().mode).toBe("disabled");
  expect(resolveIntegration("direct-iframe", "true").mode).toBe("disabled");
  for (const url of [
    "http://gateway.test",
    "https://user:secret@gateway.test",
    window.location.origin,
    "invalid",
  ]) {
    expect(
      resolveIntegration(
        "authorized-proxy",
        "true",
        url,
        window.location.origin,
      ).mode,
    ).toBe("disabled");
  }
  expect(
    resolveIntegration(
      "authorized-proxy",
      "false",
      "https://gateway.test",
      window.location.origin,
    ).mode,
  ).toBe("disabled");
  expect(
    resolveIntegration(
      "authorized-proxy",
      "true",
      "https://gateway.test/library",
      window.location.origin,
    ).mode,
  ).toBe("authorized-proxy");
});

test("blocked UI creates no iframe and retry does not start a prohibited request", () => {
  act(() => root.render(<MockupLibrary />));
  expect(host.textContent).toContain("Mockup library unavailable");
  expect(host.querySelector("iframe")).toBeNull();
  act(() => host.querySelector("button")!.click());
  expect(host.querySelector("iframe")).toBeNull();
  expect(host.querySelector("a")?.target).toBe("_blank");
});

function renderGateway() {
  process.env.NEXT_PUBLIC_MOCKUP_LIBRARY_MODE = "authorized-proxy";
  process.env.NEXT_PUBLIC_MOCKUP_LIBRARY_PERMISSION_VERIFIED = "true";
  process.env.NEXT_PUBLIC_MOCKUP_LIBRARY_GATEWAY_URL =
    "https://gateway.test/library";
  act(() => root.render(<MockupLibrary />));
  return host.querySelector("iframe")!;
}
function message(
  frame: HTMLIFrameElement,
  status: string,
  origin = "https://gateway.test",
) {
  act(() =>
    window.dispatchEvent(
      new MessageEvent("message", {
        source: frame.contentWindow,
        origin,
        data: { type: "printerval:mockup-library", status },
      }),
    ),
  );
}

test("iframe load is not readiness; absent or forged confirmation times out, retry remounts", () => {
  const frame = renderGateway();
  act(() => frame.dispatchEvent(new Event("load")));
  message(frame, "ready", "https://untrusted.test");
  expect(
    isLibraryMessage(
      new MessageEvent("message", {
        origin: "https://gateway.test",
        data: { type: "printerval:mockup-library", status: "ready" },
      }),
      frame.contentWindow,
      "https://gateway.test",
    ),
  ).toBe(false);
  expect(host.textContent).toContain("Loading mockup library");
  act(() => jest.advanceTimersByTime(LOAD_TIMEOUT_MS));
  expect(host.textContent).toContain("too long to respond");
  expect(host.querySelector("iframe")).toBeNull();
  act(() => host.querySelector("button")!.click());
  expect(host.querySelector("iframe")).not.toBe(frame);
  expect(host.textContent).toContain("Loading mockup library");
});

test.each(["ready", "empty", "error"])(
  "trusted gateway reports %s and cancels timeout",
  (status) => {
    const frame = renderGateway();
    message(frame, status);
    act(() => jest.advanceTimersByTime(LOAD_TIMEOUT_MS));
    expect(host.textContent).not.toContain("too long to respond");
    if (status === "ready")
      expect(host.textContent).not.toContain("Loading mockup library");
    if (status === "empty")
      expect(host.textContent).toContain("No mockups found");
    if (status === "error")
      expect(host.textContent).toContain("Unable to load");
  },
);

test("dialog contains focus, protects canvas hotkeys, restores focus and body scroll", () => {
  const trigger = document.createElement("button");
  document.body.append(trigger);
  trigger.focus();
  const close = jest.fn();
  const editorKey = jest.fn();
  window.addEventListener("keydown", editorKey);
  act(() =>
    root.render(
      <CategoryImagesSidebar
        editor={undefined}
        activeTool="category-images"
        onChangeActiveTool={close}
      />,
    ),
  );
  expect(document.activeElement?.getAttribute("aria-label")).toBe(
    "Close Choose Images",
  );
  act(() =>
    document.activeElement?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  expect(document.activeElement?.tagName).toBe("A");
  act(() =>
    document.activeElement?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Delete", bubbles: true }),
    ),
  );
  expect(editorKey).not.toHaveBeenCalled();
  act(() =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ),
  );
  expect(close).toHaveBeenCalledWith("none");
  act(() =>
    root.render(
      <CategoryImagesSidebar
        editor={undefined}
        activeTool="none"
        onChangeActiveTool={close}
      />,
    ),
  );
  expect(document.activeElement).toBe(trigger);
  expect(document.body.style.overflow).toBe("");
  window.removeEventListener("keydown", editorKey);
  trigger.remove();
});

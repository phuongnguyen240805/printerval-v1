import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import type { act as Act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AiAccountsPage } from "../page/AiAccountsPage/AiAccountsPage";
import { mapAiCatalog } from "./adapter";

const act = (React as typeof React & { act: typeof Act }).act;
let root: Root;
let host: HTMLDivElement;
let client: QueryClient;
const savedFetch = global.fetch;
beforeEach(() => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: 0 } },
  });
});
afterEach(() => {
  act(() => root.unmount());
  client.clear();
  host.remove();
  global.fetch = savedFetch;
});
async function render() {
  await act(async () => {
    root.render(
      <QueryClientProvider client={client}>
        <AiAccountsPage />
      </QueryClientProvider>,
    );
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
}
test("renders API products, expands all 18 and links to dynamic backend handles", async () => {
  const data = mapAiCatalog(
    Array.from({ length: 18 }, (_, i) => ({
      id: `prod_${i}`,
      handle: `live-agent-${i}`,
      title: `API Agent ${i}`,
      metadata: { features: ["API feature"] },
      variants: [
        {
          id: `v_${i}`,
          calculated_price: { calculated_amount: 125000, currency_code: "vnd" },
        },
      ],
    })),
  );
  const request = jest
    .fn()
    .mockResolvedValue({ ok: true, json: async () => data });
  global.fetch = request;
  // jsdom lacks AbortSignal.timeout; use the browser timeout contract without waiting 45 seconds.
  const saved = AbortSignal.timeout;
  AbortSignal.timeout = () => new AbortController().signal;
  try {
    await render();
    expect(request.mock.calls[0]?.[0]).toBe("/api/ai-catalog");
    expect(host.querySelectorAll("article").length).toBeGreaterThanOrEqual(8);
    expect(host.querySelector('img[alt="API Agent 0"]')).not.toBeNull();
    const all = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === "Xem tất cả",
    )!;
    act(() => all.click());
    expect(host.querySelectorAll('a[href^="/tai-khoan-ai/goi/"]')).toHaveLength(
      18,
    );
    expect(host.querySelector('img[alt="API Agent 17"]')).not.toBeNull();
    expect(
      host.querySelector('a[href="/tai-khoan-ai/goi/live-agent-17"]'),
    ).not.toBeNull();
  } finally {
    AbortSignal.timeout = saved;
  }
});
test("API rejection shows retry and does not render the previous mock catalog", async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValue({
      ok: false,
      json: async () => ({ code: "AI_CATALOG_ACCESS" }),
    });
  const saved = AbortSignal.timeout;
  AbortSignal.timeout = () => new AbortController().signal;
  try {
    await render();
    expect(host.querySelector('[role="alert"]')?.textContent).toContain(
      "Publishable API key",
    );
    expect(host.querySelectorAll('a[href^="/tai-khoan-ai/goi/"]')).toHaveLength(
      0,
    );
    expect(
      [...host.querySelectorAll("button")].some(
        (b) => b.textContent === "Thử lại",
      ),
    ).toBe(true);
  } finally {
    AbortSignal.timeout = saved;
  }
});

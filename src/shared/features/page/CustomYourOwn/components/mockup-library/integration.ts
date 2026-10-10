export const PLACEIT_URL = "https://placeit.net/mockups/print-on-demand";
export const LOAD_TIMEOUT_MS = 15000;

export type IntegrationConfig =
  | { mode: "disabled"; reason: string }
  | { mode: "authorized-proxy"; url: string; origin: string };

// Public build-time flags contain no credentials. Operators must verify partner
// permission and complete the security audit before enabling an approved gateway.
export function resolveIntegration(
  mode?: string,
  permission?: string,
  gateway?: string,
  parentOrigin?: string,
): IntegrationConfig {
  if (!mode || mode === "disabled") {
    return {
      mode: "disabled",
      reason:
        "Placeit does not currently allow this library to be embedded. An approved integration is required before it can appear here.",
    };
  }
  if (mode === "direct-iframe") {
    return {
      mode: "disabled",
      reason:
        "Placeit blocks direct embedding with X-Frame-Options: DENY and CSP frame-ancestors 'none'.",
    };
  }
  if (mode !== "authorized-proxy" || permission !== "true") {
    return {
      mode: "disabled",
      reason:
        "The mockup library has not been enabled with verified integration permission.",
    };
  }
  try {
    const url = new URL(gateway ?? "");
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.origin === parentOrigin ||
      !parentOrigin
    ) {
      throw new Error("Invalid gateway");
    }
    return { mode: "authorized-proxy", url: url.href, origin: url.origin };
  } catch {
    return {
      mode: "disabled",
      reason:
        "The approved mockup library endpoint is unavailable. Please contact support.",
    };
  }
}

export function isLibraryMessage(
  event: MessageEvent,
  source: Window | null,
  origin: string,
): boolean {
  return (
    source !== null &&
    event.source === source &&
    event.origin === origin &&
    event.data?.type === "printerval:mockup-library" &&
    ["ready", "empty", "error"].includes(event.data?.status)
  );
}

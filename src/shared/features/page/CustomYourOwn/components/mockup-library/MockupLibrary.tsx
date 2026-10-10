"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, ImageIcon, RotateCw } from "lucide-react";
import {
  isLibraryMessage,
  LOAD_TIMEOUT_MS,
  PLACEIT_URL,
  resolveIntegration,
  type IntegrationConfig,
} from "./integration";
import styles from "./MockupLibrary.module.css";

type Status = "loading" | "ready" | "empty" | "error" | "timeout";

export function MockupLibrary() {
  const [attempt, setAttempt] = useState(0);
  const [config, setConfig] = useState<IntegrationConfig | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const frameRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setConfig(
      resolveIntegration(
        process.env.NEXT_PUBLIC_MOCKUP_LIBRARY_MODE,
        process.env.NEXT_PUBLIC_MOCKUP_LIBRARY_PERMISSION_VERIFIED,
        process.env.NEXT_PUBLIC_MOCKUP_LIBRARY_GATEWAY_URL,
        window.location.origin,
      ),
    );
  }, [attempt]);

  const url = config?.mode === "authorized-proxy" ? config.url : undefined;
  const origin =
    config?.mode === "authorized-proxy" ? config.origin : undefined;
  useEffect(() => {
    if (!url || !origin) return;
    setStatus("loading");
    const timer = window.setTimeout(
      () => setStatus("timeout"),
      LOAD_TIMEOUT_MS,
    );
    timerRef.current = timer;
    const onMessage = (event: MessageEvent) => {
      if (
        !isLibraryMessage(
          event,
          frameRef.current?.contentWindow ?? null,
          origin,
        )
      )
        return;
      window.clearTimeout(timer);
      setStatus(event.data.status);
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("message", onMessage);
    };
  }, [url, origin, attempt]);

  const retry = () => {
    setStatus("loading");
    setAttempt((value) => value + 1);
  };
  const blocked = config?.mode === "disabled";
  const failed = status === "error" || status === "timeout";
  const loading = !config || (!blocked && status === "loading");

  return (
    <section
      className={styles.library}
      aria-label="Placeit mockup library"
      aria-busy={loading}
    >
      {url && !failed && status !== "empty" && (
        <iframe
          key={attempt}
          ref={frameRef}
          src={url}
          title="Placeit mockup library"
          className={styles.frame}
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin"
          onError={() => {
            window.clearTimeout(timerRef.current);
            setStatus("error");
          }}
        />
      )}
      {loading && (
        <div className={styles.loading} role="status">
          <div className={styles.skeleton} aria-hidden="true" />
          <p>Loading mockup library…</p>
        </div>
      )}
      {(blocked || failed || status === "empty") && (
        <div className={styles.state} role={failed ? "alert" : "status"}>
          <span className={styles.icon}>
            <ImageIcon size={32} aria-hidden="true" />
          </span>
          <h3>
            {blocked
              ? "Mockup library unavailable"
              : status === "timeout"
                ? "The library took too long to respond"
                : status === "empty"
                  ? "No mockups found"
                  : "Unable to load the mockup library"}
          </h3>
          <p>
            {blocked
              ? config.reason
              : status === "timeout"
                ? "The library could not confirm it was ready. Your connection or the source’s embedding policy may be preventing access."
                : status === "empty"
                  ? "The source returned no results. Try loading the library again."
                  : "The source could not load this library. Please try again later."}
          </p>
          {blocked && (
            <p className={styles.note}>
              No live Placeit templates are displayed here. Your canvas is
              preserved.
            </p>
          )}
          <div className={styles.actions}>
            <button type="button" onClick={retry}>
              <RotateCw size={16} aria-hidden="true" />
              Try again
            </button>
            <a href={PLACEIT_URL} target="_blank" rel="noopener noreferrer">
              Visit Placeit
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

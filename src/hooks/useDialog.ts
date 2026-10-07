import { useEffect, useRef, type RefObject } from "react";

// Shared by the mobile drawer and dialogs. Preserve both scroll position and prior inline styles.
export function useDialog(
  open: boolean,
  onClose: () => void,
  panelRef: RefObject<HTMLElement | null>,
  returnFocusRef?: RefObject<HTMLElement | null>,
) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const html = document.documentElement;
    const root = document.getElementById("root");
    const previousFocus =
      returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
      inert: root?.inert ?? false,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    if (root) root.inert = true;

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),iframe,[tabindex="0"]',
        ) ?? [],
      ).filter(
        (el) => el.getClientRects().length > 0 && !el.closest("[inert]"),
      );
    const frame = requestAnimationFrame(() =>
      (focusables()[0] ?? panelRef.current)?.focus(),
    );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key !== "Tab") return;
      const elements = focusables(),
        first = elements[0],
        last = elements[elements.length - 1];
      if (!first) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !panelRef.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !panelRef.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      html.style.overflow = previous.htmlOverflow;
      if (root) root.inert = previous.inert;
      window.scrollTo({ top: scrollY, behavior: "instant" });
      // Wait for the card's blur update to finish before selecting its visible face.
      requestAnimationFrame(() => {
        if (root?.inert) return; // Another dialog has taken over.
        const focusTarget = previousFocus?.closest("[inert]")
          ? Array.from(
              previousFocus
                .closest("[data-service-card]")
                ?.querySelectorAll<HTMLElement>("button") ?? [],
            ).find((element) => !element.closest("[inert]"))
          : previousFocus;
        if (focusTarget?.isConnected && !focusTarget.closest("[inert]"))
          focusTarget.focus({ preventScroll: true });
      });
    };
  }, [open, panelRef, returnFocusRef]);
}

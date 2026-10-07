import { useEffect, useRef } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useTheme } from "../context/ThemeContext";
import { createCalDestination } from "../lib/acquisition";

const namespace = "seekursor-discovery";
export default function BookingEmbed({ destination }: {
  destination: NonNullable<ReturnType<typeof createCalDestination>>;
}) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const frameTitle = (destination.config.iframeAttrs as Record<string, string>).title;
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // This provider version accepts iframeAttrs but only applies its id.
    // Label our embedded frame without touching the provider's form content.
    const labelFrame = () => {
      const frame = container.querySelector("iframe");
      if (frame) frame.title = frameTitle;
    };
    labelFrame();
    const observer = new MutationObserver(labelFrame);
    observer.observe(container, {childList: true, subtree: true});
    return () => observer.disconnect();
  }, [frameTitle]);
  useEffect(() => {
    let active = true;
    void getCalApi({ namespace }).then(cal => {
      if (active) cal("ui", { theme, layout: "month_view", hideEventTypeDetails: false, styles: { branding: { brandColor: "#2563EB" } } });
    });
    return () => { active = false; };
  }, [theme]);
  return <div ref={containerRef} className="h-full min-h-full"><Cal namespace={namespace} calLink={destination.calLink} calOrigin="https://cal.com"
    config={destination.config} style={{ width: "100%", minHeight: "100%", overflow: "auto" }} /></div>;
}

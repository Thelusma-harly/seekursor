"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { BrandLockup } from "../BrandLockup";

function StaticRing() {
  return (
    <div className="static-corolla">
      {Array.from({ length: 19 }, (_, index) => (
        <span
          key={index}
          style={{
            transform:
              "rotate(" +
              index * (360 / 19) +
              "deg) translateY(-82px) rotateY(38deg)",
          }}
        />
      ))}
    </div>
  );
}
const Corolla = dynamic(() => import("./CorollaGleam"), {
  ssr: false,
  loading: StaticRing,
});
export function HeroSculpture() {
  const [live, setLive] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const update = () => setLive(media.matches && !connection?.saveData);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <div className="hero-sculpture" aria-hidden="true">
      <div className="sculpture-orbit orbit-one" />
      <div className="sculpture-orbit orbit-two" />
      <div className="sculpture-canvas">
        {live ? (
          <Corolla
            background="transparent"
            count={19}
            innerRadius={32}
            scale={85}
            warm="#93C5FD"
            cool="#2563EB"
            hover={35}
            breathe={18}
            speed={22}
            spin={5}
            advanced={{
              pinkColor: "#2563EB",
              deepColor: "#102C6E",
              lightColor: "#DCEBFF",
              tealColor: "#4A83EA",
              hotColor: "#F8FAFC",
              teal: 20,
              wobble: 1,
              sway: 2,
              lightTravel: 35,
            }}
          />
        ) : (
          <StaticRing />
        )}
      </div>
      <div className="sculpture-core">
        <BrandLockup markSize={64} />
      </div>
      <span className="sculpture-cross cross-one">+</span>
      <span className="sculpture-cross cross-two">+</span>
    </div>
  );
}

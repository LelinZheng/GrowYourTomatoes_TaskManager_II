import React, { useMemo, useRef, useEffect, useLayoutEffect, useState } from "react";
import "./garden.css";
import grassImg from "../assets/grass.png";

export default function Garden({ tomatoes, punishments, lastEvent, tomatoToastId }) {
  const fogCount = (punishments ?? []).filter((p) => p.type === "FOG").length;
  const weedCount = (punishments ?? []).filter((p) => p.type === "WEED").length;
  const leavesCount = (punishments ?? []).filter((p) => p.type === "WILTED_LEAVES").length;

  // 5 tomatoes per plant
  const plantCount = Math.ceil(tomatoes / 5);

  const gardenRef = useRef(null);
  const [soilPx, setSoilPx] = useState(0);
  const [showTomatoToast, setShowTomatoToast] = useState(false);
  const [plantScale, setPlantScale] = useState(1);
  const plantsScrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  useLayoutEffect(() => {
    if (!gardenRef.current) return;
  
    const el = gardenRef.current;
  
    const update = () => {
      const rect = el.getBoundingClientRect();
      const h = rect.height;
      const w = rect.width;
  
      setSoilPx(Math.floor(h * 0.25));
  
      // --- responsive plant sizing ---
      // base sizes (match your current plant wrapper)
      const BASE_W = 180;
      const MIN_SCALE = 0.55;         // don't get too tiny
      const SIDE_PADDING = 40;        // breathing room
      const GAP = 24;                 // target spacing between plants
  
      const available = Math.max(0, w - SIDE_PADDING);
      const neededPerPlant = BASE_W + GAP;
      const VISIBLE_PLANTS = Math.min(6, plantCount);
      const raw = available / (VISIBLE_PLANTS * neededPerPlant);
  
      const s = Math.max(MIN_SCALE, Math.min(1, raw));
      setPlantScale(s);
    };
  
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [plantCount]);

  useEffect(() => {
    const el = plantsScrollRef.current;
    if (!el) return;
  
    const update = () => {
      const ms = Math.max(0, el.scrollWidth - el.clientWidth);
      setMaxScroll(ms);
      setScrollLeft(el.scrollLeft);
    };
  
    update();
  
    const ro = new ResizeObserver(update);
    ro.observe(el);
  
    el.addEventListener("scroll", update, { passive: true });
  
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [plantCount, plantScale]);

  useEffect(() => {
    const el = plantsScrollRef.current;
    if (!el) return;
  
    // after DOM lays out
    requestAnimationFrame(() => {
      const ms = Math.max(0, el.scrollWidth - el.clientWidth);
      // default view = newest plants (right side)
      el.scrollLeft = ms;
      setMaxScroll(ms);
      setScrollLeft(ms);
    });
  }, [plantCount]);
  

  const stripOffsets = useMemo(() => {
    const soil = soilPx || 0;
    const maxBottom = Math.max(0, soil * 0.8);
  
    const make = (n) =>
      Array.from({ length: n }).map(() => Math.floor(Math.random() * (maxBottom + 1)));
  
    return {
      weed: make(weedCount),
      leaves: make(leavesCount),
    };
  }, [soilPx, weedCount, leavesCount]);

  const emojiMap = {
    BUG: "🐛",
    FUNGUS: "🍄",
  };

  // Only BUG/FUNGUS are scattered
  const scatteredPunishments = (punishments ?? []).filter(
    (p) => p.type === "BUG" || p.type === "FUNGUS"
  );

  // Leaves: stable random rotations/offsets
  const leafStyles = useMemo(() => {
    return Array.from({ length: 70 }).map(() => {
      const rotate = Math.floor(Math.random() * 181) - 90; // -90..+90 deg
      const y = Math.floor(Math.random() * 8);            // 0..7 px
      const scale = 0.9 + Math.random() * 0.2;            // 0.9..1.1
      const opacity = 0.7 + Math.random() * 0.3;          // 0.7..1.0
      return { rotate, y, scale, opacity };
    });
  }, []);

  // BUG/FUNGUS positions: stable per punishment id
  const posRef = useRef(new Map()); // id -> { x, y }

  useEffect(() => {
    const ids = new Set(scatteredPunishments.map((p) => p.id));
    for (const key of posRef.current.keys()) {
      if (!ids.has(key)) posRef.current.delete(key);
    }
  
    const soil = soilPx || 0;
  
    for (const p of scatteredPunishments) {
      if (!posRef.current.has(p.id)) {
        const x = Math.random() * 90 + 5;

        const maxBottom = Math.max(0, soil * 0.8);
        const y = Math.random() * (maxBottom + 1);
  
        posRef.current.set(p.id, { x, y });
      }
    }
  }, [scatteredPunishments, soilPx]);

  useEffect(() => {
    if (!tomatoToastId) return; // ignore initial 0
    setShowTomatoToast(true);
    const t = setTimeout(() => setShowTomatoToast(false), 900);
    return () => clearTimeout(t);
  }, [tomatoToastId]);
  
  return (
    <div className="garden-container" ref={gardenRef}>
      {showTomatoToast && (
        <div className="garden-toast tomato-toast">+1 🍅</div>
      )}
      {Array.from({ length: fogCount }).map((_, i) => (
        <div
          key={`fog-${i}`}
          className="fog-overlay"
          style={{
            opacity: Math.min(0.75, 0.22 + i * 0.12), // stack intensity
          }}
        />
      ))}
      <div className="plants-scroll" ref={plantsScrollRef}>
        <div className="plants-row">
          {Array.from({ length: plantCount }).map((_, index) => (
            <div
              key={index}
              className="plant-slot"
              style={{ ["--plant-scale" as any]: plantScale }}
            >
              <div className="plant-inner">
              <Plant
              tomatoes={Math.min(5, tomatoes - index * 5)}
              scale={plantScale}
            />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="punishment-layer">
        {/* Weed strip (PNG tile, responsive) */}
        {stripOffsets.weed.map((bottom, i) => (
          <div
            key={`weed-${i}`}
            className="weed-strip-tile"
            aria-hidden="true"
            style={{
              bottom: `${bottom}px`,
              backgroundImage: `url(${grassImg})`,
              opacity: Math.max(0.35, 0.9 - i * 0.15), // optional layering feel
            }}
          />
        ))}

        {/* Leaves strip (emoji carpet) */}
        {stripOffsets.leaves.map((bottom, i) => (
          <div
            key={`leaves-${i}`}
            className="leaves-strip-emoji"
            aria-hidden="true"
            style={{
              bottom: `${bottom}px`,
              opacity: Math.max(0.35, 0.95 - i * 0.15), // optional
            }}
          >
            {leafStyles.map((s, idx) => (
              <span
                key={`${i}-${idx}`}
                className="leaf-emoji"
                style={{
                  transform: `translateY(${s.y}px) rotate(${s.rotate}deg) scale(${s.scale})`,
                  opacity: s.opacity,
                }}
              >
                🍂
              </span>
            ))}
          </div>
        ))}

        {/* Scattered BUG/FUNGUS (stable positions) */}
        {scatteredPunishments.map((p) => {
          const pos = posRef.current.get(p.id) || { x: 50, y: 10 };

          return (
            <div
              key={p.id}
              className={`punishment-emoji ${p.type === "BUG" ? "bug" : ""} ${
                p.type === "FUNGUS" ? "fungus" : ""
              }`}
              style={{
                left: `${pos.x}%`,
                bottom: `${pos.y}px`,
              }}
            >
              {emojiMap[p.type]}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Plant({ tomatoes }: { tomatoes: number }) {
  return (
    <div className="plant-wrapper">
      <div className="leaf leaf-a"></div>
      <div className="leaf leaf-b"></div>
      <div className="leaf leaf-c"></div>
      <div className="stem"></div>

      {Array.from({ length: tomatoes }).map((_, i) => (
        <div key={i} className={`tomato-emoji tomato-${i}`}>
          🍅
        </div>
      ))}
    </div>
  );
}

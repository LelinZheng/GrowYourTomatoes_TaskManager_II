import React, { useMemo, useRef, useEffect, useLayoutEffect, useState } from "react";
import "./garden.css";
import grassImg from "../assets/grass.png";

export default function Garden({ tomatoes, punishments }) {
  const hasFog = punishments?.some((p) => p.type === "FOG");
  const hasWeed = punishments?.some((p) => p.type === "WEED");
  const hasLeaves = punishments?.some((p) => p.type === "WILTED_LEAVES");

  // 5 tomatoes per plant
  const plantCount = Math.ceil(tomatoes / 5);

  const gardenRef = useRef(null);
  const [soilPx, setSoilPx] = useState(0);

  useLayoutEffect(() => {
    if (!gardenRef.current) return;

    const el = gardenRef.current;

    const update = () => {
      const h = el.getBoundingClientRect().height;
      setSoilPx(Math.floor(h * 0.25)); //
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const stripOffsets = useMemo(() => {
    const soil = soilPx || 0;
  
    const weedMax = Math.max(0, soil * 0.8);
    const leavesMax = Math.max(0, soil * 0.8);
  
    const weedBottom = Math.floor(Math.random() * (weedMax + 1));
    const leavesBottom = Math.floor(Math.random() * (leavesMax + 1));
  
    return { weedBottom, leavesBottom };
  }, [hasWeed, hasLeaves, soilPx]);

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
  
  return (
    <div className="garden-container" ref={gardenRef}>
      {hasFog && <div className="fog-overlay"></div>}

      <div className="plants-row">
        {Array.from({ length: plantCount }).map((_, index) => (
          <Plant key={index} tomatoes={Math.min(5, tomatoes - index * 5)} />
        ))}
      </div>

      <div className="punishment-layer">
        {/* Weed strip (PNG tile, responsive) */}
        {hasWeed && (
          <div
            className="weed-strip-tile"
            aria-hidden="true"
            style={{
              bottom: `${stripOffsets.weedBottom}px`,
              backgroundImage: `url(${grassImg})`,
            }}
          />
        )}

        {/* Leaves strip (emoji carpet) */}
        {hasLeaves && (
          <div
            className="leaves-strip-emoji"
            aria-hidden="true"
            style={{ bottom: `${stripOffsets.leavesBottom}px` }}
          >
            {leafStyles.map((s, i) => (
              <span
                key={i}
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
        )}

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

function Plant({ tomatoes }) {
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

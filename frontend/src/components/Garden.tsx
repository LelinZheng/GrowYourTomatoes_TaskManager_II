import React from "react";
import "./garden.css";

export default function Garden({ tomatoes, punishments }) {
  const hasFog = punishments?.some((p) => p.type === "FOG");

  // Calculate number of plants (5 tomatoes per plant)
  const plantCount = Math.ceil(tomatoes / 5);

  // Map punishment type to emoji
  const emojiMap = {
    WEED: "🌾",
    BUG: "🐛",
    FUNGUS: "🍄",
    FOG: "🌫️",
    WILTED_LEAVES: "🍂",
  };

  return (
    <div className="garden-container">
      {/* Fog overlay stays ABOVE everything */}
      {hasFog && <div className="fog-overlay"></div>}

      {/* Plants row */}
      <div className="plants-row">
        {Array.from({ length: plantCount }).map((_, index) => (
          <Plant
            key={index}
            tomatoes={Math.min(5, tomatoes - index * 5)}
          />
        ))}
      </div>

      {/* === RANDOMIZED PUNISHMENTS IN SOIL === */}
      <div className="punishment-layer">
        {punishments
          ?.filter((p) => p.type !== "FOG") // fog is handled separately
          .map((p) => {
            // random X between 5% and 95%
            const randomX = Math.random() * 90 + 5;
            // random Y between 0 and 40px from soil bottom
            const randomY = Math.random() * 40;

            return (
              <div
                key={p.id}
                className="punishment-emoji"
                style={{
                  left: `${randomX}%`,
                  bottom: `${randomY}px`,
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
      {/* Leaves */}
      <div className="leaf leaf-a"></div>
      <div className="leaf leaf-b"></div>
      <div className="leaf leaf-c"></div>

      {/* Stem */}
      <div className="stem"></div>

      {/* Tomatoes as emoji */}
      {Array.from({ length: tomatoes }).map((_, i) => (
        <div key={i} className={`tomato-emoji tomato-${i}`}>
          🍅
        </div>
      ))}
    </div>
  );
}

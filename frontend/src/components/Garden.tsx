import { useEffect, useState } from "react";
import type { Punishment } from "../types/Punishment";
import "./Garden.css";

type GardenEvent =
  | "TOMATO_GAINED"
  | "PUNISHMENT_ADDED"
  | "PUNISHMENT_RESOLVED"
  | null;

interface GardenProps {
  tomatoes: number;
  punishments: Punishment[];
  lastEvent: GardenEvent;
}

function getPunishmentEmoji(type: string): string {
  const normalized = type.toUpperCase();

  if (normalized.includes("FOG")) return "🌫️";
  if (normalized.includes("WEED")) return "🌿";
  if (normalized.includes("BUG") || normalized.includes("INSECT")) return "🐛";
  if (normalized.includes("ROCK") || normalized.includes("STONE")) return "🪨";
  if (normalized.includes("CROW") || normalized.includes("BIRD")) return "🐦";

  return "⚠️"; // fallback
}

export default function Garden({
  tomatoes,
  punishments,
  lastEvent,
}: GardenProps) {
  const [burstKey, setBurstKey] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);

  // Trigger tomato burst animation
  useEffect(() => {
    if (lastEvent === "TOMATO_GAINED") {
      setBurstKey((k) => k + 1);
    } else if (lastEvent === "PUNISHMENT_ADDED") {
      setShakeKey((k) => k + 1);
    }
  }, [lastEvent]);

  const visibleTomatoes = Math.min(tomatoes, 6); // cap for display

  return (
    <div className="garden-card card mt-4 mb-5">
      <div className="card-body">
        <h4 className="card-title mb-3">🌱 Tomato Garden</h4>

        <div className="garden-root">
          {/* Ground */}
          <div className="garden-ground" />

          {/* Plant */}
          <div className="garden-plant">
            <div className="garden-stem" />
            <div className="garden-leaf leaf-left" />
            <div className="garden-leaf leaf-right" />

            {/* Hanging tomatoes */}
            <div className="garden-tomato-row">
              {Array.from({ length: visibleTomatoes }).map((_, idx) => (
                <div key={idx} className="garden-tomato">
                  🍅
                </div>
              ))}
            </div>

            {/* Burst animation layer */}
            <div key={burstKey} className="garden-tomato-burst">
              🍅
            </div>
          </div>

          {/* Punishments field */}
          <div
            key={shakeKey}
            className={`garden-punishments ${
              lastEvent === "PUNISHMENT_ADDED" ? "garden-punishments-shake" : ""
            }`}
          >
            {punishments.length === 0 && (
              <span className="garden-empty-text">No weeds in your garden 🎉</span>
            )}

            {punishments.map((p) => (
              <div key={p.id} className="garden-punishment-chip">
                <span className="garden-punishment-emoji">
                  {getPunishmentEmoji(p.type)}
                </span>
                <span className="garden-punishment-label">
                  {p.type.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <small className="text-muted">
          Completing tasks grows tomatoes 🍅. Overdue tasks spawn punishments 🌫️🌿.
        </small>
      </div>
    </div>
  );
}

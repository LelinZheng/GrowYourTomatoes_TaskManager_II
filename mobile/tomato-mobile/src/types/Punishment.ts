export interface Punishment {
  id: number;
  type: 'FOG' | 'WEED' | 'WILTED_LEAF';
  level: number;
  createdAt: string;
}

export interface PunishmentState {
  fog: number;
  weeds: number;
  wiltedLeaves: number;
}

export interface GardenStats {
  totalTomatoesGrown: number;
  currentTomatoCount: number;
  punishments: PunishmentState;
  lastUpdated: string;
}

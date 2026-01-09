export type PunishmentType = 'FOG' | 'WEEDS' | 'BUG' | 'FUNGUS' | 'WILTED_LEAVES';

export interface Punishment {
  id: number;
  type: PunishmentType;
  createdAt: string;
  resolved?: boolean;
  taskId?: number;
  resolvedByTaskId?: number | null;
}

export interface PunishmentState {
  fog: number;
  weeds: number;
  wiltedLeaves: number;
  bug: number;
  fungus: number;
}

export interface GardenStats {
  totalTomatoesGrown: number;
  currentTomatoCount: number;
  punishments: PunishmentState;
  lastUpdated: string;
}

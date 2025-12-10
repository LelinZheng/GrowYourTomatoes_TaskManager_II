export interface Punishment {
    id: number;
    type: string;        // e.g. "FOG", "WEED", "BUGS", etc.
    createdAt: string;
    resolved: boolean;
    // add other fields if your backend returns them
  }
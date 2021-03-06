interface Summary {
  /** size in bytes */
  size: number;
  /** number of lines. Null if it's not applicable */
  lines: number | null;
}

export interface FileSummary extends Summary {
  /** file name */
  file: string;
}

export interface ExtensionSummary extends Summary {
  /** extension name */
  extension: string;
}

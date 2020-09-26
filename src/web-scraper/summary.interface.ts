export interface Summary {
  size: string;
  lines: number | string;
}

export interface FileSummary extends Summary {
  file: string;
}

export interface ExtensionSummary extends Summary {
  extension: string;
}

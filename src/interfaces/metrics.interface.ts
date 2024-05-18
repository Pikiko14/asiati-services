export enum TypeMetrics {
  META = "meta",
  DROPI = "dropi",
  GOOGLE = "google",
}

export interface MetricsLoadInterface {
  loadMetrics(companyId: string): Promise<void>;
}

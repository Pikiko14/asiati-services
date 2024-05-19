import { Company } from "./companies.interface";

export enum TypeMetrics {
  META = "meta",
  DROPI = "dropi",
  GOOGLE = "google",
}

export interface MetricsLoadInterface {
  loadMetrics(company: Company): Promise<void>;
}

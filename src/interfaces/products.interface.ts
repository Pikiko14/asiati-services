export interface ProductsInterface {
  id?: string;
  _id?: string;
  name: string;
  value: number; 
  stock?: number;
  final_price?: number;
  description?: string;
  is_health_and_wellness?: boolean;
  iva: number;
}

export interface BitrefillPackage {
  id: string;
  value: string;
  price: number;
  amount: number;
}

export interface BitrefillProduct {
  id: string;
  name: string;
  country_code?: string;
  country_name?: string;
  currency?: string;
  categories?: string[];
  created_time?: string;
  recipient_type?: string;
  image?: string;
  in_stock?: boolean;
  packages: BitrefillPackage[];
}

export interface BitrefillMeta {
  start: number;
  limit: number;
  _endpoint: string;
  _next?: string;
}

export interface BitrefillResponse {
  meta: BitrefillMeta;
  data: BitrefillProduct[];
}

export type ProductCategory = 'xbox' | 'playstation' | 'nintendo' | 'steam'; 
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  urlImage?: string | null;
}
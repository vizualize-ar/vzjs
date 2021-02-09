export class Order {
  order_id: string;
  timestamp: number;
  total: number;
  customer?: Customer;
  items?: OrderItem[];
}

export class Customer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  timezone_offset: number;
}

export class OrderItem {
  product_id: string;
  sku: string;
  upc: string;
  name: string;
  price: number;
  description: string;
  images: string[];
}
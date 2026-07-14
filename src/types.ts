export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  originalLink: string;
  description: string;
  image: string;
  specs: { [key: string]: string };
  stock: number;
  observations: string;
}

export interface Review {
  id: string;
  productId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  balance: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PurchaseItem {
  productId: string;
  name: string;
  image: string;
  pricePaid: number;
  quantity: number;
}

export interface Purchase {
  id: string;
  date: string;
  items: PurchaseItem[];
  total: number;
  deliveryDetails: string;
  userId: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  email: string;
  productName: string;
}

export interface InAppNotification {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  message: string;
  date: string;
  read: boolean;
}

export interface SimulatedEmail {
  to: string;
  subject: string;
  body: string;
  date: string;
  productName: string;
  productImage: string;
}


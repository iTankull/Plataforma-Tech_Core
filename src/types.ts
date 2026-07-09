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

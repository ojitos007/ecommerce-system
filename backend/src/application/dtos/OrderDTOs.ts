export interface CreateOrderItemDTO {
  productId: number;
  quantity: number;
}

export interface CreateOrderDTO {
  userId: number;
  items: CreateOrderItemDTO[];
}

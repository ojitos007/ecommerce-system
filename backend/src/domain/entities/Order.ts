export interface OrderItemProps {
  id?: number;
  orderId?: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}

export class OrderItem {
  public id?: number;
  public orderId?: number;
  public productId: number;
  public quantity: number;
  public unitPrice: number;

  constructor(props: OrderItemProps) {
    if (props.quantity <= 0) throw new Error('La cantidad debe ser mayor a 0.');
    this.id = props.id;
    this.orderId = props.orderId;
    this.productId = props.productId;
    this.quantity = props.quantity;
    this.unitPrice = props.unitPrice;
  }

  public getSubtotal(): number {
    return this.quantity * this.unitPrice;
  }
}

export interface OrderProps {
  id?: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  createdAt?: Date;
}

export class Order {
  public id?: number;
  public userId: number;
  public items: OrderItem[];
  public totalAmount: number;
  public status: 'PENDING' | 'PAID' | 'CANCELLED';
  public createdAt?: Date;

  constructor(props: OrderProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.items = props.items;
    this.totalAmount = props.totalAmount;
    this.status = props.status;
    this.createdAt = props.createdAt;
  }

  public static calculateTotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + item.getSubtotal(), 0);
  }
}

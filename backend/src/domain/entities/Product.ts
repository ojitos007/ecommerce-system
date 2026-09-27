export interface ProductProps {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt?: Date;
}

export class Product {
  public id?: number;
  public name: string;
  public description: string;
  public price: number;
  public stock: number;
  public createdAt?: Date;

  constructor(props: ProductProps) {
    if (props.price < 0) throw new Error('El precio no puede ser negativo.');
    if (props.stock < 0) throw new Error('El stock no puede ser negativo.');

    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.stock = props.stock;
    this.createdAt = props.createdAt;
  }

  public hasEnoughStock(quantity: number): boolean {
    return this.stock >= quantity;
  }
}

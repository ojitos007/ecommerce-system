export interface UserProps {
  id?: number;
  name: string;
  email: string;
  passwordHash: string;
  role: 'CLIENT' | 'ADMIN';
  createdAt?: Date;
}

export class User {
  public id?: number;
  public name: string;
  public email: string;
  public passwordHash: string;
  public role: 'CLIENT' | 'ADMIN';
  public createdAt?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.createdAt = props.createdAt;
  }
}

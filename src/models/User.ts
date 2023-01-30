import { Column, Model, Table } from "sequelize-typescript";

@Table
class User extends Model {
  @Column username!: string;

  @Column email!: string;

  @Column password!: string;
}

export default User;

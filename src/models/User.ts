import { Column, DataType, Default, Model, Table } from "sequelize-typescript";

@Table({
  indexes: [{ fields: ["email"], unique: true }],
})
class User extends Model {
  @Column username!: string;

  @Column email!: string;

  @Column password!: string;

  @Default(true) @Column inactive!: boolean;

  @Column({ type: DataType.STRING }) activationToken!: string | null;
}

export default User;

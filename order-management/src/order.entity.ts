
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity()
class Order {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column({ unique: true })
  public name: string;
 
  @Column()
  public customer: string;
}
 
export default Order;
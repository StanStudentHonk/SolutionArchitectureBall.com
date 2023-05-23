
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity()
class Payment {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public customer: string;

  @Column()
  public amount: number;
}
 
export default Payment;
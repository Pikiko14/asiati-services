import { Model } from "mongoose";
import OrdersModel from "../models/orders.model";
import { OrdersInterface } from "../interfaces/orders.interface";

class OrdersRepository {
  private readonly model: Model<OrdersInterface>;

  constructor() {
    this.model = OrdersModel;
  }

  /**
   * Save order in bbdd
   * @param order User
   */
  public async create (order: OrdersInterface): Promise<OrdersInterface> {
    const orderDb = await this.model.create(order);
    return orderDb;
  }

  /**
   * insert Many orders
   * @param order User
   */
  public async insertMany (orders: OrdersInterface[]): Promise<OrdersInterface[]> {
    const ordersDb = await this.model.insertMany(orders);
    return ordersDb;
  }

  /**
   * get order by
   * @param query
   */
  public async getBy(query: any) {
    const orderDb = await this.model.findOne(query);
    return orderDb;
  }
}

export default OrdersRepository;

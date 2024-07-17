import { Model } from "mongoose";
import OrdersModel from "../models/orders.model";
import { OrdersInterface } from "../interfaces/orders.interface";
import { PaginationInterface } from "../interfaces/response.interface";

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

  /**
   * paginate Companys
   * @param page
   * @param perPage
   * @param search
   */
  public async paginate (query: any, skip: number, perPage: number, search: string): Promise<PaginationInterface> {
    const orders = await this.model.find(query)
    .skip(skip)
    .limit(perPage)
    .populate({
      path: 'company',
      select: 'id name'
    })
    const totalOrders = await this.model.find(query).countDocuments();
    return {
      data: orders,
      totalItems: totalOrders
    }
  }
}

export default OrdersRepository;

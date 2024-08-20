import { Model } from "mongoose";
import WalletsModel from "../models/wallets.model";
import { WalletInterface } from "../interfaces/wallet.interface";
import { PaginationInterface } from "../interfaces/response.interface";

class WalletsRepository {
  private readonly model: Model<WalletInterface>;

  constructor() {
    this.model = WalletsModel;
  }

  /**
   * Save order in bbdd
   * @param order User
   */
  public async create (order: WalletInterface): Promise<WalletInterface> {
    const orderDb = await this.model.create(order);
    return orderDb;
  }

  /**
   * insert Many orders
   * @param order User
   */
  public async insertMany (orders: WalletInterface[]): Promise<WalletInterface[]> {
    const ordersDb = await this.model.insertMany(orders);
    return ordersDb;
  }

  /**
   * get order by
   * @param query
   */
  public async getBy(query: any) {
    const orderDb = await this.model.find(query);
    return orderDb;
  }

  /**
   * paginate order
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

  /**
   * Update orders data
   * @param id
   * @param body
   */
  public async update (id: string, body: WalletInterface): Promise<WalletInterface | void | null> {
    return await this.model.findByIdAndUpdate(id, body, { new: true });
  }
}

export default WalletsRepository;

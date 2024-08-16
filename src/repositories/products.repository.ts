import { Model } from "mongoose";
import ProductsModel from "../models/products.model";
import { ProductsInterface } from "../interfaces/products.interface";
import { PaginationInterface } from "../interfaces/response.interface";

class ProductsRepository {
  private readonly model: Model<ProductsInterface>;

  constructor() {
    this.model = ProductsModel;
  }

  /**
   * delete product
   */
  public async deleteProduct(id: string): Promise<ProductsInterface | void | null> {
    return await this.model.findByIdAndDelete(id);
  }

  /**
   * Save product in bbdd
   * @param user User
   */
  public async create (params: ProductsInterface): Promise<ProductsInterface> {
    const product = await this.model.create(params);
    return product;
  }

  /**
   * Update product data
   * @param id
   * @param body
   */
  public async update (id: string, body: ProductsInterface): Promise<ProductsInterface | void | null> {
    return await this.model.findByIdAndUpdate(id, body, { new: true });
  }

  /**
   * paginate products
   * @param page
   * @param perPage
   * @param search
   */
  public async paginate (query: any, skip: number, perPage: number): Promise<PaginationInterface> {
    const products = await this.model.find(query).skip(skip).limit(perPage);
    const totalProducts = await this.model.find(query).countDocuments();
    return {
      data: products,
      totalItems: totalProducts
    }
  }

  /**
   * get user by id
   * @param id
   */
  public async getUserById(id: string): Promise<ProductsInterface | void | null> {
    return this.model.findById(id);
  }

  /**
   * Get all users for select
   */
  public async listSelect (): Promise<ProductsInterface[]> {
    return await this.model.find({}).select("id name last_name");
  }
}

export default ProductsRepository;

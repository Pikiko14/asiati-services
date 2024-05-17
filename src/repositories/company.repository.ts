import { Model } from "mongoose";
import CompaniesModel from "../models/companies.model";
import { Company } from "../interfaces/companies.interface";
import { PaginationInterface } from "../interfaces/response.interface";

class CompaniesRepository {
  private readonly model: Model<Company>;

  constructor() {
    this.model = CompaniesModel;
  }

  /**
   * Get Company by name
   * @param name String
   */
  public async getCompanyByCompanyName(name: string): Promise<Company | void | null> {
    return await this.model.findOne({
      $or: [
        { name: name },
      ]
    });
  }

  /**
   * Get Company by email
   * @param email String
   */
  public async getCompanyByEmail(email: string): Promise<Company | void | null> {
    return await this.model.findOne({ email });
  }

  /**
   * Get Company by email
   * @param token String
   */
  public async getCompanyByToken(token: string): Promise<Company | void | null> {
    return await this.model.findOne({
      $or: [
        { confirmation_token: token },
        { recovery_token: token }
      ]
    });
  }

  /**
   * delete Company
   */
  public async deleteCompanyBd(id: string): Promise<Company | void | null> {
    return await this.model.findByIdAndDelete(id);
  }

  /**
   * Save Company in bbdd
   * @param Company Company
   */
  public async create (company: Company): Promise<Company> {
    const companyBd = await this.model.create(company);
    return companyBd;
  }

  /**
   * Update Company data
   * @param id
   * @param body
   */
  public async update (id: string, body: Company): Promise<Company | void | null> {
    return await this.model.findByIdAndUpdate(id, body, { new: true });
  }

  /**
   * paginate Companys
   * @param page
   * @param perPage
   * @param search
   */
  public async paginate (query: any, skip: number, perPage: number): Promise<PaginationInterface> {
    const companys = await this.model.find(query)
    .skip(skip)
    .limit(perPage)
    .populate('responsable');
    const totalCompanys = await this.model.find(query).countDocuments();
    return {
      data: companys,
      totalItems: totalCompanys
    }
  }

  /**
   * get Company by id
   * @param id
   */
  public async getCompanyById(id: string): Promise<Company | void | null> {
    return this.model.findById(id).populate('responsable');
  }

  /**
   * Get all Companys for select
   */
  public async listSelect (): Promise<Company[]> {
    return await this.model.find({}).select("id name last_name");
  }
}

export default CompaniesRepository;

import { Model } from "mongoose";
import ConfigurationModel from "../models/configuration.model";
import { PaginationInterface } from "../interfaces/response.interface";
import { ConfigurationInterface } from "../interfaces/configuration.interface";

class ConfigurationRepository {
  private readonly model: Model<ConfigurationInterface>;

  constructor() {
    this.model = ConfigurationModel;
  }

  /**
   * delete Configuration
   */
  public async deleteConfigurationBd(id: string): Promise<ConfigurationInterface | void | null> {
    return await this.model.findByIdAndDelete(id);
  }

  /**
   * Save Configuration in bbdd
   * @param Configuration Configuration
   */
  public async create (Configuration: ConfigurationInterface): Promise<ConfigurationInterface> {
    const ConfigurationBd = await this.model.create(Configuration);
    return ConfigurationBd;
  }

  /**
   * Update Configuration data
   * @param id
   * @param body
   */
  public async update (id: string, body: ConfigurationInterface): Promise<ConfigurationInterface | void | null> {
    return await this.model.findByIdAndUpdate(id, body, { new: true });
  }

  /**
   * get Configuration
   * @returns {Primise<ConfigurationInterface | void | null>}
   */
  public async getConfiguration(): Promise<ConfigurationInterface | void | null> {
    return this.model.findOne();
  }
}

export default ConfigurationRepository;

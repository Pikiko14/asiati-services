import * as xlsx from "xlsx";
import { Response } from "express";
import { Utils } from "../utils/utils";
import { TypeOrder } from "../interfaces/orders.interface";
import { ResponseHandler } from "../utils/responseHandler";
import WalletsRepository from "../repositories/wallets.repository";
import { WalletInterface, WalletTypeMovement } from "../interfaces/wallet.interface";
import { PaginationInterface, ResponseRequestInterface } from "../interfaces/response.interface";

export class WalletsService extends WalletsRepository {
  utils: Utils;
  walletsData: WalletInterface[];
  walletsDataUpdate: WalletInterface[];

  constructor() {
    super();
    this.walletsData = [];
    this.walletsDataUpdate = [];
    this.utils = new Utils();
  }

  /**
   * import orders from excel
   * import { Response } from 'express';
   * @param { Response } res
   * @param file
   */
  public async importOrdersFromExcel(res: Response, file: any, body: any): Promise<ResponseRequestInterface | void> {
    try {
      // setImmediate(() => {
      // });
      await this.processFile(file.buffer, body.type, body.company);
  
      let ordersBd: WalletInterface[] = []
      if (this.walletsData.length > 0) {
        ordersBd = await this.insertMany(this.walletsData);
        this.clearWalletsData();
      }

      // process response
      ResponseHandler.successResponse(
        res,
        ordersBd,
        "Se ha iniciado el proceso de importación de wallets correctamente."
      );
    } catch (error: any) {
      throw new Error(error.message ?? error);
    }
  }

  /**
   * Process excel file
   * @param buffer
   */
  private async processFile(buffer: Buffer, typeOrder: TypeOrder, companyId: string) {
    try {
      return new Promise(async (resolve, reject) => {
        // Process file using xlsx
        const workbook = xlsx.read(buffer, { type: "buffer", cellDates: true,
          cellNF: false,
          cellText: false });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        Object.keys(sheet).forEach(function(s) {
          if(sheet[s].w) {
              delete sheet[s].w;
              sheet[s].z = '0';
          }
      });
        const jsonData = xlsx.utils.sheet_to_json(sheet, { raw: true });

        // Convert date serial numbers to actual dates
        const processedData = jsonData.map((row: any) => {
          return row;
        });
        // Save orders (you can replace this with your actual save logic)
        try {
          await this.prepareOrderData(processedData, typeOrder, companyId);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      })
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Save data on bbdd
   * @param orders
   */
  private async prepareOrderData(orders: any[], typeOrder: TypeOrder, companyId: string) {
    return new Promise(async (resolve, reject) => {
      // Implement your logic to save orders
      let i = 2;
      for (const order of orders) {
        // do some validations 
        if (!order['HISTORIAL DE CARTERA']) {
          this.clearWalletsData();
          reject(`Debes ingresar el ID del movimiento en la linea ${i}`);
        }

        if (!order['FECHA']) {
            this.clearWalletsData();
          reject(`Debes ingresar la FECHA del movimiento en la linea ${i}`);
        }

        if (!order['TIPO']) {
          this.clearWalletsData();
          reject(`Debes ingresar el TIPO de movimiento en la linea ${i}`);
        }

        if (!order['MONTO']) {
          this.clearWalletsData();
          reject(`Debes ingresar el MONTO del movimiento en la linea ${i}`);
        }

        if (!order['MONTO PREVIO']) {
          this.clearWalletsData();
          reject(`Debes ingresar el MONTO PREVIO del movimiento en la linea ${i}`);
        }

        if (!order['DESCRIPCIÓN']) {
          this.clearWalletsData();
          reject(`Debes ingresar la DESCRIPCION del movimiento en la linea ${i}`);
        }

        // prepare total
        const totalMovement = order["MONTO"] ? order["MONTO"] : 0;

        //// set wallet object
        const object: WalletInterface = {
          external_id: order["HISTORIAL DE CARTERA"] ?? null,
          amount: totalMovement,
          type_order: typeOrder,
          company: companyId,
          description: order["DESCRIPCIION"] ?? null,
          guide_number: order["NÚMERO DE GUIA"] ?? null,
          order_id: order["ORDEN ID"] ?? null,
          date: order["FECHA"] ? await this.utils.formatDateIso(order["FECHA"]) : null,
          preview_amount: order["MONTO PREVIO"] ? order["MONTO PREVIO"] : 0,
          type: order["TIPO"] === "SALIDA" ? WalletTypeMovement.DEBIT : WalletTypeMovement.CREDIT
        };

        //// validete isset wallet
        const issetWalletMovement = await this.getBy({ external_id: object.external_id }) as any;
        if (issetWalletMovement && issetWalletMovement.length > 0) {
          for (const order of issetWalletMovement) {
            await this.update(order._id as string, object);
          }
        } else {
          if (object['external_id']) {
            this.walletsData.push(object);
          }
        }
        i++;
      }
      resolve(true);
    })
  }

  /**
   * liat orders
   * @param res Express res
   */
  public async listOrders (
    res: Response,
    page: number,
    perPage: number,
    search: string
  ): Promise<void | ResponseRequestInterface> {
    try {
      // get pagination data
      page = page || 1;
      perPage = perPage || 12;
      const skip = (page - 1) * perPage;

      // init search quert
      let query: any = {};
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query = {
          $or: [
            { external_id: searchRegex },
            { date_order: searchRegex },
            { phone: searchRegex },
            { guide_number: searchRegex },
            { guide_status: searchRegex },
            { province: searchRegex },
            { city: searchRegex },
            { order_notes: searchRegex },
            { order_conveyor: searchRegex },
            { total_order: searchRegex },
            { order_profit: searchRegex },
            { freight_price: searchRegex },
            { return_freight_cost: searchRegex },
            { products: searchRegex },
            { type_order: searchRegex },
          ],
        };
      }

      
      // do query
      const orders: PaginationInterface = await this.paginate(query, skip, perPage, search);

      // process response
      ResponseHandler.successResponse(
        res,
        {
          companies: orders.data,
          totalItems: orders.totalItems
        },
        "Listado de ordenes."
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * clear order data
   */
  public clearWalletsData() {
    this.walletsData = [];
  }
}

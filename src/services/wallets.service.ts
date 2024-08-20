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
   * import wallets from excel
   * import { Response } from 'express';
   * @param { Response } res
   * @param file
   */
  public async importWalletsFromExcel(res: Response, file: any, body: any): Promise<ResponseRequestInterface | void> {
    try {
      // setImmediate(() => {
      // });
      await this.processFile(file.buffer, body.type, body.company);
  
      let walletsBd: WalletInterface[] = []
      if (this.walletsData.length > 0) {
        walletsBd = await this.insertMany(this.walletsData);
        this.clearWalletsData();
      }

      // process response
      ResponseHandler.successResponse(
        res,
        walletsBd,
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
        // Save wallet (you can replace this with your actual save logic)
        try {
          await this.prepareWalletsData(processedData, typeOrder, companyId);
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
   * @param wallets
   */
  private async prepareWalletsData(wallets: any[], typeOrder: TypeOrder, companyId: string) {
    return new Promise(async (resolve, reject) => {
      // Implement your logic to save orders
      let i = 2;
      for (const wallet of wallets) {
        // do some validations 
        if (!wallet['HISTORIAL DE CARTERA']) {
          this.clearWalletsData();
          reject(`Debes ingresar el ID del movimiento en la linea ${i}`);
        }

        if (!wallet['FECHA']) {
            this.clearWalletsData();
          reject(`Debes ingresar la FECHA del movimiento en la linea ${i}`);
        }

        if (!wallet['TIPO']) {
          this.clearWalletsData();
          reject(`Debes ingresar el TIPO de movimiento en la linea ${i}`);
        }

        if (!wallet['MONTO']) {
          this.clearWalletsData();
          reject(`Debes ingresar el MONTO del movimiento en la linea ${i}`);
        }

        if (!wallet['MONTO PREVIO']) {
          this.clearWalletsData();
          reject(`Debes ingresar el MONTO PREVIO del movimiento en la linea ${i}`);
        }

        if (!wallet['DESCRIPCIÓN']) {
          this.clearWalletsData();
          reject(`Debes ingresar la DESCRIPCION del movimiento en la linea ${i}`);
        }

        // prepare total
        const totalMovement = wallet["MONTO"] ? wallet["MONTO"] : 0;

        //// set wallet object
        const object: WalletInterface = {
          external_id: wallet["HISTORIAL DE CARTERA"] ?? null,
          amount: totalMovement,
          type_order: typeOrder,
          company: companyId,
          description: wallet["DESCRIPCIÓN"] ?? null,
          guide_number: wallet["NÚMERO DE GUIA"] ?? null,
          order_id: wallet["ORDEN ID"] ?? null,
          date: wallet["FECHA"] ? await this.utils.formatDateIso(wallet["FECHA"]) : null,
          preview_amount: wallet["MONTO PREVIO"] ? wallet["MONTO PREVIO"] : 0,
          type: wallet["TIPO"] === "SALIDA" ? WalletTypeMovement.DEBIT : WalletTypeMovement.CREDIT
        };

        //// validete isset wallet
        const issetWalletMovement = await this.getBy({ external_id: object.external_id }) as any;
        if (issetWalletMovement && issetWalletMovement.length > 0) {
          for (const wallet of issetWalletMovement) {
            await this.update(wallet._id as string, object);
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
   * liat wallets
   * @param res Express res
   */
  public async listWallets (
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
            { type_order: searchRegex },
            { description: searchRegex },
            { guide_number: searchRegex },
            { order_id: searchRegex },
            { type: searchRegex },
          ],
        };
      }

      
      // do query
      const wallets: PaginationInterface = await this.paginate(query, skip, perPage, search);

      // process response
      ResponseHandler.successResponse(
        res,
        {
          wallets: wallets.data,
          totalItems: wallets.totalItems
        },
        "Listado de wallets."
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * clear wallets data
   */
  public clearWalletsData() {
    this.walletsData = [];
  }
}

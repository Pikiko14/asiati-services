import * as xlsx from "xlsx";
import { Response } from "express";
import { Utils } from "../utils/utils";
import { ResponseHandler } from "../utils/responseHandler";
import OrdersRepository from "../repositories/orders.repository";
import { OrdersInterface, TypeOrder } from "../interfaces/orders.interface";
import { ResponseRequestInterface } from "../interfaces/response.interface";

export class OrdersService extends OrdersRepository {
  ordersData: OrdersInterface[];
  utils: Utils;

  constructor() {
    super();
    this.ordersData = [];
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
      await this.processFile(file.buffer, body.type, body.company);
      // });
  
      let ordersBd: OrdersInterface[] = []
      if (this.ordersData.length > 0) {
        ordersBd = await this.insertMany(this.ordersData);
        this.ordersData = [];
      }

      // process response
      ResponseHandler.successResponse(
        res,
        ordersBd,
        "Se ha iniciado el proceso de importación de ordenes correctamente."
      );
    } catch (error: any) {
      throw new Error(error.message);
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
        const workbook = xlsx.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet, { raw: false });

        // Convert date serial numbers to actual dates
        const processedData = jsonData.map((row: any) => {
          Object.keys(row).forEach((key) => {
            if (
              typeof row[key] === "number" &&
              key.toLowerCase().includes("fecha")
            ) {
              row[key] = this.utils.excelDateToJSDate(row[key]);
            }
          });
          return row;
        });
        // Save orders (you can replace this with your actual save logic)
        await this.prepareOrderData(processedData, typeOrder, companyId);
        resolve(true);
      })
    } catch (error: any) {
      console.error("Error processing file:", error.message);
    }
  }

  /**
   * Save data on bbdd
   * @param orders
   */
  private async prepareOrderData(orders: any[], typeOrder: TypeOrder, companyId: string) {
    return new Promise(async (resolve, reject) => {
      // Implement your logic to save orders
      for (const order of orders) {
        // validete isset orders
        const issetOrder = await this.getBy({ external_id: order["ID"] });
        if (issetOrder) {
          continue;
        }

        // prepare total
        const totalOrder = order["TOTAL_DE_LA_ORDEN"] ? order["TOTAL_DE_LA_ORDEN"].replace(/\,/g, "") : 0;
        const profit = order["GANANCIA"] ? order["GANANCIA"].replace(/\,/g, "") : 0;
        const freight = order["PRECIO_FLETE"] ? order["PRECIO_FLETE"].replace(/\,/g, "") : 0;
        const returnFreight =order["COSTO_DEVOLUCION_FLETE"] ? order["COSTO_DEVOLUCION_FLETE"].replace(/\,/g, "") : 0;

        // set order object
        const object: OrdersInterface = {
          external_id: order["ID"],
          date_order: order["FECHA"],
          phone: order["TELÉFONO"],
          guide_number: order["NÚMERO GUIA"] ? `${order["NÚMERO GUIA"]}` : '-',
          guide_status: order["ESTATUS"],
          province: order["DEPARTAMENTO_DESTINO"],
          city: order["CIUDAD_DESTINO"],
          order_notes: order["NOTAS"] ?? null,
          order_conveyor: order["TRANSPORTADORA"] ?? null,
          total_order: parseFloat(totalOrder),
          order_profit: parseFloat(profit ?? 0),
          freight_price: parseFloat(freight ?? 0),
          return_freight_cost: parseFloat(returnFreight ?? 0),
          products: order["PRODUCTO"] ?? null,
          quantity: order["CANTIDAD"] ?? null,
          type_order: typeOrder ?? null,
          company_id: companyId
        };
        this.ordersData.push(object);
      }
      resolve(true);
    })
  }

  /**
   * liat orders
   * @param res Express res
   */
  listOrders = async (
    res: Response,
    page: number,
    perPage: number,
    search: string
  ): Promise<void | ResponseRequestInterface> => {
    try {

      // process response
      ResponseHandler.successResponse(
        res,
        1,
        "Se ha iniciado el proceso de importación de ordenes correctamente."
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

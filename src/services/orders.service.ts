import * as xlsx from "xlsx";
import { Response } from "express";
import { Utils } from "../utils/utils";
import { ResponseHandler } from "../utils/responseHandler";
import OrdersRepository from "../repositories/orders.repository";
import { OrderMetricsInterface, OrdersInterface, TypeOrder } from "../interfaces/orders.interface";
import { PaginationInterface, ResponseRequestInterface } from "../interfaces/response.interface";

export class OrdersService extends OrdersRepository {
  utils: Utils;
  ordersData: OrdersInterface[];
  ordersDataUpdate: OrdersInterface[];

  constructor() {
    super();
    this.ordersData = [];
    this.ordersDataUpdate = [];
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
  
      let ordersBd: OrdersInterface[] = []
      if (this.ordersData.length > 0) {
        ordersBd = await this.insertMany(this.ordersData);
        this.clearOrdersData();
      }

      // process response
      ResponseHandler.successResponse(
        res,
        ordersBd,
        "Se ha iniciado el proceso de importación de ordenes correctamente."
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
        if (!order['ID']) {
          this.clearOrdersData();
          reject(`Debes ingresar el ID en la linea ${i}`);
        }

        if (!order['FECHA']) {
          reject(`Debes ingresar la FECHA en la linea ${i}`);
        }

        if (!order['TELÉFONO']) {
          this.clearOrdersData();
          reject(`Debes ingresar el TELÉFONO en la linea ${i}`);
        }

        if (!order['ESTATUS']) {
          this.clearOrdersData();
          reject(`Debes ingresar el ESTATUS en la linea ${i}`);
        }

        if (!order['DEPARTAMENTO_DESTINO']) {
          this.clearOrdersData();
          reject(`Debes ingresar el DEPARTAMENTO_DESTINO en la linea ${i}`);
        }

        if (!order['CIUDAD_DESTINO']) {
          this.clearOrdersData();
          reject(`Debes ingresar la CIUDAD_DESTINO en la linea ${i}`);
        }

        if (!order['TRANSPORTADORA']) {
          this.clearOrdersData();
          reject(`Debes ingresar la TRANSPORTADORA en la linea ${i}`);
        }

        if (!order['TOTAL_DE_LA_ORDEN']) {
          this.clearOrdersData();
          reject(`Debes ingresar el TOTAL_DE_LA_ORDEN en la linea ${i}`);
        }

        if (!order['PRODUCTO']) {
          this.clearOrdersData();
          reject(`Debes ingresar el PRODUCTO en la linea ${i}`);
        }

        if (!order['CANTIDAD']) {
          this.clearOrdersData();
          reject(`Debes ingresar la CANTIDAD en la linea ${i}`);
        }

        // prepare total
        const totalOrder = order["TOTAL_DE_LA_ORDEN"] ? order["TOTAL_DE_LA_ORDEN"] : 0;
        const profit = order["GANANCIA"] ? order["GANANCIA"] : 0;
        const freight = order["PRECIO_FLETE"] ? order["PRECIO_FLETE"] : 0;
        const returnFreight =order["COSTO_DEVOLUCION_FLETE"] ? order["COSTO_DEVOLUCION_FLETE"] : 0;

        // set order object
        const object: OrdersInterface = {
          external_id: order["ID"] ?? order['id'],
          date_order: await this.utils.formatDateIso(order["FECHA"]),
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
          company: companyId
        };
        // validete isset orders
        const issetOrder = await this.getBy({ external_id: order["ID"] }) as any;
        if (issetOrder && issetOrder.length > 0) {
          for (const order of issetOrder) {
            await this.update(order._id as string, object);
          }
        } else {
          if (object['external_id']) {
            this.ordersData.push(object);
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
   * list order metric
   * @param { string } company
   */
  public async loadMetrics(company: string, from: string, to: string): Promise<OrderMetricsInterface> {
    try {
      // filter data by order and company and date from and to
      const query = {
        company,
        date_order: {}
      }
      if (from && to) {
        query.date_order = { $gte: await this.utils.formatDateIso(from), $lte: await this.utils.formatDateIso(to) };
      }
      const orders: OrdersInterface[] = await this.getBy(query);

      // ini calculation
      let totalFreight = 0;
      let returnedFreight = 0;
      let totalOrderDropi = 0;
      let totalCancelDropi = 0;
      let totalRejectedDropi = 0;
      let ordersPendingDropi = 0;
      let orderDeliveredDropi= 0;
      let ordersGenerateDropi = 0;
      let ordersReturnedDropi = 0;
      let totalCollectionDropi = 0;
      let totalHealthWellbeing = 0;
      let totalFreightDelivered = 0;
      let totalOrdersDeliveredDropi = 0;
      let ordersPendingConfirmationDropi = 0;

      const isProccesExternalId: string[] = []

      for (const order of orders) {
        // validate if is in array
        const isInArray = isProccesExternalId.includes(order.external_id as string);

        // set collection and total deliverid
        if (!isInArray && order.guide_status === 'ENTREGADO') {
          totalCollectionDropi += parseInt(order.total_order as string);
          orderDeliveredDropi++;
          totalOrdersDeliveredDropi+= parseInt(order.total_order as string);
          totalFreightDelivered+= parseInt(order.freight_price as string);
        }

        // set count of devolution orders
        if (!isInArray && order.guide_status === 'DEVOLUCION') {
          ordersReturnedDropi++;
        }

        // get freight from order in devolution
        if(order.guide_status === 'DEVOLUCION') {
          returnedFreight+= parseInt(order.freight_price as string);
        }

        // set count of pending orders
        if (!isInArray && order.guide_status === 'PENDIENTE') ordersPendingDropi++;

        // set count of pending confirmation orders
        if (!isInArray && order.guide_status === 'PENDIENTE CONFIRMACION') ordersPendingConfirmationDropi++;
        
        // set count of calcelled confirmation orders
        if (!isInArray && order.guide_status === 'CANCELADO') totalCancelDropi++;

        // set count of calcelled confirmation orders
        if (!isInArray && order.guide_status === 'RECHAZADO') totalRejectedDropi++;

        if (
          order.products.includes('Bio') ||
          order.products.includes('Hot') ||
          order.products.includes('Oxi') ||
          order.products.includes('Tribul') ||
          order.products.includes('Voltr') ||
          order.products.includes('Men')
        ) {
          totalHealthWellbeing+= parseInt(order.freight_price as string);
        }

        // set count total orders
        if (!isInArray) {
          ordersGenerateDropi++;
        }

        // set total orders
        totalFreight+= parseInt(order.freight_price as string);
        totalOrderDropi += parseInt(order.total_order as string);

        isProccesExternalId.push(order.external_id as string);
      }

      return {
        totalFreight: totalFreight,
        cancelledDropi: totalCancelDropi,
        rejectedDropi: totalRejectedDropi,
        totalMoneyInDropi: totalOrderDropi,
        returnedFreightDropi: returnedFreight,
        collectionDropi: totalCollectionDropi,
        totalDropiOrders: ordersGenerateDropi,
        pendingDropiOrders: ordersPendingDropi,
        returnedDropiOrders: ordersReturnedDropi,
        deliveredDropiOrders: orderDeliveredDropi,
        totalHealthWellbeing: totalHealthWellbeing,
        totalFreightDelivered: totalFreightDelivered,
        totalOrdersDropiDelivered: totalOrdersDeliveredDropi,
        pendingConfirmationDropiOrders: ordersPendingConfirmationDropi,
        cancelledAndRejectedOrders: totalCancelDropi + totalRejectedDropi,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * clear order data
   */
  public clearOrdersData() {
    this.ordersData = [];
  }
}

import * as xlsx from "xlsx";
import { Response } from "express";
import { Utils } from "../utils/utils";
import { ResponseHandler } from "../utils/responseHandler";
import OrdersRepository from "../repositories/orders.repository";
import WalletsRepository from "../repositories/wallets.repository";
import {
  PaginationInterface,
  ResponseRequestInterface,
} from "../interfaces/response.interface";
import {
  OrderMetricsInterface,
  OrdersInterface,
  TypeOrder,
} from "../interfaces/orders.interface";

export class OrdersService extends OrdersRepository {
  utils: Utils;
  ordersData: OrdersInterface[];
  walletRepository: WalletsRepository;
  ordersDataUpdate: OrdersInterface[];

  constructor() {
    super();
    this.ordersData = [];
    this.utils = new Utils();
    this.ordersDataUpdate = [];
    this.walletRepository = new WalletsRepository();
  }

  /**
   * import orders from excel
   * import { Response } from 'express';
   * @param { Response } res
   * @param file
   */
  public async importOrdersFromExcel(
    res: Response,
    file: any,
    body: any
  ): Promise<ResponseRequestInterface | void> {
    try {
      // setImmediate(() => {
      // });
      await this.processFile(file.buffer, body.type, body.company);

      let ordersBd: OrdersInterface[] = [];
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
      this.clearOrdersData();
      throw new Error(error.message ?? error);
    }
  }

  /**
   * Process excel file
   * @param buffer
   */
  private async processFile(
    buffer: Buffer,
    typeOrder: TypeOrder,
    companyId: string
  ) {
    try {
      return new Promise(async (resolve, reject) => {
        // Process file using xlsx
        const workbook = xlsx.read(buffer, {
          type: "buffer",
          cellDates: true,
          cellNF: false,
          cellText: false,
        });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        Object.keys(sheet).forEach(function (s) {
          if (sheet[s].w) {
            delete sheet[s].w;
            sheet[s].z = "0";
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
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Save data on bbdd
   * @param orders
   */
  private async prepareOrderData(
    orders: any[],
    typeOrder: TypeOrder,
    companyId: string
  ) {
    return new Promise(async (resolve, reject) => {
      // Implement your logic to save orders
      let i = 2;
      // validate orders dropi
      if (typeOrder === TypeOrder.DROPI) {
        for (const order of orders) {
          // do some validations
          if (!order["ID"]) {
            this.clearOrdersData();
            reject(`Debes ingresar el ID en la linea ${i}`);
          }

          if (!order["FECHA"]) {
            this.clearOrdersData();
            reject(`Debes ingresar la FECHA en la linea ${i}`);
          }

          if (!order["TELÉFONO"]) {
            this.clearOrdersData();
            reject(`Debes ingresar el TELÉFONO en la linea ${i}`);
          }

          if (!order["ESTATUS"]) {
            this.clearOrdersData();
            reject(`Debes ingresar el ESTATUS en la linea ${i}`);
          }

          if (!order["DEPARTAMENTO_DESTINO"]) {
            this.clearOrdersData();
            reject(`Debes ingresar el DEPARTAMENTO_DESTINO en la linea ${i}`);
          }

          if (!order["CIUDAD_DESTINO"]) {
            this.clearOrdersData();
            reject(`Debes ingresar la CIUDAD_DESTINO en la linea ${i}`);
          }

          if (!order["TRANSPORTADORA"]) {
            this.clearOrdersData();
            reject(`Debes ingresar la TRANSPORTADORA en la linea ${i}`);
          }

          if (!order["TOTAL_DE_LA_ORDEN"]) {
            this.clearOrdersData();
            reject(`Debes ingresar el TOTAL_DE_LA_ORDEN en la linea ${i}`);
          }

          if (!order["PRODUCTO"]) {
            this.clearOrdersData();
            reject(`Debes ingresar el PRODUCTO en la linea ${i}`);
          }

          if (!order["CANTIDAD"]) {
            this.clearOrdersData();
            reject(`Debes ingresar la CANTIDAD en la linea ${i}`);
          }

          // prepare total
          const totalOrder = order["TOTAL_DE_LA_ORDEN"]
            ? order["TOTAL_DE_LA_ORDEN"]
            : 0;
          const profit = order["GANANCIA"] ? order["GANANCIA"] : 0;
          const freight = order["PRECIO_FLETE"] ? order["PRECIO_FLETE"] : 0;
          const returnFreight = order["COSTO_DEVOLUCION_FLETE"]
            ? order["COSTO_DEVOLUCION_FLETE"]
            : 0;

          // set order object
          const object: OrdersInterface = {
            external_id: order["ID"] ?? order["id"],
            date_order: await this.utils.formatDateIso(order["FECHA"]),
            phone: order["TELÉFONO"],
            guide_number: order["NÚMERO GUIA"] ? `${order["NÚMERO GUIA"]}` : "-",
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
            company: companyId,
          };
          // validete isset orders
          const issetOrder = (await this.getBy({
            external_id: order["ID"],
          })) as any;
          if (issetOrder && issetOrder.length > 0) {
            for (const order of issetOrder) {
              await this.update(order._id as string, object);
            }
          } else {
            if (object["external_id"]) {
              this.ordersData.push(object);
            }
          }
          i++;
        }
      } else {
        for (const order of orders) {
          const totalOrder = order["Valor"]
            ? order["Valor"]
            : 0;
          const dateString = await this.utils.formatDateIso(order["Fecha"]);
          const object: OrdersInterface = {
            date_order: dateString,
            total_order: parseFloat(totalOrder),
            type_order: typeOrder ?? null,
            company: companyId,
            quantity_order: order["Ordenes"] ? parseInt(order["Ordenes"]) : 0,
            external_id: `SHOPIFY_${dateString}`,
          };
          if (object["date_order"]) {
            this.ordersData.push(object);
          }
        }
      }
      resolve(true);
    });
  }

  /**
   * liat orders
   * @param res Express res
   */
  public async listOrders(
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
        const searchRegex = new RegExp(search, "i");
        query = {
          $or: [
            { external_id: searchRegex },
            //{ date_order: searchRegex },
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
      const orders: PaginationInterface = await this.paginate(
        query,
        skip,
        perPage,
        search
      );

      // process response
      ResponseHandler.successResponse(
        res,
        {
          companies: orders.data,
          totalItems: orders.totalItems,
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
  public async loadMetrics(
    company: string,
    from: string,
    to: string
  ): Promise<OrderMetricsInterface> {
    try {
      // filter data by order and company and date from and to
      const query = {
        company,
        type_order: TypeOrder.DROPI,
        date_order: {},
      };
      if (from && to) {
        query.date_order = {
          $gte: await this.utils.formatDateIso(from),
          $lte: await this.utils.formatDateIso(to),
        };
      }
      const orders: OrdersInterface[] = await this.getBy(query); 
      const orderDropiHistorical: OrdersInterface[] = await this.getBy({
        type_order: TypeOrder.DROPI,
        guide_status: { 
          $in: [
            "DEVOLUCION", 
            "DEVOLUCION EN TRANSITO", 
            "DEVUELTA", 
            "RECIBIDO POR DROPI"
          ] 
        }
      });
      const orderDropiCancelled: OrdersInterface[] = await this.getBy({
        type_order: TypeOrder.DROPI,
        guide_status: { 
          $in: [
            "CANCELADO"
          ] 
        }
      });

      // ini calculation
      let guiasAnuladas= 0;
      let totalFreight = 0;
      let returnedFreight = 0;
      let totalOrderDropi = 0;
      let totalCancelDropi = 0;
      let totalRejectedDropi = 0;
      let ordersPendingDropi = 0;
      let orderDeliveredDropi = 0;
      let ordersGenerateDropi = 0;
      let ordersReturnedDropi = 0;
      let totalCollectionDropi = 0;
      let totalHealthWellbeing = 0;
      let totalFreightDelivered = 0;
      let totalOrdersDeliveredDropi = 0;
      let totalHistoricalDevolution = 0;
      let totalHistoricalCancelled = 0;
      let ordersPendingConfirmationDropi = 0;

      const isProccesExternalId: string[] = [];
      const isHistoricalProccessExternalId: string[] = [];

      // order in date
      for (const order of orders) {
        // validate if is in array
        const isInArray = isProccesExternalId.includes(
          order.external_id as string
        );

        // set collection and total deliverid
        if (!isInArray && order.guide_status?.toUpperCase() === "ENTREGADO") {
          orderDeliveredDropi++;
        }

        // sum freight of all orders delivered
        if (order.guide_status?.toUpperCase() === "ENTREGADO") {
          // totalCollectionDropi += parseInt(order.total_order as string);
          totalFreightDelivered += parseInt(order.freight_price as string);
          totalOrdersDeliveredDropi += parseInt(order.total_order as string);
        }

        // set count of devolution orders
        if (
          (!isInArray && order.guide_status?.toUpperCase() === "DEVOLUCION") ||
          (!isInArray &&
            order.guide_status?.toUpperCase() === "DEVOLUCION EN TRANSITO") ||
          (!isInArray && order.guide_status?.toUpperCase() === "DEVUELTA") ||
          (!isInArray &&
            order.guide_status?.toUpperCase() === "RECIBIDO POR DROPI")
        ) {
          ordersReturnedDropi++;
        }

        // get freight from order in devolution
        if (order.guide_status?.toUpperCase() === "DEVOLUCION") {
          returnedFreight += parseInt(order.freight_price as string);
        }

        // set count of pending orders
        if (
          (!isInArray && order.guide_status?.toUpperCase() !== "ENTREGADO") &&
          (!isInArray && order.guide_status?.toUpperCase() !== "DEVOLUCION") &&
          (!isInArray &&
            order.guide_status?.toUpperCase() !== "DEVOLUCION EN TRANSITO") &&
          (!isInArray && order.guide_status?.toUpperCase() !== "DEVUELTA") &&
          (!isInArray &&
            order.guide_status?.toUpperCase() !== "RECIBIDO POR DROPI") &&
          (!isInArray && order.guide_status?.toUpperCase() !== "CANCELADO") &&
          (!isInArray && order.guide_status?.toUpperCase() !== "RECHAZADO") &&
          (!isInArray && order.guide_status?.toUpperCase() !== "GUIA_ANULADA")
        )
          ordersPendingDropi++;

        // set count of pending confirmation orders
        if (
          !isInArray &&
          order.guide_status?.toUpperCase() === "PENDIENTE CONFIRMACION"
        )
          ordersPendingConfirmationDropi++;

        // set count of calcelled confirmation orders
        if (!isInArray && order.guide_status?.toUpperCase() === "CANCELADO" || !isInArray && order.guide_status?.toUpperCase() === "GUIA_ANULADA")
          totalCancelDropi++;

        // set count of calcelled confirmation orders
        if (!isInArray && order.guide_status?.toUpperCase() === "RECHAZADO")
          totalRejectedDropi++;

        if (
          order.products && order.products.includes("Bio") ||
          order.products &&order.products.includes("Hot") ||
          order.products &&order.products.includes("Oxi") ||
          order.products &&order.products.includes("Tribul") ||
          order.products &&order.products.includes("Voltr") ||
          order.products &&order.products.includes("Men")
        ) {
          totalHealthWellbeing += parseInt(order.total_order as string);
        }

        if (order.guide_status?.toUpperCase() === "GUIA_ANULADA") {
          guiasAnuladas += 1;
        }

        // set count total orders
        if (!isInArray) {
          ordersGenerateDropi++;
        }

        // set total orders
        totalFreight += parseInt(order.freight_price as string);
        totalOrderDropi += parseInt(order.total_order as string);

        isProccesExternalId.push(order.external_id as string);
      }

      for (const element of orderDropiCancelled) {
        if (!isHistoricalProccessExternalId.includes(
          element.external_id as string)) {
            totalHistoricalCancelled += 1;
            isHistoricalProccessExternalId.push(element.external_id as string);
        }
      }

      // order historical dropi devolution
      totalHistoricalDevolution = orderDropiHistorical.length;

      // get collection dropi
      const totalCollectionDropiAmount =
        await this.walletRepository.getTotalCollected(query);
      totalCollectionDropi =
        totalCollectionDropiAmount - totalCollectionDropiAmount / 250;
      
      // shopify
      const shopifyData = await this.loadMetricsShopify(company, from, to);

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
        shopify: shopifyData,
        guiasAnuladas,
        totalHistoricalDevolution,
        totalHistoricalCancelled,
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

  /**
   * load shopify metrics
   * @param { string } company
   * 
   */
  public async loadMetricsShopify(
    company: string,
    from: string,
    to: string
  ): Promise<any> {
    try {
      // filter data by order and company and date from and to
      const query = {
        company,
        type_order: TypeOrder.SHOPIFY,
        date_order: {},
      };
      if (from && to) {
        query.date_order = {
          $gte: await this.utils.formatDateIso(from),
          $lte: await this.utils.formatDateIso(to),
        };
      }
      const orders: OrdersInterface[] = await this.getBy(query);

      // prepare data
      let totalShopify = 0;
      let totalOrderShopify = 0;

      orders.map((order: OrdersInterface) => {
        totalShopify += parseFloat(order.total_order as string);
        totalOrderShopify += order.quantity_order ?? 0;
      });

      return {
        totalShopify,
        totalOrderShopify,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

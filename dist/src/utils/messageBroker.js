"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const configuration_1 = __importDefault(require("../../configuration/configuration"));
/**
 * Clase encargada de interactuar con el broker de mensajes RabbitMQ.
 * Ofrece métodos para publicar y consumir mensajes.
 */
class MessageBroker {
    /**
     * Constructor de la clase.
     */
    constructor() {
        this.channel = null;
    }
    /**
     * Conecta al broker de mensajes RabbitMQ.
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Connecting to RabbitMQ...");
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const connection = yield amqplib_1.default.connect(configuration_1.default.get('RABITMQ_URL') || "amqp://localhost");
                    this.channel = yield connection.createChannel();
                    // Configurar parámetros de la cola
                    const queueOptions = {
                        durable: true, // asegurar que la cola sea durable
                        // maxLength: parseInt(configuration.get('MAX_QUEUE_MESSAGES')) || undefined, // límite máximo de mensajes en cola
                        // maxBytes: parseInt(configuration.get('MAX_QUEUE_BYTES')) || undefined, // límite máximo de tamaño de la cola
                        // messageTtl: configuration.get('MESSAGE_TTL') || undefined, // tiempo de expiración de los mensajes
                        // expires: configuration.get('QUEUE_EXPIRATION') || undefined, // tiempo de expiración de la cola
                        // deadLetterExchange: configuration.get('DLX_EXCHANGE') || undefined, // intercambio de cola de errores
                        // deadLetterRoutingKey: configuration.get('DLX_ROUTING_KEY') || undefined, // clave de enrutamiento de cola de errores
                        // más opciones de configuración según sea necesario
                    };
                    yield this.channel.assertQueue(configuration_1.default.get('BROKER_CHANNEL') || "auth", queueOptions);
                    console.log("RabbitMQ connected");
                }
                catch (err) {
                    console.error("Failed to connect to RabbitMQ:", err.message);
                }
            }), 3000); // delay 3 seconds to wait for RabbitMQ to start
        });
    }
    /**
     * Publica un mensaje en el broker de mensajes.
     * @param queue Nombre de la cola donde se publicará el mensaje
     * @param message Contenido del mensaje a publicar
     */
    publishMessage(queue, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                console.error("No RabbitMQ channel available.");
                return;
            }
            try {
                yield this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    /**
     * Consume un mensaje del broker de mensajes.
     * @param queue Nombre de la cola desde donde se consumirá el mensaje
     * @param callback Función a la que se le pasará el contenido del mensaje
     */
    consumeMessage(queue, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                console.error("No RabbitMQ channel available.");
                return;
            }
            try {
                yield this.channel.consume(queue, (message) => {
                    if (message) {
                        const content = message.content.toString();
                        const parsedContent = JSON.parse(content);
                        callback(parsedContent);
                        this.channel.ack(message);
                    }
                });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.default = new MessageBroker(); // Instancia única de la clase

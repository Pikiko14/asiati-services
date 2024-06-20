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
exports.EmailSenderService = void 0;
const fs_1 = __importDefault(require("fs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const configuration_1 = __importDefault(require("../../configuration/configuration"));
/**
 * Clase encargada de enviar mensajes por correo electrónico
 */
class EmailSenderService {
    constructor() {
        // set transporter
        this.transporter = nodemailer_1.default.createTransport({
            service: configuration_1.default.get('EMAIL_PROVIDER') || 'Gmail',
            auth: {
                user: configuration_1.default.get('EMAIL_USER'),
                pass: configuration_1.default.get('EMAIL_PASSWORD'),
            },
        });
        // set message data
        this.messageData = {
            from: configuration_1.default.get('EMAIL_USER'), // Sender
            to: null, // Recipient
            subject: '', // Email subject
            html: '', // Email HTML content
        };
        // set path string
        this.pathTemplates = `${process.cwd()}/src/templates/emails/`;
    }
    /**
     * Envía un mensaje por correo electrónico
     * @param message Contenido del mensaje a enviar
     */
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // set email destination
                this.messageData.to = message.to || message.data.email;
                // set email subject
                this.messageData.subject = message.subject || message.template;
                // set email template
                this.messageData.html = yield this.getTemplate(message.template, message.data);
                // send message
                yield this.transporter.sendMail(this.messageData);
            }
            catch (error) {
                throw new Error(`Failed to send email: ${error.message}`);
            }
        });
    }
    /**
     * get email template
     * @param template
     */
    getTemplate(template, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // load html
                const html = yield fs_1.default.readFileSync(`${this.pathTemplates}${template}.html`);
                // validate some extra features
                if (template === 'welcome') {
                    params.url_confirmation = `${configuration_1.default.get('URL_CONFIRMATION')}/api/v1/auth/confirm`;
                    params.app_url = configuration_1.default.get('APP_URL') || 'https://localhost:8080';
                }
                if (template === 'recovery') {
                    params.url_recovery = configuration_1.default.get('APP_URL') || 'https://localhost:9000';
                }
                // set html content
                let htmlWithContentParse = html.toString();
                Object.keys(params).forEach(variable => {
                    const regex = new RegExp(`{{\\s*${variable}\\s*}}`, 'g');
                    htmlWithContentParse = htmlWithContentParse.replace(regex, params[variable]);
                });
                // return html
                return htmlWithContentParse;
            }
            catch (error) {
                throw new Error(`Failed loading template: ${error.message}`);
            }
        });
    }
}
exports.EmailSenderService = EmailSenderService;

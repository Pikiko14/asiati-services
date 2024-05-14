export enum TypeNotification {
  EMAIL = "email",
  SMS = "sms",
  WHATSAPP = "whatsapp",
}

export interface MessageBrokerInterface {
  data: any;
  type_notification: TypeNotification;
  template: string;
  subject?: string;
  to?: string | null | undefined;
}

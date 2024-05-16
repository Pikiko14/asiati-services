import { ObjectId } from "mongoose";

export interface Company {
    _id?: string;
    id?: string;
    name: string;
    url: string;
    meta_app_secret: string;
    meta_app_identifier: string;
    responsable: string | ObjectId;
}
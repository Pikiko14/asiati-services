import path from 'path';
import multer from 'multer';
import { Utils } from './utils';

const utils = new Utils();
const dirpath = process.cwd();

const storage = multer.memoryStorage();
  
export const upload = multer({ storage: storage });
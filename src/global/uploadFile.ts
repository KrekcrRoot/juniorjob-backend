import { join } from 'path';
import * as fs from 'fs';
const md5 = require('md5');

export function uploadFile(file: Express.Multer.File, storage_folder: string) {

  const fileArr = file.originalname.split('.');
  const type = fileArr[fileArr.length - 1];

  const fileRaw = md5(Date.now().toString()) + '.' + type;
  const filePwd = join(
    storage_folder,
    fileRaw,
  );
  fs.writeFileSync(filePwd, file.buffer);

  return fileRaw;

}
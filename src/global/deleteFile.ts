import * as fs from 'fs';

export function deleteFile(filePath: string) {

  if(fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

}
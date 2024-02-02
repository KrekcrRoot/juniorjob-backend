import { BadRequestException, Injectable, Res, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import type { Response } from 'express';

@Injectable()
export class StorageService {

  
  streamFile(filepath: string, @Res({ passthrough: true }) res: Response) {
    if (!fs.existsSync(filepath)) {
      throw new BadRequestException('File not exist');
    }

    const file = fs.createReadStream(filepath);
    const file_params = filepath.split('.');

    if (file_params[file_params.length - 1] == 'png') {
      res.set({
        'Content-Type': 'image/png',
      });
    } else {
      res.set({
        'Content-Type': 'image/jpeg',
      });
    }

    return new StreamableFile(file);
  }
  
  
}

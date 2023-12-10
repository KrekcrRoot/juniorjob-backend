import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common"
import { fromBuffer } from "file-type"

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File) {
    try {
      const { mime } = await fromBuffer(value.buffer)
      const MIME_TYPES = ["image/jpeg", "image/png"]

      if (!MIME_TYPES.includes(mime)) {
        throw new BadRequestException(
          "The image should be either jpeg or png."
        )
      }
    } catch(error) {
      console.log(error)
      throw new BadRequestException(
        "The image should be either jpeg or png."
      )
    }
    

    return value
  }
}
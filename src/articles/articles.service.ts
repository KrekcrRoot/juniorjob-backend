import { Injectable } from '@nestjs/common';
import { StoreArticleDto } from "./dto/store-article.dto";

@Injectable()
export class ArticlesService {

  async store(storeArticleDto: StoreArticleDto) {

  }

}

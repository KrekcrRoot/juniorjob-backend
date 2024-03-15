import { BadRequestException, Injectable } from "@nestjs/common";
import { StoreArticleDto } from "./dto/store-article.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "./article.entity";
import { Repository } from "typeorm";
import responses from "../global/responses";

@Injectable()
export class ArticlesService {

  constructor(@InjectRepository(Article) private articlesRepository: Repository<Article>) {
  }

  async get(article_uuid: string) {
    return this.articlesRepository.find({
      where: {
        uuid: article_uuid,
        deleted: false,
      },
    });
  }

  async all() {
    return this.articlesRepository.find({
      where: {
        deleted: false,
      },
      select: {
        uuid: true,
        preview: true,
        title: true,
        views: true,
        created_at: true,
        updated_at: true,
      },
    })
  }

  async remove(article_uuid: string) {
    let article = await this.articlesRepository.findOne({
      where: {
        uuid: article_uuid,
        deleted: false,
      },
    });

    if(!article) {
      throw new BadRequestException(responses.doesntExistUUID('Article'))
    }

    article.deleted = true;
    return this.articlesRepository.save(article);
  }

  async uploadPreview(article_uuid: string, preview: string) {
    const article = await this.articlesRepository.findOne({
      where: {
        uuid: article_uuid,
        deleted: false,
      },
    });

    if(!article) {
      throw new BadRequestException(responses.doesntExistUUID('Article'))
    }

    article.preview = preview;
    return this.articlesRepository.save(article);
  }

  async store(storeArticleDto: StoreArticleDto) {
    const article = this.articlesRepository.create({
      title: storeArticleDto.title,
      body: storeArticleDto.body,
    });

    return this.articlesRepository.save(article);
  }

  async edit(article_uuid: string, storeArticleDto: StoreArticleDto) {
    const article = await this.articlesRepository.findOne({
      where: {
        uuid: article_uuid,
        deleted: false,
      },
    });

    if(!article) {
      throw new BadRequestException(responses.doesntExistUUID('Article'))
    }

    article.body = storeArticleDto.body;
    article.title = storeArticleDto.title;

    return this.articlesRepository.save(article);
  }

}

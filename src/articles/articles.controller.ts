import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { UuidArticleDto } from "./dto/uuid-article.dto";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { Roles } from "../roles/roles.decorator";
import { UserRole } from "../roles/role.enum";
import { StoreArticleDto } from "./dto/store-article.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {

  constructor(private articleService: ArticlesService) {
  }

  // @Get(':uuid')
  // get(@Param() params: UuidArticleDto) {
  //   this.articleService.get(params.uuid);
  // }

  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.Moderator)
  @Post('/store')
  store(@Body() storeArticleDto: StoreArticleDto) {
    return this.articleService.store(storeArticleDto);
  }

  // @UseGuards(AccessTokenGuard)
  // @Roles(UserRole.Moderator)
  // @Delete(':uuid')
  // remove(@Param() params: UuidArticleDto) {
  //   return this.articleService.remove(params.uuid);
  // }



}

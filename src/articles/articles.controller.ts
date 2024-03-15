import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post, Put,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { UuidArticleDto } from "./dto/uuid-article.dto";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { Roles } from "../roles/roles.decorator";
import { UserRole } from "../roles/role.enum";
import { StoreArticleDto } from "./dto/store-article.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileTypeValidationPipe } from "../vacancies/vacancies.image.pipe";
import { FileInterceptor } from "@nestjs/platform-express";
import { uploadFile } from "../global/uploadFile";
import { join } from "path";
import { ConfigService } from "@nestjs/config";
import constants from "../global/constants";
import { Article } from "./article.entity";

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {

  constructor(
    private configService: ConfigService,
    private articleService: ArticlesService,
  ) {
  }

  @ApiResponse({
    type: Article,
    isArray: true,
    status: HttpStatus.OK,
    description: 'Get articles',
  })
  @ApiOperation({ summary: 'Get articles' })
  @Get('/all')
  getAll() {
    return this.articleService.all();
  }

  @ApiResponse({
    type: Article,
    isArray: false,
    status: HttpStatus.OK,
    description: 'Get article by uuid',
  })
  @ApiOperation({ summary: 'Get article by uuid' })
  @Get(':uuid')
  get(@Param() params: UuidArticleDto) {
    return this.articleService.get(params.uuid);
  }

  @ApiResponse({
    type: Article,
    isArray: false,
    status: HttpStatus.OK,
    description: 'Store article',
  })
  @ApiOperation({ summary: 'Store article' })
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.Moderator)
  @Post('/store')
  store(@Body() storeArticleDto: StoreArticleDto) {
    return this.articleService.store(storeArticleDto);
  }

  @ApiResponse({
    type: Article,
    isArray: false,
    status: HttpStatus.OK,
    description: 'Delete article',
  })
  @ApiOperation({ summary: 'Delete article' })
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.Moderator)
  @Delete(':uuid')
  remove(@Param() params: UuidArticleDto) {
    return this.articleService.remove(params.uuid);
  }

  @ApiResponse({
    type: Article,
    isArray: false,
    status: HttpStatus.OK,
    description: 'Upload preview article',
  })
  @ApiOperation({ summary: 'Upload preview article' })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.Moderator)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/uploadPreview')
  uploadPreview(
    @UploadedFile(new FileTypeValidationPipe()) file: Express.Multer.File,
    @Body() uuidArticleDto: UuidArticleDto,
  ) {
    const filePwd = uploadFile(file, join(this.configService.get<string>('STORAGE_FOLDER'), constants.articlesFolder));
    return this.articleService.uploadPreview(uuidArticleDto.uuid, filePwd)
  }

  @ApiResponse({
    type: Article,
    isArray: false,
    status: HttpStatus.OK,
    description: 'Upload image for article',
  })
  @ApiOperation({ summary: 'Upload image for article' })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.Moderator)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/uploadImage')
  uploadImage(
    @UploadedFile(new FileTypeValidationPipe()) file: Express.Multer.File,
    ) {
    const filePwd = uploadFile(file, join(this.configService.get<string>('STORAGE_FOLDER'), constants.articlesFolder));
    return {
      src: filePwd,
    }
  }

  @ApiResponse({
    type: Article,
    isArray: false,
    status: HttpStatus.OK,
    description: 'Edit article',
  })
  @ApiOperation({ summary: 'Edit article' })
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.Moderator)
  @Put('/:uuid')
  editArticle(@Param() params: UuidArticleDto, @Body() storeArticleDto: StoreArticleDto) {
    return this.articleService.edit(params.uuid, storeArticleDto);
  }


}

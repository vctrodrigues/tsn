import createMessage, {
  PayloadInterface,
  Validation,
} from './../../helpers/payload.model';
import {
  Controller,
  Request,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { HTTPResponse } from '../../helpers/responses';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import fileUtils from '../../helpers/file';
import { Post as UserPost } from '../post/post.entity';
import { PostService } from '../post/post.service';

class UserDTO {
  constructor(user) {
    const { name, cpf, email, username, bio, password, role, post } = user;

    this.name = name;
    this.cpf = cpf;
    this.email = email;
    this.username = username;
    this.bio = bio;
    this.password = password;
    this.role = role;
    this.post = new UserPost();
    this.post.text = post;
  }

  name: string;
  cpf: string;
  email: string;
  username: string;
  bio: string;
  password: string;
  role: Role;
  post: UserPost;

  toUser() {
    const user = new User();
    user.cpf = this.cpf;
    user.name = this.name;
    user.email = this.email;
    user.username = this.username;
    user.bio = this.bio;
    user.password = this.password;
    user.role = this.role;
    return user;
  }
}

@Controller('users')
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _postService: PostService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  async getUser(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<PayloadInterface> {
    const user = await this._userService.findById(uuid);
    if (user) {
      return createMessage(true, '', user);
    }

    return createMessage(false, HTTPResponse.NOT_FOUND);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/email/:email')
  async getUserByEmail(
    @Param('email') email: string,
  ): Promise<PayloadInterface> {
    const user = await this._userService.findByEmail(email);
    if (user) {
      return createMessage(true, '', user);
    }

    return createMessage(false, HTTPResponse.NOT_FOUND);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/username/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<PayloadInterface> {
    const user = await this._userService.findByUsername(username);
    if (user) {
      return createMessage(true, '', user);
    }

    return createMessage(false, HTTPResponse.NOT_FOUND);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(): Promise<User[]> {
    return await this._userService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @Roles(Role.ADMIN)
  async createUser(@Body() user: User): Promise<PayloadInterface> {
    const findUser = await this._userService.findByEmail(user.email);
    if (!findUser) {
      const userCreated = await this._userService.create(user);
      return createMessage(true, HTTPResponse.CREATED, userCreated);
    }

    const { validated, field } = this._validate(user);
    if (!validated) {
      return createMessage(false, HTTPResponse.BAD_REQUEST, null, field);
    }

    return createMessage(false, HTTPResponse.EMAIL_EXISTS);
  }

  @Post('/signup')
  async signup(@Body() userDTO): Promise<PayloadInterface> {
    userDTO = new UserDTO(userDTO);
    const findUser = await this._userService.findByEmail(userDTO.email);

    if (findUser) {
      return createMessage(false, HTTPResponse.EMAIL_EXISTS);
    }

    const { validated, field } = this._validate(userDTO);
    if (!validated) {
      return createMessage(false, HTTPResponse.BAD_REQUEST, null, field);
    }

    const userCreated = await this._userService.create(userDTO.toUser());
    userDTO.post.user = userCreated;

    const post = await this._postService.create(userDTO.post);
    return createMessage(true, HTTPResponse.CREATED, post);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:uuid')
  async deleteUser(@Param('uuid', ParseUUIDPipe) uuid: string) {
    await this._userService.delete(uuid);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  async updateUser(@Request() req, @Body() user: User) {
    const { validated, field } = this._validate(user);
    if (!validated) {
      return createMessage(false, HTTPResponse.BAD_REQUEST, null, field);
    }

    return this._userService.update(user, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/picture')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: fileUtils.destination,
        filename: fileUtils.filename,
      }),
      fileFilter: fileUtils.imageFileFilter,
    }),
  )
  async updatePicture(@Request() req, @UploadedFile() file) {
    const user = new User();
    user.picture = file.filename;

    return this._userService.update(user, req.user.id);
  }

  _validate(user: User | UserDTO): Validation {
    const fields = ['email', 'password', 'cpf', 'name', 'username'];

    for (const field of fields) {
      if (!user[field]) {
        return {
          validated: false,
          field,
        };
      }
    }

    return {
      validated: true,
    };
  }
}

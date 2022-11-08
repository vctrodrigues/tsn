import { HTTPResponse } from './../../helpers/responses';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { Repository } from 'typeorm';
import { DB } from 'src/helpers/constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(DB.USER.REPOSITORY)
    private readonly _userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    return await this._userRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this._userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this._userRepository.findOne({
      where: { username },
    });

    return user;
  }

  async getAll(): Promise<User[]> {
    const users: User[] = await this._userRepository.find();
    return users;
  }

  async create(user: User): Promise<User> {
    try {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(user.password, saltOrRounds);

      const userObject = { ...user, password: hash };
      const savedUser = await this._userRepository.save(userObject);

      return savedUser;
    } catch (exception) {
      throw exception;
    }
  }

  async delete(uuid: string): Promise<void> {
    const userExists = await this._userRepository.findOne({
      where: { id: uuid },
    });

    if (!userExists) {
      throw new BadRequestException(HTTPResponse.NOT_FOUND);
    }

    // need to add check permissions for deleting user
    await this._userRepository.delete(uuid);
  }

  async update(user: User, uuid?: string): Promise<User> {
    try {
      if (this._userRepository.update(uuid || user.id, user)) {
        return this._userRepository.findOne({ where: { id: uuid || user.id } });
      }
    } catch (exception) {
      throw exception;
    }
  }

  // async createAndPost() {

  // }
}

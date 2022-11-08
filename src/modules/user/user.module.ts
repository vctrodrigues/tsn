import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SharedModule } from '../../shared/shared.module';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.providers';
import { PostService } from '../post/post.service';
import { postProviders } from '../post/post.providers';
@Module({
  imports: [SharedModule, DatabaseModule],
  providers: [UserService, ...userProviders, PostService, ...postProviders],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

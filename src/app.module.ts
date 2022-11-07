import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './validation.pipe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { ChatGateway } from './modules/conversation/chat/chat.gateway';

import { AuthModule } from './auth/auth.module';
import { ChatService } from './modules/conversation/chat/chat.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
    DatabaseModule,
    UserModule,
    PostModule,
    ConversationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ChatService,
    ChatGateway,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}

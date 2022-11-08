import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationRepository } from './conversation.repository';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { MessageService } from './message/message.service';
import { MessageRepository } from './message/message.repository';
import { SharedModule } from '../../shared/shared.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationRepository]),
    TypeOrmModule.forFeature([MessageRepository]),
    SharedModule,
  ],
  providers: [ConversationService, MessageService],
  controllers: [ConversationController],
  exports: [ConversationService, MessageService],
})
export class ConversationModule {}

import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { MessageService } from './message/message.service';
import { SharedModule } from '../../shared/shared.module';
import { DatabaseModule } from 'src/database/database.module';
import { conversationProviders } from './conversation.providers';
import { messageProviders } from './message/message.providers';
@Module({
  imports: [SharedModule, DatabaseModule],
  providers: [
    ConversationService,
    MessageService,
    ...conversationProviders,
    ...messageProviders,
  ],
  controllers: [ConversationController],
  exports: [ConversationService, MessageService],
})
export class ConversationModule {}

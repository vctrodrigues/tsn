import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import createMessage, { PayloadInterface } from '../../helpers/payload.model';
import { HTTPResponse } from '../../helpers/responses';
import { ConversationService } from './conversation.service';
import { MessageService } from './message/message.service';
import { Message } from './message/message.entity';

@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly _conversationService: ConversationService,
    private readonly _messageService: MessageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getConversations(@Request() req): Promise<PayloadInterface> {
    const sent = await this._conversationService.findByUser(req.user.id, true);
    const received = await this._conversationService.findByUser(req.user.id);

    if (sent && received) {
      return createMessage(true, '', sent.concat(received));
    } else {
      throw new NotFoundException(HTTPResponse.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  async getConversation(
    @Request() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<PayloadInterface> {
    const conversation = await this._conversationService.findById(
      uuid,
      req.user.id,
    );

    if (conversation) {
      return createMessage(true, '', conversation);
    } else {
      throw new NotFoundException(HTTPResponse.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/with/:uuid')
  async getUserConversation(
    @Request() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<PayloadInterface> {
    const conversation = await this._conversationService.findByUserWith(
      req.user.id,
      uuid,
    );

    if (conversation) {
      return createMessage(true, '', conversation);
    } else {
      throw new NotFoundException(HTTPResponse.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createConversation(
    @Request() req,
    @Body() conversation,
  ): Promise<PayloadInterface> {
    conversation.fromUser = req.user.id;
    try {
      const createdConversation = await this._conversationService.create(
        conversation,
      );

      if (createdConversation) {
        return createMessage(true, '', createdConversation);
      } else {
        throw new InternalServerErrorException(HTTPResponse.UNKNOWN_ERROR);
      }
    } catch (exception) {
      throw new InternalServerErrorException(exception);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:uuid')
  async updateConversation(
    @Request() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() conversation,
  ): Promise<PayloadInterface> {
    conversation.fromUser = req.user.id;
    try {
      const result = await this._conversationService.update(uuid, conversation);
      if (result.affected > 0) {
        return createMessage(true, '', conversation);
      } else {
        throw new NotFoundException(HTTPResponse.NOT_FOUND);
      }
    } catch (exception) {
      throw new InternalServerErrorException(exception);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:uuid/messages')
  async getConversationMessages(
    @Request() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<PayloadInterface> {
    try {
      if (await this._conversationService.findById(uuid, req.user.id)) {
        const messages = await this._messageService.findByConversation(uuid);
        return createMessage(true, '', messages);
      } else {
        throw new ForbiddenException(HTTPResponse.NOT_AUTHORIZED);
      }
    } catch (exception) {
      throw new InternalServerErrorException(exception);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:uuid')
  async deleteConversation(
    @Request() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<PayloadInterface> {
    try {
      const result = await this._conversationService.delete(uuid, req.user.id);
      return createMessage(true, HTTPResponse.DELETED, result.raw);
    } catch (exception) {
      throw new InternalServerErrorException(exception);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:uuid/send')
  async sendMessage(
    @Request() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() message: Message,
  ): Promise<PayloadInterface> {
    const conversation = await this._conversationService.findById(
      uuid,
      req.user.id,
    );

    if (!conversation) {
      throw new NotFoundException(HTTPResponse.NOT_FOUND);
    }

    message.conversation = conversation;
    message.fromUser = req.user;
    const createdMessage = await this._messageService.create(message);
    return createMessage(true, HTTPResponse.CREATED, createdMessage);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:conversation_id/message/:message_id')
  async deleteMessage(
    @Request() req,
    @Param('conversation_id', ParseUUIDPipe) conversation_id: string,
    @Param('message_id', ParseUUIDPipe) message_id: string,
  ): Promise<PayloadInterface> {
    const conversation = this._conversationService.findById(
      conversation_id,
      req.user.id,
    );

    if (!conversation) {
      throw new NotFoundException(HTTPResponse.NOT_FOUND);
    }

    const result = await this._messageService.delete(message_id);
    return createMessage(true, HTTPResponse.DELETED, result.raw);
  }
}

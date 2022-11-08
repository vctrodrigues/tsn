import { DB } from 'src/helpers/constants';
import { DataSource } from 'typeorm';
import { Conversation } from './conversation.entity';

export const conversationProviders = [
  {
    provide: DB.CONVERSATION.REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Conversation),
    inject: [DB.DATA_SOURCE],
  },
];

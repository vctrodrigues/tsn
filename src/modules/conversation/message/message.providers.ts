import { DB } from 'src/helpers/constants';
import { DataSource } from 'typeorm';
import { Message } from './message.entity';

export const messageProviders = [
  {
    provide: DB.MESSAGE.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Message),
    inject: [DB.DATA_SOURCE],
  },
];

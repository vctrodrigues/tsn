import { DB } from 'src/helpers/constants';
import { DataSource } from 'typeorm';
import { Like } from './like.entity';

export const likeProviders = [
  {
    provide: DB.LIKE.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Like),
    inject: [DB.DATA_SOURCE],
  },
];

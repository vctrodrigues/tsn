import { DB } from 'src/helpers/constants';
import { DataSource } from 'typeorm';
import { Comment } from './comment.entity';

export const commentProviders = [
  {
    provide: DB.COMMENT.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Comment),
    inject: [DB.DATA_SOURCE],
  },
];

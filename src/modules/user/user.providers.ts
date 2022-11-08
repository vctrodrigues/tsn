import { DB } from 'src/helpers/constants';
import { DataSource } from 'typeorm';
import { User } from './user.entity';

export const userProviders = [
  {
    provide: DB.USER.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DB.DATA_SOURCE],
  },
];

import { DB } from 'src/helpers/constants';
import { DataSource } from 'typeorm';
import { Post } from './post.entity';

export const postProviders = [
  {
    provide: DB.POST.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Post),
    inject: [DB.DATA_SOURCE],
  },
];

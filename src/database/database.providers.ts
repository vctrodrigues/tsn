import { DB_CONFIGURATION } from '../config/config.key';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DB } from 'src/helpers/constants';

export const databaseProviders = [
  {
    provide: DB.DATA_SOURCE,
    imports: [ConfigModule],
    inject: [ConfigService],
    async useFactory(configService: ConfigService) {
      const dataSource = new DataSource({
        type: 'mysql' as const,
        host: configService.get<string>(DB_CONFIGURATION.MYSQL_HOST),
        username: configService.get<string>(DB_CONFIGURATION.MYSQL_USER),
        password: configService.get<string>(DB_CONFIGURATION.MYSQL_USER_PASS),
        database: configService.get<string>(DB_CONFIGURATION.MYSQL_DB_NAME),
        port: configService.get<number>(DB_CONFIGURATION.MYSQL_PORT),

        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
      });

      return dataSource.initialize();
    },
  },
];

import { DB_CONFIGURATION } from './../config/config.key';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    async useFactory(configService: ConfigService) {
      return {
        type: 'mysql' as const,
        host: configService.get<string>(DB_CONFIGURATION.MYSQL_HOST),
        username: configService.get<string>(DB_CONFIGURATION.MYSQL_USER),
        password: configService.get<string>(DB_CONFIGURATION.MYSQL_USER_PASS),
        database: configService.get<string>(DB_CONFIGURATION.MYSQL_DB_NAME),
        port: configService.get<number>(DB_CONFIGURATION.MYSQL_PORT),

        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        keepConnectionAlive: true,
      } as ConnectionOptions;
    },
  }),
];

import { DB_CONFIGURATION } from './src/config/config.key';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const configService = new ConfigService();
export const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: configService.get<string>(DB_CONFIGURATION.MYSQL_HOST),
  username: configService.get<string>(DB_CONFIGURATION.MYSQL_USER),
  password: configService.get<string>(DB_CONFIGURATION.MYSQL_USER_PASS),
  database: configService.get<string>(DB_CONFIGURATION.MYSQL_DB_NAME),
  port: configService.get<number>(DB_CONFIGURATION.MYSQL_PORT),
  charset: 'utf8mb4',
  keepConnectionAlive: true,
  entities: ['src/modules/**/*entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: configService.get<boolean>(DB_CONFIGURATION.SYNCHRONIZE),
};

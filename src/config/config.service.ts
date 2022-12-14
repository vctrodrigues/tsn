import * as fs from 'fs';
import { parse } from 'dotenv';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    const isDevelopmentEnv = process.env.NODE_ENV !== 'Production';
    if (isDevelopmentEnv) {
      const envFilePath = '.env.development';
      const existsPath = fs.existsSync(envFilePath);
      if (!existsPath) {
        console.log('.env not exists');
        process.exit;
      }
      this.envConfig = parse(fs.readFileSync(envFilePath));
    } else {
      const envFilePath = '.env';
      const existsPath = fs.existsSync(envFilePath);
      if (!existsPath) {
        console.log('.env not exists');
        process.exit;
      }
      this.envConfig = parse(fs.readFileSync(envFilePath));
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}

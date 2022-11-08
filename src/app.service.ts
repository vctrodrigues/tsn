import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello, I'm the TSN server API and I'm working fine! :)";
  }
}

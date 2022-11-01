import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { BullModule } from '@nestjs/bull';
import { MessageProducer } from './message.producer';
import { MessageConsumer } from './message.consumer';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CacheModule.register({
      store: redisStore,
      host: String(configuration().redis.host),
      port: Number(configuration().redis.port),
      password: String(configuration().redis.password),
    }),
    BullModule.forRoot({
      redis: {
        host: String(configuration().redis.host),
        port: Number(configuration().redis.port),
        password: String(configuration().redis.password),
      }
    }),
    BullModule.registerQueue({
      name: 'message-queue'
    })
  ],
  controllers: [AppController],
  providers: [AppService, MessageProducer, MessageConsumer],
})
export class AppModule {
  constructor(public configService: ConfigService) {}
}

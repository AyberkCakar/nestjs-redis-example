import {
  CacheInterceptor,
  CacheKey,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  UseInterceptors,
  Query,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { getCats, getDogs } from "./utils";
import { MessageProducer } from "./message.producer";

@UseInterceptors(CacheInterceptor)
@Controller()
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private messageProducer: MessageProducer
  ) {}

  @CacheKey("all-dogs")
  @Get("dogs")
  getDogs() {
    return getDogs();
  }

  @Get("dogs-2")
  async getDogs2() {
    const cachedDogs = await this.cacheManager.get("all-dogs2");
    if (cachedDogs) return cachedDogs;

    const dogs = await getDogs();
    this.cacheManager.set("all-dogs2", dogs, 10);

    return dogs;
  }

  @Get("cats")
  @CacheKey("all-cats")
  async getCats() {
    const cats = await getCats();

    return cats;
  }

  @Delete("dogs")
  async deleteCats() {
    this.cacheManager.del("all-dogs2");
    return "ok";
  }

  @Get("send-message")
  async sendMessage(@Query("message") message: string) {
    this.messageProducer.sendMessage(message);
    return message;
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Tag, TagSchema } from '../../shared/schemas/tag.schema';
import { SeederService } from './seeder/seeder.service';

let mongod: MongoMemoryServer;

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        mongod = new MongoMemoryServer();
        const uri = await mongod.getUri();

        return {
          uri: uri,
        };
      },
    }),
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
  ],
  providers: [SeederService],
})
export class DatabaseTestingModule {}

export async function closeMongoConnection(): Promise<void> {
  if (mongod) await mongod.stop();
}

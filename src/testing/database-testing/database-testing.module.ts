import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Tag, TagSchema } from '../../common/schemas/tag.schema';
import { SeederService } from './seeder/seeder.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const mongod = new MongoMemoryServer();
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

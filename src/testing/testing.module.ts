import { Module } from '@nestjs/common';
import { DatabaseTestingModule } from './database-testing/database-testing.module';

@Module({
  imports: [DatabaseTestingModule]
})
export class TestingModule {}

import { forwardRef, Module } from '@nestjs/common';
import { authModule } from 'src/auth/auth.module';
import { EmailWorker } from './email.service';
import { Templates } from './utils/Templates';

@Module({
  imports: [forwardRef(() => authModule)],
  providers: [EmailWorker, Templates],
  exports: [EmailWorker],
})
export class emailModule {}

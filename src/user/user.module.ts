import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { FileBasedUserRepository, IUserRepositoryToken } from './persistence/file-base-user.repository';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: IUserRepositoryToken,
      useClass: FileBasedUserRepository
    }
  ]
})
export class UserModule {}

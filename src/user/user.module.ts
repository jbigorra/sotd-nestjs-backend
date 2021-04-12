import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { FileBasedUserRepository, IUserRepositoryToken } from './persistence/file-based-user.repository';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: IUserRepositoryToken,
      useClass: FileBasedUserRepository
    }
  ],
  exports: [
    {
      provide: IUserRepositoryToken,
      useClass: FileBasedUserRepository
    }
  ]
})
export class UserModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { FileBasedUserRepository, IUserRepositoryToken } from '../persistence/file-base-user.repository';
import { UserController } from './user.controller';

describe('UserControllerController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        // TODO: change to memory base repo for testing or different filebased repo
        { provide: IUserRepositoryToken, useClass: FileBasedUserRepository }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

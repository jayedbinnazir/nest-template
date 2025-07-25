import { Test, TestingModule } from '@nestjs/testing';
import { UserRoleController } from './user_role.controller';
import { UserRoleService } from '../services/user_role.service';



describe('UserRoleController', () => {
  let controller: UserRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRoleController],
      providers: [UserRoleService],
    }).compile();

    controller = module.get<UserRoleController>(UserRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

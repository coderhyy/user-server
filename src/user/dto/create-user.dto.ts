import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名必填' })
  readonly username: string;

  @IsNotEmpty({ message: '密码必填' })
  readonly password: string;
}

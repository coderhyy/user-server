import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { compareSync } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const user = this.userRepository.create(createUserDto);

    return this.userRepository.save(user);
  }

  async validate(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new BadRequestException('用户名不正确!');
    }

    if (!compareSync(password, user.password)) {
      throw new BadRequestException('密码错误!');
    }

    return user;
  }

  async findAll(query) {
    const {
      real_name = '',
      province = '',
      city = '',
      area = '',
      page = 1,
      pageSize = 10,
    } = query;

    const [list, total] = await this.userRepository.findAndCount({
      where: {
        real_name: Like(`%${real_name}%`),
        province: Like(`%${province}%`),
        city: Like(`%${city}%`),
        area: Like(`%${area}%`),
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { list, total };
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const updateUser = this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(updateUser);
  }

  async remove(id: number) {
    const existUser = await this.findOne(id);

    if (!existUser) {
      throw new HttpException(`id为${id}的用户不存在`, HttpStatus.BAD_REQUEST);
    }

    return await this.userRepository.softRemove(existUser);
  }
}

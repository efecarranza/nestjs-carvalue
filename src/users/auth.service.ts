import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) {}

	async signup(email: string, password: string) {
		const users = await this.usersService.find(email);
		if (users.length) {
			throw new BadRequestException('E-mail already in use.');
		}

		const salt = randomBytes(8).toString('hex');
		const hash = (await scrypt(password, salt, 32)) as Buffer;
		const result = hash.toString('hex') + '.' + salt;

		const user = this.usersService.create(email, result);

		return user;
	}

	signin() {

	}
}

import { 
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Param,
	Query,
	Post,
	NotFoundException
} from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
	constructor(private authService: AuthService, private usersService: UsersService) {}

	@Post('/signup')
	createUser(@Body() body: CreateUserDto) {
		this.authService.signup(body.email, body.password);
	}

	@Get('/:id')
	async findUser(@Param('id') id: string) {
		const user = await this.usersService.findOne(parseInt(id));

		if (!user) {
			throw new NotFoundException('User Not Found');
		}

		return user;
	}

	@Get()
	findAllUsers(@Query('email') email: string) {
		return this.usersService.find(email);
	}

	@Patch('/:id')
	update(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.usersService.update(parseInt(id), body);
	}

	@Delete('/:id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(parseInt(id));
	}
}

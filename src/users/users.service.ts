import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        const user = this.repo.create({ email, password });
        return this.repo.save(user);
    }

    findOne(id: number) {
        if (!id) {
            return null;
        }

        return this.repo.findOne(id);
    }

    find(email: string) {
        return this.repo.find({ email });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.repo.findOne(id);

        if (!user) {
            throw new NotFoundException('User Not Found');
        }

        return this.repo.save(Object.assign(user, attrs));
    }

    async remove(id: number) {
        const user = await this.repo.findOne(id);

        if (!user) {
            throw new NotFoundException('User Not Found');
        }

        return this.repo.remove(user);
    }
}

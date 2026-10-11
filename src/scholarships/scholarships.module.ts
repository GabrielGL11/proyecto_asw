import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module.js';
import { ScholarshipsController } from './scholarships.controller.js';
import { ScholarshipsService } from './scholarships.service.js';
import { Scholarship } from './entities/scholarship.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Scholarship]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        AuthModule,
    ],
    controllers: [ScholarshipsController],
    providers: [ScholarshipsService],
})
export class ScholarshipsModule {}
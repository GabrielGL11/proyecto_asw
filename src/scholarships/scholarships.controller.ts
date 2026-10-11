import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ScholarshipsService } from './scholarships.service.js';
import { CreateScholarshipDto } from './dto/create-scholarship.dto.js';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto.js';
import { ScholarshipsQueryDto } from './dto/scholarships-query.dto.js';
import { ParseScholarshipIdPipe } from './pipes/parse-scholarship-id.pipe.js';

@Controller('scholarships')
export class ScholarshipsController {
    constructor(
        private readonly scholarshipsService: ScholarshipsService,
    ) {}
    @Get()
    findAll(@Query() query: ScholarshipsQueryDto) {
        return this.scholarshipsService.findAll(query);
    }
    @Get(':id')
    findOne(@Param('id', ParseScholarshipIdPipe) id: number) {
        return this.scholarshipsService.findOne(id);
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createScholarshipDto: CreateScholarshipDto) {
        return this.scholarshipsService.create(createScholarshipDto);
    }
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id', ParseScholarshipIdPipe) id: number,
        @Body() updateScholarshipDto: UpdateScholarshipDto,
    ) {
        return this.scholarshipsService.update(id, updateScholarshipDto);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id', ParseScholarshipIdPipe) id: number) {
        return this.scholarshipsService.remove(id);
    }
}
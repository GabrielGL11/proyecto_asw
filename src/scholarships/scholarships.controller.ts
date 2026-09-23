import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service.js';
import { CreateScholarshipDto } from './dto/create-scholarship.dto.js';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto.js';
import { ParseScholarshipIdPipe } from './pipes/parse-scholarship-id.pipe.js';

@Controller('scholarships')
export class ScholarshipsController {
    constructor(
    private readonly scholarshipsService: ScholarshipsService,
    ) {}
    @Get()
    findAll() {
    return this.scholarshipsService.findAll();
    }
    @Get(':id')
    findOne(@Param('id', ParseScholarshipIdPipe) id: number) {
    return this.scholarshipsService.findOne(id);
    }
    @Post()
    create(@Body() createScholarshipDto: CreateScholarshipDto) {
    return this.scholarshipsService.create(createScholarshipDto);
    }
    @Patch(':id')
    update(
    @Param('id', ParseScholarshipIdPipe) id: number,
    @Body() updateScholarshipDto: UpdateScholarshipDto,
    ) {
    return this.scholarshipsService.update(id, updateScholarshipDto);
    }
    @Delete(':id')
    remove(@Param('id', ParseScholarshipIdPipe) id: number) {
    return this.scholarshipsService.remove(id);
    }
}
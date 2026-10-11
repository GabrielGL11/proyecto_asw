import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { TrackingService } from './tracking.service.js';
import { CreateTrackingDto } from './dto/create-tracking.dto.js';
import { UpdateTrackingDto } from './dto/update-tracking.dto.js';
import { TrackingQueryDto } from './dto/tracking-query.dto.js';

@Controller('tracking')
export class TrackingController {
    constructor(
        private readonly trackingService: TrackingService,
    ) {}
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateTrackingDto) {
        return this.trackingService.create(dto);
    }
    @Get()
    findAll(@Query() query: TrackingQueryDto) {
        return this.trackingService.findAll(query);
    }
    @Get('application/:applicationId')
    findByApplication(
        @Param('applicationId', ParseIntPipe) applicationId: number,
    ) {
        return this.trackingService.findByApplication(applicationId);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.trackingService.findOne(id);
    }
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTrackingDto,
    ) {
        return this.trackingService.update(id, dto);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.trackingService.remove(id);
    }
}
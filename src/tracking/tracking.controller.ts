import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TrackingService } from './tracking.service.js';
import { CreateTrackingDto } from './dto/create-tracking.dto.js';
import { UpdateTrackingDto } from './dto/update-tracking.dto.js';
import { ParseTrackingIdPipe } from './pipes/parse-tracking-id.pipe.js';

@Controller('tracking')
export class TrackingController {
    constructor(
    private readonly trackingService: TrackingService,
    ) {}
    @Get()
    findAll() {
    return this.trackingService.findAll();
    }
    @Get('application/:applicationId')
    findByApplication(@Param('applicationId', ParseIntPipe) applicationId: number) {
    return this.trackingService.findByApplication(applicationId);
    }
    @Get(':id')
    findOne(@Param('id', ParseTrackingIdPipe) id: number) {
    return this.trackingService.findOne(id);
    }
    @Post()
    create(@Body() createTrackingDto: CreateTrackingDto) {
    return this.trackingService.create(createTrackingDto);
    }
    @Patch(':id')
    update(
    @Param('id', ParseTrackingIdPipe) id: number,
    @Body() updateTrackingDto: UpdateTrackingDto,
    ) {
    return this.trackingService.update(id, updateTrackingDto);
    }
    @Delete(':id')
    remove(@Param('id', ParseTrackingIdPipe) id: number) {
    return this.trackingService.remove(id);
    }
}
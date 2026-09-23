import { PartialType } from '@nestjs/mapped-types';
import { CreateScholarshipDto } from './create-scholarship.dto.js';

export class UpdateScholarshipDto extends PartialType(CreateScholarshipDto) {}
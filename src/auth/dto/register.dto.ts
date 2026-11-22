import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

/** El rol no se acepta aquí: toda cuenta nueva es `student`. */
export class RegisterDto {
  @ApiProperty({ type: String, format: 'email', example: 'estudiante@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, minLength: 8, example: 'Prueba123!' })
  @IsString()
  @MinLength(8)
  password: string;
}

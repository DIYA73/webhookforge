import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateEndpointDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;
}

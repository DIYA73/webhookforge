import { IsString, IsUrl, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateReplayDto {
  @IsString()
  requestId: string;

  @IsUrl()
  targetUrl: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  maxAttempts?: number;
}

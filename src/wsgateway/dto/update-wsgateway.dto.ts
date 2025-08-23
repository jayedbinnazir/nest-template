import { PartialType } from '@nestjs/mapped-types';
import { CreateWsgatewayDto } from './create-wsgateway.dto';

export class UpdateWsgatewayDto extends PartialType(CreateWsgatewayDto) {}

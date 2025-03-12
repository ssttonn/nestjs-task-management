import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaskBody {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string
}
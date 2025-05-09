import { Controller, Post, Body, Get, Param, Put, Patch, Delete, ParseIntPipe, ConflictException } from "@nestjs/common";
import { UpdatePutUserDTO } from "./dto/update-put-user-dto";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user-dto";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    private async handleIdParam(@Param('id', ParseIntPipe) id: number) {
        await this.userService.exists(id); // Verifica se o usuário existe
        return id;
    }

    @Post()
    async create(@Body() data: CreateUserDTO) {

        const emailExists = await this.userService.emailExists(data.email);
        if (emailExists) {
            throw new ConflictException('Email já está em uso');
        }

        return this.userService.create(data);
    }

    @Get()
    list() {
        return this.userService.list();
    }

    @Get(':id')
    show(@Param('id', ParseIntPipe) id: number) {
        return this.userService.show(id);
    }

    @Put(':id')
    update(@Body() data: UpdatePutUserDTO, @Param('id', ParseIntPipe) id: number) {
        return this.userService.update(id, data);
    }

    @Patch(':id')
    updatePartial(@Body() data: UpdatePatchUserDTO, @Param('id', ParseIntPipe) id: number) {
        return this.userService.updatePartial(id, data);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.handleIdParam(id);
        return this.userService.delete(id);
    }
}
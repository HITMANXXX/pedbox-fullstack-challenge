import { Controller, Get, Post, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PaginationDto } from './dto/pagination.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post('sync')
  sync() {
    return this.pokemonService.syncPokemonData();
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    const page = paginationDto.page ? parseInt(paginationDto.page, 10) : 1;
    const limit = paginationDto.limit ? parseInt(paginationDto.limit, 10) : 10;
    
    const validPage = isNaN(page) || page < 1 ? 1 : page;
    const validLimit = isNaN(limit) || limit < 1 ? 10 : limit;

    return this.pokemonService.findAll(validPage, validLimit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonService.findOne(id);
  }
}

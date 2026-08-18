import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PokemonService {
  constructor(private prisma: PrismaService) {}

  async syncPokemonData() {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      if (!response.ok) {
        throw new Error('Failed to fetch from PokeAPI');
      }
      
      const data = await response.json();
      const results = data.results;

      const detailedPromises = results.map((poke: { name: string; url: string }) => 
        fetch(poke.url).then(res => res.json())
      );

      const pokemonsDetailed = await Promise.all(detailedPromises);

      for (const poke of pokemonsDetailed) {
        await this.prisma.pokemon.upsert({
          where: { name: poke.name },
          update: {
            height: poke.height,
            weight: poke.weight,
            spriteImageUrl: poke.sprites?.front_default,
            types: {
              connectOrCreate: poke.types.map((t: any) => ({
                where: { name: t.type.name },
                create: { name: t.type.name },
              })),
            },
          },
          create: {
            id: poke.id,
            name: poke.name,
            height: poke.height,
            weight: poke.weight,
            spriteImageUrl: poke.sprites?.front_default,
            types: {
              connectOrCreate: poke.types.map((t: any) => ({
                where: { name: t.type.name },
                create: { name: t.type.name },
              })),
            },
          },
        });
      }

      return { message: 'Pokemons synchronized successfully', count: pokemonsDetailed.length };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error synchronizing with PokeAPI');
    }
  }

  async findAll(
    page: number = 1, 
    limit: number = 10,
    search?: string,
    type?: string,
    sortBy: string = 'id',
    order: 'asc' | 'desc' = 'asc'
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (type) {
      where.types = { some: { name: type } };
    }

    const orderBy: any = {};
    if (sortBy === 'name') {
      orderBy.name = order;
    } else {
      orderBy.id = order;
    }

    const [data, total] = await Promise.all([
      this.prisma.pokemon.findMany({
        where,
        skip,
        take,
        include: { types: true },
        orderBy,
      }),
      this.prisma.pokemon.count({ where }),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { id },
      include: { types: true },
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }

    return pokemon;
  }
}

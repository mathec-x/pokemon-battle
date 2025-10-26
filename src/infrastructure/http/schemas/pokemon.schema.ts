import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const pokemonParamsSchema = z
  .object({
    id: z.coerce.number()
  })
  .meta({
    name: 'pokemonParamsSchema',
    description: 'Parâmetros de busca',
  });


export const pokemonResponseSchema = z
  .object({
    id: z.number(),
    tipo: z.string(),
    treinador: z.string(),
    nivel: z.number()
  }).meta({
    name: 'GetPokemonResponseSchema',
    description: 'Lista um registro da tabela de pokémons.'
  });

export const listPokemonResponseSchema = z
  .array(
    z.object(pokemonResponseSchema.shape)
  )
  .meta({
    name: 'ListPokemonResponseSchema',
    description: 'Lista um registro da tabela de pokémons.'
  });

export const createPokemonSchema = z
  .object({
    tipo: z.string(),
    treinador: z.string()
  }).meta({
    name: 'CreatePokemonSchema',
    description: 'Cria um registro na tabela de pokémons.'
  });

export const updatePokemonSchema = z
  .object({
    treinador: z.string()
  }).meta({
    name: 'UpdatePokemonSchema',
    description: 'Apenas a propriedade `treinador` pode ser alterada.'
  });

export const pokemonBattleResponseSchema = z
  .object({
    vencedor: pokemonResponseSchema,
    perdedor: pokemonResponseSchema,
  }).meta({
    name: 'PokemonBattleResponseSchema',
    description: 'Resultado da batalha entre dois pokémons.'
  });





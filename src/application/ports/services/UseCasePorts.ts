export interface GetPokemonUseCasePort {
  execute(id: number): Promise<{
    id: number;
    nivel: number;
    tipo: string;
    treinador: string;
  }>;
}

export interface ListPokemonUseCasePort {
  execute(): Promise<{
    id: number;
    nivel: number;
    tipo: string;
    treinador: string;
  }[]>;
}

export interface CreatePokemonUseCasePort {
  execute(type: string, trainer: string): Promise<{
    id: number;
    nivel: number;
    tipo: string;
    treinador: string;
  }>;
}

export interface UpdatePokemonUseCasePort {
  execute(id: number, name: string): Promise<{
    id: number;
    type: string;
    trainer: string;
    level: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface DeletePokemonUseCasePort {
  execute(id: number): Promise<{
    id: number;
    type: string;
    trainer: string;
    level: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface BattlePokemonUseCasePort {
  execute(id1: number, id2: number): Promise<{
    vencedor: {
      id: number;
      nivel: number;
      tipo: string;
      treinador: string;
    };
    perdedor: {
      id: number;
      nivel: number;
      tipo: string;
      treinador: string;
    };
  }>;
}
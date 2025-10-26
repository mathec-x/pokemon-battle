export interface HttpClientPort {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
}

export interface ExternalPokemonApiPort {
  getPokemonInfo(pokemonName: string): Promise<{
    name: string;
    id: number;
    types: string[];
    stats: {
      hp: number;
      attack: number;
      defense: number;
      speed: number;
    };
  }>;
}

export interface NotificationGatewayPort {
  sendBattleNotification(message: {
    winner: string;
    loser: string;
    trainers: string[];
  }): Promise<void>;
}

export interface CacheGatewayPort {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
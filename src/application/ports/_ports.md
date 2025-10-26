### Ports (Interfaces)

Define contratos que os adapters precisam implementar, mantendo a aplicação desacoplada dos detalhes de infraestrutura.

## 🔧 Repository Ports

```ts
// PokemonRepositoryPort.ts
export interface PokemonRepositoryPort {
    getPokemon(id: number): Promise<Pokemon | null>;
    listPokemons(): Promise<Pokemon[]>;
    createPokemon(type: string, trainer: string): Promise<Pokemon>;
    // ... outros métodos
}
```

## 🎯 Service Ports

```ts
// LoggerServicePort.ts
export interface LoggerServicePort {
    info(message: string, ...params: any[]): void;
    error(message: string, ...params: any[]): void;
    // ... outros levels
}

// UseCasePorts.ts
export interface GetPokemonUseCasePort {
    execute(id: number): Promise<PokemonDTO>;
}
```

## 🌐 Gateway Ports

```ts
// ExternalGatewayPorts.ts  
export interface HttpClientPort {
    get<T>(url: string): Promise<T>;
    post<T>(url: string, data: any): Promise<T>;
}

export interface NotificationGatewayPort {
    sendBattleNotification(message: BattleMessage): Promise<void>;
}
```

## ✅ Benefícios

- **Desacoplamento**: Core/Application não dependem de infraestrutura
- **Testabilidade**: Facilita criação de mocks e stubs
- **Flexibilidade**: Permite trocar implementações facilmente
- **Arquitetura Limpa**: Mantém direções de dependência corretas

## 📁 Organização

```
ports/
├── repositories/     # Interfaces para persistência
├── services/         # Interfaces para serviços e use cases  
└── gateways/         # Interfaces para APIs externas
```
# 🚀 Pokédex API

Uma API completa para gerenciamento de Pokémons com sistema de batalhas

## 📋 Índice

- [🏗️ Arquitetura](#️-arquitetura)
- [🔧 Tecnologias](#-tecnologias)
- [⚡ Quick Start](#-quick-start)
- [🛣️ Rotas da API](#️-rotas-da-api)
- [🧪 Testes](#-testes)
- [📊 Swagger/OpenAPI](#-swaggeropenapi)
- [🗂️ Requests (REST Client)](#️-requests-rest-client)
- [🐳 Docker](#-docker)
- [🚀 CI/CD](#-cicd)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)

## 🏗️ Arquitetura

Este projeto implementa **Arquitetura Hexagonal** (também conhecida como Ports & Adapters), que oferece:

- ✅ **Separação clara** entre regras de negócio e infraestrutura
- ✅ **Testabilidade** alta com dependency injection
- ✅ **Flexibilidade** para trocar adaptadores (banco, framework, etc.)
- ✅ **Escalabilidade** e manutenibilidade

### Estrutura Hexagonal

```
src/
├── core/              # 🟢 Domínio - Entidades e Regras de Negócio
├── application/       # 🔵 Camada de Aplicação - Use Cases e Ports
├── adapters/          # 🟡 Adaptadores - Implementações concretas
├── infrastructure/    # 🟠 Infraestrutura - Configurações e Bootstrap
└── shared/           # ⚪ Utilitários compartilhados
```

## 🔧 Tecnologias

### Core Dependencies
- **Express** 5.1.0 - Framework web minimalista e flexível
- **Prisma** 6.18.0 - ORM moderno com type-safety
- **Zod** 4.1.12 - Schema validation com TypeScript

### Adapters & Infrastructure  
- **@asteasolutions/zod-to-openapi** 8.1.0 - Gera OpenAPI automático do Zod
- **swagger-ui-express** 5.0.1 - Interface web para documentação
- **swagger-themes** 1.4.3 - Temas customizados para Swagger

### Development & Testing
- **TypeScript** 5.9.3 - Type safety e melhor DX
- **Jest** 30.2.0 - Framework de testes
- **SuperTest** 7.1.4 - Testes HTTP
- **ESLint** 9.38.0 - Linting com architectural boundaries
- **tsx** 4.20.6 - TypeScript execution para desenvolvimento

## ⚡ Quick Start

### Pré-requisitos
- Node.js >= 22.21.0
- Docker & Docker Compose

### 1. Clone e instale

```bash
git clone https://github.com/mathec-x/pokemon-battle.git
cd pokedex
npm install
```

### 2. Configure o banco de dados

```bash
# Sobe o PostgreSQL com PostGIS
npm run docker:db:up

# Gera o cliente Prisma e sincroniza schema
npm run prisma:generate
npm run prisma:push
```

### 3. Execute em desenvolvimento

```bash
# Modo desenvolvimento com hot-reload
npm run dev

# Ou especifique ambiente e log level
npm run dev --env=staging --log=debug
```

### 4. Acesse a aplicação

- **API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/docs
- **Prisma Studio**: `npm run prisma:studio`

## 🛣️ Rotas da API

Base URL: `http://localhost:3001/api/v1`

### 📋 Pokémons CRUD

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| `GET` | `/pokemons` | Lista todos os pokémons | 200 |
| `GET` | `/pokemons/:id` | Busca pokémon por ID | 200 |
| `POST` | `/pokemons` | Cria novo pokémon | 201 |
| `PUT` | `/pokemons/:id` | Atualiza treinador | 204 |
| `DELETE` | `/pokemons/:id` | Remove pokémon | 204 |

### ⚔️ Sistema de Batalhas

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| `POST` | `/battle/:id1/:id2` | Batalha entre dois pokémons | 200 |

### 📝 Exemplos de Request/Response

#### Criar Pokémon
```http
POST /api/v1/pokemons
Content-Type: application/json

{
  "type": "Charizard",
  "trainer": "Ash Ketchum"
}
```

```json
{
  "id": 1,
  "tipo": "Charizard", 
  "treinador": "Ash Ketchum",
  "nivel": 1
}
```

#### Batalha Pokémon
```http
POST /api/v1/battle/1/2
```

```json
{
  "vencedor": {
    "id": 1,
    "tipo": "Charizard",
    "treinador": "Ash",
    "nivel": 2
  },
  "perdedor": {
    "id": 2, 
    "tipo": "Pikachu",
    "treinador": "Misty",
    "nivel": 1
  }
}
```

## 🧪 Testes

```bash
# Testes unitários com coverage
npm run test

# Testes em modo watch
npm run test:watch

# Testes E2E
npm run test:e2e
```

### Estrutura de Testes
- **Unit Tests**: `src/**/*.spec.ts` - Testam componentes isolados
- **Integration Tests**: `tests/` - Testam fluxos completos da aplicação

## 📊 Swagger/OpenAPI

A documentação é **gerada automaticamente** a partir dos schemas Zod:

### Como funciona
1. **Schemas Zod** são definidos em `src/infrastructure/http/schemas/`
2. **@asteasolutions/zod-to-openapi** converte para OpenAPI 3.1
3. **Swagger UI** renderiza a interface web

### Exemplo de Schema
```typescript
export const pokemonResponseSchema = z
  .object({
    id: z.number(),
    tipo: z.string(),
    treinador: z.string(), 
    nivel: z.number()
  })
  .meta({
    name: 'GetPokemonResponseSchema',
    description: 'Lista um registro da tabela de pokémons.'
  });
```

### Acessar Documentação
- **Web UI**: http://localhost:3001/docs (tema Dracula 🧛‍♂️)
- **JSON**: http://localhost:3001/docs.json
- **Tema customizado** com `swagger-themes`

## 🗂️ Requests (REST Client)

Para desenvolvedores que usam **VS Code REST Client**, temos arquivos `.http` prontos:

### Instalar extensão
```
ext install humao.rest-client
```

### Arquivos disponíveis
- `requests/pokemons.http` - Todas as operações CRUD
- `requests/docs.http` - Acesso à documentação

### Exemplo de uso
```http
### Listar Pokémons
GET http://localhost:3001/api/v1/pokemons
Content-Type: application/json

### Criar Pokémon  
POST http://localhost:3001/api/v1/pokemons
Content-Type: application/json

{
  "type": "Pikachu",
  "trainer": "Ash Ketchum"
}
```

## 🐳 Docker

### Desenvolvimento
```bash
# Build e run completo
npm run docker:dev

# Ou separadamente
npm run docker:build:dev
npm run docker:run:dev
```

### Produção
```bash
# Build e run para produção
npm run docker:prod

# Build otimizado sem dev dependencies
npm run docker:build:prod
npm run docker:run:prod
```

### Banco de dados
```bash
# Subir PostgreSQL com PostGIS
npm run docker:db:up

# Parar banco
npm run docker:db:down
```

### Multi-stage Build
O `Dockerfile` usa **multi-stage build**:
- **Base**: Instala dependências base
- **Development**: Mantém dev dependencies, hot-reload
- **Production**: Remove dev deps, build otimizado

## 🚀 CI/CD

Pipeline GitHub Actions incluído em `.github/workflows/ci-cd.yml`:

### Features
- ✅ **Testes** automatizados (unit + e2e)
- ✅ **Linting** com ESLint + architectural boundaries
- ✅ **Build** Docker multi-stage  
- ✅ **Registry** GitHub Container Registry
- ✅ **Deploy** automatizado (main branch)

### Workflow
```yaml
test → build → deploy
 ├── Unit Tests
 ├── E2E Tests  
 ├── ESLint
 ├── Coverage Report
 └── Docker Build & Push
```

### Configuração
1. Enable GitHub Actions no repositório
2. Configure secrets se necessário
3. Push para `main` triggera deploy

## 📁 Estrutura do Projeto

```
pokedex/
├── 📁 src/
│   ├── 🟢 core/                    # Domínio
│   │   ├── entities/               # Entidades de negócio
│   │   ├── exceptions/             # Exceções customizadas
│   │   └── services/               # Serviços de domínio
│   │
│   ├── 🔵 application/             # Camada de Aplicação  
│   │   ├── mappers/                # Transformação de dados
│   │   ├── ports/                  # Interfaces/contratos
│   │   ├── services/               # Serviços de aplicação
│   │   └── use-cases/              # Casos de uso
│   │
│   ├── 🟡 adapters/                # Adaptadores
│   │   ├── http/                   # Express, OpenAPI
│   │   └── logger/                 # Logger customizado
│   │
│   ├── 🟠 infrastructure/          # Infraestrutura
│   │   ├── bootstrap/              # Configuração da app
│   │   ├── database/               # Prisma, repositories
│   │   ├── factories/              # Dependency injection
│   │   └── http/                   # Routes, schemas, middlewares
│   │
│   └── ⚪ shared/                  # Utilitários
│
├── 📁 requests/                    # REST Client files
├── 📁 tests/                       # Testes E2E
├── 📁 .github/workflows/           # CI/CD GitHub Actions
└── 📋 docker-compose.yml           # PostgreSQL + PostGIS
```

### Camadas e Responsabilidades

#### 🟢 Core (Domínio)
- **Entities**: `Pokemon` - regras de negócio puras
- **Exceptions**: `NotFoundException`, `ValidationException`
- **Domain Services**: Lógicas complexas de domínio

#### 🔵 Application (Casos de Uso)
- **Use Cases**: `CreatePokemon`, `BattlePokemon` - orquestração
- **Ports**: Interfaces para repositories e services
- **Mappers**: Transformação entre camadas

#### 🟡 Adapters (Implementações)
- **HTTP**: `ExpressAdapter` - servidor web
- **Logger**: `LoggerAdapter` - logging customizado  
- **OpenAPI**: Geração automática de docs

#### 🟠 Infrastructure (Configuração)
- **Database**: Prisma ORM + PostgreSQL
- **HTTP Routes**: Definição de endpoints
- **Factories**: Dependency injection manual
- **Bootstrap**: Inicialização da aplicação

## 🛠️ Scripts Disponíveis

### Development
- `npm run dev` - Servidor desenvolvimento com hot-reload
- `npm run dev --env=staging --log=debug` - Com configurações customizadas

### Database  
- `npm run prisma:generate` - Gera cliente Prisma
- `npm run prisma:push` - Sincroniza schema com BD
- `npm run prisma:studio` - Interface visual do BD

### Testing
- `npm run test` - Testes com coverage
- `npm run test:watch` - Testes em modo watch
- `npm run test:e2e` - Testes end-to-end

### Build & Deploy
- `npm run build` - Build para produção
- `npm start` - Executa versão buildada

### Docker
- `npm run docker:db:up/down` - Gerencia banco PostgreSQL
- `npm run docker:dev/prod` - Build e run da aplicação

---

## 📝 Notas Importantes

### Validação Automática
- **Zod schemas** validam requests automaticamente
- **OpenAPI** é gerado dos mesmos schemas
- **Type safety** em todo o pipeline

### Architectural Boundaries
- **ESLint plugin** impede imports incorretos entre camadas
- **Core/Application** não pode importar infraestrutura
- Mantém arquitetura hexagonal íntegra

### Environment Variables
- `.env.development` - Desenvolvimento
- `.env.staging` - Staging  
- `.env.test` - Testes
- `.env.production` - Produção (não versionado)

---

Desenvolvido com ❤️ usando Arquitetura Hexagonal + TypeScript

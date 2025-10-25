## Desafio Backend - Pokémon

Olá, o seu desafio está dividido em duas partes; elaborar um **CRUD simples de pokémons** (onde será avaliada sua habilidade de estruturar uma aplicação e sua lógica de acesso a dados), e um algoritmo de batalhas entre eles (onde será avaliada sua lógica de programação).

Por favor utilize estritamente a estrutura de dados abaixo pois temos um client para testar seu desafio.

---

### 1ª PARTE - CRUD SIMPLES (Vale 7 pontos)

O crud de pokémons deve contemplar cinco operações: **CRIAR, ALTERAR, DELETAR, CARREGAR e LISTAR**.

#### 1.1. CRIAR

Cria um registro na tabela de pokémons. O servidor deve retornar um erro quando informado tipo diferente de "charizard", "mewtwo" ou "pikachu". Todo pokémon ao ser inserido inicia com nível 1.

REQUEST 
##### `POST /pokemons`

```json
{
  "tipo": "pikachu",
  "treinador": "Thiago"
}
```

###### RETORNO `201 - Created`

```json
{
  "id": 1,
  "tipo": "pikachu",
  "treinador": "Thiago",
  "nivel": 1
}
```

#### 1.2. ALTERAR

Apenas a propriedade `treinador` pode ser alterada.

REQUEST
##### PUT `/pokemons/:id`

```json
{
  "treinador": "Thiago"
}
```

###### RETORNO `204 No Content`

#### 1.3. DELETAR

REQUEST 
##### DELETE `/pokemons/:id`

###### RETORNO `204 No Content`

#### 1.4. CARREGAR

REQUEST

##### GET `/pokemons/:id`

###### RETORNO `200 - Ok`

```json
{
  "id": 1,
  "tipo": "pikachu",
  "treinador": "Thiago",
  "nivel": 1
}
```

#### 1.5. LISTAR

REQUEST

##### GET `/pokemons`

###### RETORNO `200 - Ok`

```json
[{
  "id": 1,
  "tipo": "pikachu",
  "treinador": "Thiago",
  "nivel": 1
}, {
  "id": 2,
  "tipo": "charizard",
  "treinador": "Renato",
  "nivel": 1
}]
```

---

### 2ª PARTE - BATALHA (Vale 3 pontos)

Você deve criar um endpoint que recebe o id de dois pokémons e efetua uma batalha entre eles, incrementando em 1 o nível do pokémon vencedor e decrementando em 1 o nível do pokémon perdedor. Caso o pokémon perdedor chegue ao nível 0, significa que ele morreu e portanto precisa ser deletado da tabela.

O algoritmo que determina o pokémon vencedor deve ser aleatório, levando em conta uma probabilidade maior para o pokémon com nível maior. Ou seja, em uma batalha entre um pokémon A nível 1 contra um pokémon B nível 2, as chances do pokémon nível dois ganhar é igual a 2/3 (66%). Pokémons com os mesmos níveis devem ter probabilidades iguais de ganhar. Os níveis dos pokémons devem ser atualizados na tabela de pokémons.

REQUEST
##### POST `/batalhar/:pokemonAId/:pokemonBId`

###### RETORNO `200 - Ok`

```json
{
  "vencedor": {
    "id": 1,
    "tipo": "pikachu",
    "treinador": "Thiago",
    "nivel": 2 // Subiu de nível
  },
  "perdedor": {
    "id": 2,
    "tipo": "charizard",
    "treinador": "Renato",
    "nivel": 0 // Morreu e foi deletado da tabela
  }
}
```

---

#### Qual banco de dados devo utilizar?

Você define.
#### O que devo utilizar?

1. nodejs
#### Como entrego o desafio?

Você pode publicar em um repositório público no GitHub ou enviar um arquivo zip por email.

>Seu README deve conter todos os dados necessários e comandos para testar o projeto.

---

### Opcionais

Para acumular mais pontos você pode opcionalmente:

1. Fazer o upload da aplicação já funcionando em uma conta gratuita de qualquer serviço online (+1 ponto).
2. Implementar testes unitários (+1 ponto).
3. Implementar testes de integração (+2 pontos).
4. Implementar observabilidade (+2 pontos).
5. Implementar documentação automática da API (+3 pontos). 
6. Implementar interface para interação com as APIs(+3 pontos).
7. Implementar CI/CD (+3 pontos)

---

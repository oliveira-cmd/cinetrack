## 🎬 CineTrack API

API para gerenciar e acompanhar filmes assistidos, avaliados e recomendados.

### Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [ Instalação](#-instalação)
- [Executando o projeto](#-executando-o-projeto)
- [Endpoints da API](#-endpoints-da-api)
- [Licença](#-licença)

## Sobre o projeto

O **CineTrack** é uma API REST que permite que usuários gerenciem seus filmes, alterem seus status (ex.: "a assistir", "assistido", "avaliado", "recomendado", "não recomendado") e acompanhem logs e históricos.

A documentação da API pode ser acessada via **Swagger UI** em:

``` http://localhost:3000/api-docs ```

## Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT (JSON Web Token)](https://jwt.io/)
- [Docker](https://www.docker.com/)
- [Swagger](https://swagger.io/)

## Instalação

### 1. Clonar o repositório:

```sh
    git clone https://github.com/oliveira-cmd/cinetrack.git
    cd cinetrack
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no arquivo `.env.example`

## Executando o projeto

### Rodando localmente

1️⃣ Instale as dependências:

```sh
    npm install
```

2️⃣ Inicie o servidor:

```sh
    npm run dev
```

### Rodando com Docker

Construa a imagem Docker:

```sh
    docker-compose up --build -d
```

Acesse a API:

``` http://localhost:3000 ```

## Endpoints da API

### Autenticação

- `GET /user`: Cria um usuario
- `GET /token`: Gera um token de autenticação a partir de um usuario existente no sistema

### Filmes

- `GET /filme`: Retorna todos os filmes cadastrados
- `POST /filme`: Adiciona um novo filme
- `GET /filme/{id}`: Obtém um filme específico
- `PUT /filme/{id}/{status}`: Atualiza o status do filme
- `POST /filme/{id}/{rating}`: Avalia um filme

### Logs

- `GET /logs`: Obtém todos os logs do sistema

### Historico

- `GET /historico/{id}`: Obtém o histórico de um filme

## Licença

Este projeto é distribuído sob a licença **MIT**.
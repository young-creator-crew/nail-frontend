# Frontend

Aplicação React com Vite preparada para desenvolvimento seguindo a arquitetura
Feature-Sliced Design.

## Estrutura

```text
src/
├── app/       # Inicialização e composição global
├── pages/     # Páginas
├── widgets/   # Blocos compostos de interface
├── features/  # Interações e comportamentos
├── entities/  # Domínios e modelos
└── shared/    # Recursos reutilizáveis
```

As camadas podem ser preenchidas conforme as funcionalidades forem desenvolvidas.

## Página Meus serviços

A página `/meus-servicos` carrega os serviços reais de `GET /procedures` na API.
Configure `VITE_API_BASE_URL` no arquivo `.env` (veja `.env.example`) com a URL
base do backend, por exemplo `http://localhost:8080`. A resposta precisa ser uma
lista com `id`, `name`, `description`, `price`, `estimatedDurationMinutes` e
`imageUrl`.

Os formulários usam `POST /procedures` com `multipart/form-data` (campos
`name`, `description`, `price`, `estimatedDurationMinutes` e `image`), `GET` e
`PUT /procedures/{id}`, `PUT /procedures/{id}/image` e `DELETE /procedures/{id}`.
A duração continua obrigatória conforme a validação da API.
As telas administrativas usam o prefixo `/admin`: `/admin`,
`/admin/agenda`, `/admin/servicos`, `/admin/perfil`,
`/admin/meus-servicos`, `/admin/meus-servicos/adicionar` e
`/admin/meus-servicos/editar?id={id}`. As rotas sem esse prefixo são
reservadas às personas públicas e clientes.

## Comandos

```bash
npm run dev
npm run build
npm run lint
```

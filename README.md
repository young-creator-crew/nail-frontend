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

A página `/admin/meus-servicos` carrega os serviços de `GET /services/admin` na API.
Configure `VITE_API_BASE_URL` no arquivo `.env` (veja `.env.example`) com a URL
base do backend, por exemplo `http://localhost:8080`. A resposta precisa ser uma
lista com `idNailService`, `serviceName`, `serviceDescription`, `options`
(com `price` e `durationMinutes`) e `photoUrl`.

Os formulários usam `POST /services` e `PUT /services/{id}` com
`multipart/form-data` (campo `service` contendo JSON e imagem opcional `foto`).
A edição carrega `GET /services/{id}`; a desativação usa
`PATCH /services/{id}/deactivate`.
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

## Integração provisória de agendamentos

O frontend permite consultar, criar, remarcar e cancelar agendamentos usando um
contrato provisório, ainda não confirmado para o backend definitivo. A integração
fica desativada por padrão e em produção; quando ativada, aceita somente uma API
local e verifica sua identidade antes de cada operação.

Para habilitá-la em desenvolvimento, configure `VITE_APPOINTMENTS_ENABLED`,
`VITE_APPOINTMENTS_API_BASE_URL`, `VITE_APPOINTMENTS_HEALTH_PATH` e
`VITE_APPOINTMENTS_API_IDENTITY` junto de `VITE_API_BASE_URL`. Os dois endereços
devem corresponder e a verificação de saúde deve retornar um campo `service`
igual à identidade configurada. O caminho dos agendamentos pode ser ajustado por
`VITE_API_APPOINTMENTS_PATH`.

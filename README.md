<div align="center">

# Loterias — Resultados em tempo real e gestão de apostas

[![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![tRPC](https://img.shields.io/badge/tRPC-2596BE?logoColor=white)](https://trpc.io)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0C0C0C?logoColor=white)](https://orm.drizzle.team)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org)

Aplicação Next.js que consulta a API pública das loterias (CAIXA) e oferece UX acessível e responsiva, validação de dados na borda, cache de requisições e backend com tRPC/Drizzle integrado ao app.

</div>

---

## Sumário

- [Visão geral](#visão-geral)
- [Arquitetura e Stack](#arquitetura-e-stack)
- [Requisitos](#requisitos)
- [Configuração e execução](#configuração-e-execução)
- [Banco de dados e migrações](#banco-de-dados-e-migrações)
- [API e integração](#api-e-integração)
- [Testes](#testes)
- [Scripts disponíveis](#scripts-disponíveis)
- [Padrões de código e qualidade](#padrões-de-código-e-qualidade)
- [Roadmap](#roadmap)
- [Licença](#licença)
- [Contato](#contato)

---

## Visão geral

Interface para consulta de resultados por loteria, com filtros por concurso e data, exibição do status do prêmio (acumulado ou não), últimos concursos, locais ganhadores quando disponíveis e estados de carregamento amigáveis. O projeto aplica práticas de acessibilidade (ARIA, navegação por teclado, `aria-live`, respeito ao `prefers-reduced-motion`) e prioriza mobile-first com navegação inferior estilo app.

Principais pontos:

- UX responsiva e consistente (mobile/desktop) com microinterações.
- Acessibilidade real (semântica, teclado, live region, motion-reduce).
- Validação de respostas da API com Zod e cache com TanStack Query.
- Backend tRPC integrado ao Next.js e ORM com Drizzle/PostgreSQL.

---

## Arquitetura e Stack

Stack principal:

- Next.js 15 (App Router) · React 19 · TypeScript 5
- Tailwind CSS 4
- TanStack React Query 5
- Zod (validação de dados)
- tRPC 11 (API no Next.js)
- Drizzle ORM (mapeamento relacional)
- PostgreSQL

Estrutura (visão resumida):

```
src/
  app/
    layout.tsx        # Shell do app, header/rodapé (nav mobile)
    page.tsx          # Home (Hero + ResultsExplorer)
  components/
    Hero.tsx
    hero.module.css
    ResultsExplorer.tsx
  lib/
    api/loterias.ts   # Cliente da API pública + schemas Zod
  server/
    api/trpc.ts       # Inicialização do tRPC
    db/schema.ts      # Schema do Drizzle
  styles/
    globals.css
```

---

## Requisitos

- Node.js 18+ ou 20+
- PostgreSQL (13+ recomendado) acessível via `DATABASE_URL`

---

## Configuração e execução

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente em `.env.local` (exemplo):

```env
DATABASE_URL=postgres://usuario:senha@localhost:5432/loterias_challenge
```

3. Aplique as migrações do banco:

```bash
npm run db:migrate
```

4. Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Para build e execução em produção local:

```bash
npm run preview
```

---

## Banco de dados e migrações

- ORM: Drizzle
- Configuração: `drizzle.config.ts` (usa `DATABASE_URL` via `@t3-oss/env-nextjs`)
- Principais comandos:

```bash
npm run db:generate   # gera diffs de migração a partir do schema
npm run db:migrate    # aplica migrações no banco apontado por DATABASE_URL
npm run db:push       # sincroniza schema -> banco (sem gerar arquivos de migração)
npm run db:studio     # visualização do schema (quando aplicável)
npm run db:reset      # reset local (script utilitário + migrate)
```

Observação: este projeto não exige Docker; espera um PostgreSQL acessível localmente ou em rede.

---

## API e integração

- API pública (CAIXA): base `https://loteriascaixa-api.herokuapp.com/api`
- Endpoints utilizados:
  - `GET /{loteria}/latest` — último resultado
  - `GET /{loteria}` — histórico (base para últimos concursos)
  - `GET /{loteria}/{concurso}` — resultado por concurso
- As respostas são validadas com Zod e mapeadas para tipos internos (ex.: `dataISO`, `dezenas: number[]`).
- Backend em tRPC é inicializado em `src/server/api/trpc.ts` e exposto pelo Next.js.

---

## Testes

- Framework: Vitest
- Configuração: `vitest.config.ts` (ambiente Node, inclui `src/**/*.test.ts`)

Como executar:

```bash
npm run test      # modo watch
npm run test:run  # execução única (CI)
```

---

## Scripts disponíveis

```bash
npm run dev            # desenvolvimento (Next.js)
npm run build          # build de produção
npm run start          # iniciar servidor após build
npm run preview        # build + start

npm run lint           # ESLint
npm run lint:fix       # ESLint com correções
npm run typecheck      # verificação TypeScript
npm run check          # lint + tsc

npm run format:check   # Prettier (verificação)
npm run format:write   # Prettier (escrita)

npm run test           # Vitest (watch)
npm run test:run       # Vitest (CI)

npm run db:generate    # Drizzle generate
npm run db:migrate     # Drizzle migrate
npm run db:push        # Drizzle push
npm run db:studio      # Drizzle studio
npm run db:reset       # Reset local + migrate
```

---

## Padrões de código e qualidade

- Linguagem: TypeScript (strict)
- Lint: ESLint (config Next + plugin Drizzle)
- Formatação: Prettier (+ plugin Tailwind)
- Estilo: componentes coesos, tipagem explícita e validação de dados na borda
- Acessibilidade: semântica ARIA, navegação por teclado, `aria-live`, motion-reduce

---

## Roadmap

- UI completa para CRUD de apostas sobre o backend tRPC/Drizzle
- Ampliação de cobertura de testes (unitários e integração)
- Toasts de erro, retry e métricas
- Tema dinâmico e tokens de design

---

## Licença

Este projeto é distribuído sob a licença MIT. Consulte `LICENSE` para mais detalhes.

---

## Contato

**Tiago Luvizoto Neves** — Desenvolvedor Full Stack  
📫 `tiagoluvizotoneves@gmail.com`

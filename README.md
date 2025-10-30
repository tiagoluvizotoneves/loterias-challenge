
# Desafio Frontend Rybená

Este repositório contém o desafio de frontend da Rybená, utilizando o T3 Stack (Next.js, tRPC, Drizzle, PostgreSQL, Tailwind CSS, React Query).

## Visão Geral

O objetivo é construir um sistema de loterias consumindo a API pública brasileira de loterias, além de implementar um CRUD para apostas de Mega-Sena, salvando os dados no banco de dados local do projeto.

## O que você deve fazer

- Listar resultados de loterias (Mega-Sena, Quina, etc.) consumindo a API pública: https://github.com/guto-alves/loterias-api
- Exibir detalhes do concurso
- Permitir filtros e buscas por concurso, data ou tipo de loteria
- Implementar um CRUD completo para apostas de Mega-Sena (criar, listar, editar e remover apostas salvas no banco)
- Criar uma tabela para armazenar apostas de Mega-Sena (veja sugestão de modelagem abaixo)
- Design responsivo e experiência agradável

## Exemplo de modelagem para apostas Mega-Sena

```
id: number (PK)
numeros: number[] (array de 6 números apostados)
data_aposta: date
nome_apostador: string (opcional)
```

## Dicas e informações

- O projeto já possui um exemplo de schema "posts" e um router "posts" para servir de base para suas chamadas e modelagem.
- O backend já está configurado para você criar o CRUD das apostas.
- Não existe um arquivo Figma fornecido. Use sua criatividade para o visual e fluxo do sistema (cores, tipografia e hierarquia).

## Entrega sugerida

- URL do projeto no GitHub
- README explicando como rodar o projeto
- Página de listagem de loterias
- Página de detalhe do concurso
- CRUD de apostas Mega-Sena

## Tecnologias utilizadas

- [Next.js](https://nextjs.org)
- [tRPC](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query (TanStack Query)](https://tanstack.com/query/latest/docs/react)


## Como rodar o projeto

1. Instale as dependências:
	```bash
	bun install
	# ou
	npm install
	```
2. Configure as variáveis de ambiente conforme necessário.
3. Rode as migrations do banco de dados (Drizzle) usando os scripts do package.json:
	```bash
	# Gerar uma nova migration a partir do schema
	bun run db:generate

	# Aplicar as migrations no banco
	bun run db:push

	# (Opcional) Rodar as migrations de forma incremental
	bun run db:migrate

	# (Opcional) Abrir o Drizzle Studio para visualizar o banco
	bun run db:studio
	```
	> Dica: consulte a documentação do Drizzle e ajuste os comandos conforme o banco configurado (ex: `sqlite`, `postgres`, etc). Estes scripts também podem ser executados com `npm run ...` se preferir.
4. Inicie o projeto:
	```bash
	bun dev
	# ou
	npm run dev
	```

---

Qualquer dúvida, fique à vontade para abrir uma issue ou entrar em contato.

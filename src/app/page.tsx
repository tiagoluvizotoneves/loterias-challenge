export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-800 bg-linear-to-b text-white">
      <div className="container flex flex-col items-start justify-center gap-8 px-12 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Desafio Frontend <span className="text-sky-400">Rybená</span>
        </h1>

        <p className="max-w-3xl text-lg">
          Bem-vindo(a)! Neste desafio você vai construir um sistema de loterias
          consumindo a API pública brasileira de loterias. A ideia é listar
          sorteios, mostrar os números sorteados, permitir pesquisas por
          concurso, data ou tipo de loteria, e implementar um CRUD para salvar
          no banco de dados um jogo de Mega-Sena.
        </p>

        <ul className="list-disc space-y-2 pl-5 text-lg">
          <li>Exibir resultados de loterias (Mega-Sena, Quina, etc.)</li>
          <li>Detalhes do concurso</li>
          <li>Filtrar e buscar</li>
          <li>
            CRUD completo para jogos de Mega-Sena (criar, listar, editar e
            remover apostas salvas no banco)
          </li>
          <li>Design responsivo e experiência agradável</li>
        </ul>

        <div className="mt-6 flex gap-4">
          <a
            href="https://github.com/guto-alves/loterias-api"
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-white/10 px-4 py-2 hover:bg-white/20"
          >
            Documentação da API
          </a>
        </div>

        <div className="mt-6 max-w-2xl text-sm text-white/70">
          Dica: o repositório da API é público —
          https://github.com/guto-alves/loterias-api . Você pode usar fetch/trpc
          para obter os resultados. Há um pequeno exemplo de schema "posts" e um
          router "posts" já implementados no código para servir de base para
          suas chamadas e modelagem.
          <br />
          <br />
          <strong>CRUD Mega-Sena:</strong> Você deverá criar uma tabela para
          armazenar apostas de jogos da Mega-Sena, com as operações de criar,
          listar, editar e remover apostas. <br />
          <br />
          <strong>Sugestão de modelagem:</strong>
          <pre className="mt-2 overflow-x-auto rounded bg-neutral-900 p-2 text-xs">
            id: number (PK) numeros: number[] (array de 6 números apostados)
            data_aposta: date nome_apostador: string (opcional)
          </pre>
          <br />
          Sugestão de páginas a criar: listagem de loterias, detalhe do
          concurso, CRUD de apostas Mega-Sena.
        </div>

        <div className="mt-6 max-w-2xl rounded-md border-l-4 border-purple-400 bg-white/5 p-4 text-sm text-white/90">
          <strong className="mb-1 block">Observações importantes</strong>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Lembre-se: este é um desafio <strong>FRONT-END</strong>. A API
              pública já está disponível — foque na interface, experiência e na
              qualidade do código. O backend já está configurado para você criar
              o CRUD das apostas.
            </li>
            <li>
              Não existe um arquivo Figma fornecido. Use sua criatividade para o
              visual e fluxo do sistema (cores, tipografia e hierarquia).
            </li>
            <li>
              Entrega sugerida: URL do projeto no github com um README
              explicando como rodar o projeto, uma página de listagem de
              loterias, uma página de detalhe do concurso e o CRUD de apostas
              Mega-Sena.
            </li>
          </ul>
        </div>

        <div className="mt-6 max-w-2xl rounded-md border-l-4 border-sky-400 bg-white/5 p-4 text-sm text-white/90">
          <strong className="mb-1 block">Stack e documentação</strong>
          <p className="mb-2">
            Uso de UI libs é liberado. Este projeto usa o T3 Stack — front-end
            em Next.js e back-end em Node com tRPC, Drizzle e PostgreSQL. Também
            usamos React Query (TanStack Query) para cache e gerenciamento de
            dados assíncronos. Links oficiais:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <a
                href="https://create.t3.gg/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Create T3 App
              </a>{" "}
              — scaffold do projeto
            </li>
            <li>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Next.js
              </a>{" "}
              — documentação do front-end
            </li>
            <li>
              <a
                href="https://nodejs.org/en/docs/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Node.js
              </a>{" "}
              — runtime/back-end
            </li>
            <li>
              <a
                href="https://trpc.io/docs"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                tRPC
              </a>{" "}
              — comunicação entre front e back
            </li>
            <li>
              <a
                href="https://orm.drizzle.team/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Drizzle ORM
              </a>{" "}
              — ORM usado no back-end
            </li>
            <li>
              <a
                href="https://www.postgresql.org/docs/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                PostgreSQL
              </a>{" "}
              — documentação do banco de dados
            </li>
            <li>
              <a
                href="https://tanstack.com/query/latest/docs/react"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                React Query (TanStack Query)
              </a>{" "}
              — cache e gerenciamento de estado de servidor
            </li>
            <li>
              <a
                href="https://tailwindcss.com/docs"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Tailwind CSS
              </a>{" "}
              — utilitário de estilos (usado no projeto)
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

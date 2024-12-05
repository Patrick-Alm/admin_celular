import { Proposta } from "@/app/api/propostas/route";
import { Cliente } from "@/app/api/clientes/route";
import { Celular } from "@/app/api/celulares/route";
import { AppContainer } from "@/components/app-container";
import { AppHeader } from "@/components/app-header";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeletePropostaDialog } from "./components/delete-proposta-dialog";
import { AnswerPropostaDialog } from "./components/answer-proposta-dialog";

export default async function Page() {
  const [propostasRes, clientesRes, celularesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas`, {
      cache: 'no-store'
    }),
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes`, {
      cache: 'no-store'
    }),
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/celulares`, {
      cache: 'no-store'
    })
  ]);

  const [propostas, clientes, celulares]: [Proposta[], Cliente[], Celular[]] = await Promise.all([
    propostasRes.json(),
    clientesRes.json(),
    celularesRes.json()
  ]);

  return (
    <main>
      <AppHeader label="Propostas" path="/app/propostas" />
      <AppContainer>
        <section>
          <Table>
            <TableCaption>Lista de Propostas</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Celular</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Resposta</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propostas.map((proposta) => (
                <TableRow key={proposta.id}>
                  <TableCell>{proposta.cliente.nome}</TableCell>
                  <TableCell>{proposta.celular.modelo}</TableCell>
                  <TableCell>{proposta.descricao}</TableCell>
                  <TableCell>{proposta.resposta || "Sem resposta"}</TableCell>
                  <TableCell>
                    <AnswerPropostaDialog proposta={proposta} />
                    <DeletePropostaDialog proposta={proposta} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </AppContainer>
    </main>
  )
}

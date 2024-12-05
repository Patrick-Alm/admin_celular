import { Cliente } from "@/app/api/clientes/route";
import { AppContainer } from "@/components/app-container";
import { AppHeader } from "@/components/app-header";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreateClienteDialog } from "./components/create-cliente-dialog";
import { EditClienteDialog } from "./components/edit-cliente-dialog";
import { DeleteClienteDialog } from "./components/delete-cliente-dialog";

export default async function Page() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes`, {
    cache: 'no-store'
  })

  const clientes: Cliente[] = await response.json()

  return (
    <main>
      <AppHeader label="Clientes" path="/clientes" />
      <AppContainer>
        <section className="text-end">
          {/* <CreateClienteDialog /> */}
        </section>
        <section>
          <Table>
            <TableCaption>Lista de Clientes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{new Date(cliente.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <EditClienteDialog cliente={cliente} />
                    <DeleteClienteDialog cliente={cliente} />
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

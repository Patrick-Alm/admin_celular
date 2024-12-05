import { Marca } from "@/app/api/marcas/route";
import { AppContainer } from "@/components/app-container";
import { AppHeader } from "@/components/app-header";
import { CreateMarcaDialog } from "./components/create-marca-dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { EditMarcaDialog } from "./components/edit-marca-dialog";
import { DeleteMarcaDialog } from "./components/delete-marca-dialog";

export default async function Page() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/marcas`, {
    cache: 'no-store'
  })

  const marcas: Marca[] = await response.json()

  return (
    <main>
      <AppHeader label="Marcas" path="/app/marcas" />
      <AppContainer>
        <section className="text-end">
          <CreateMarcaDialog />
        </section>
        <section>
          <Table>
            <TableCaption>Lista de Marcas</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marcas.map((marca) => (
                <TableRow key={marca.id}>
                  <TableCell>{marca.nome}</TableCell>
                  <TableCell>
                    <EditMarcaDialog marca={marca} />
                    <DeleteMarcaDialog marca={marca} />
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

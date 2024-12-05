import { Celular } from "@/app/api/celulares/route";
import { Marca } from "@/app/api/marcas/route";
import { AppContainer } from "@/components/app-container";
import { AppHeader } from "@/components/app-header";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreateCelularDialog } from "./components/create-celular-dialog";
import { EditCelularDialog } from "./components/edit-celular-dialog";
import { DeleteCelularDialog } from "./components/delete-celular-dialog";
import Image from "next/image";
import { Smartphone } from "lucide-react";

export default async function Page() {
  const [celularesRes, marcasRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/celulares`, {
      cache: 'no-store'
    }),
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/marcas`, {
      cache: 'no-store'
    })
  ]);

  const [celulares, marcas]: [Celular[], Marca[]] = await Promise.all([
    celularesRes.json(),
    marcasRes.json()
  ]);

  return (
    <main>
      <AppHeader label="Celulares" path="/celulares" />
      <AppContainer>
        <section className="text-end">
          <CreateCelularDialog marcas={marcas} />
        </section>
        <section>
          <Table>
            <TableCaption>Lista de Celulares</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {celulares.map((celular) => (
                <TableRow key={celular.id}>
                  <TableCell>
                    {celular.foto ? <Image
                      src={celular.foto}
                      alt={celular.modelo}
                      width={50}
                      height={50}
                      className="rounded-md"
                    /> : <Smartphone size={50} />}
                  </TableCell>
                  <TableCell>{celular.modelo}</TableCell>
                  <TableCell>{celular.marca.nome}</TableCell>
                  <TableCell>{celular.ano}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(celular.preco)}
                  </TableCell>
                  <TableCell>
                    <EditCelularDialog celular={celular} marcas={marcas} />
                    <DeleteCelularDialog celular={celular} />
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

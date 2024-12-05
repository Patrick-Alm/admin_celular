import { Admin } from "@/app/api/admin/route"
import { AppContainer } from "@/components/app-container"
import { AppHeader } from "@/components/app-header"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreateAdminDialog } from "./components/create-admin-dialog"
import { EditAdminDialog } from "./components/edit-admin-dialog"
import { DeleteAdminDialog } from "./components/delete-admin-dialog"

export default async function Page() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/admin`, {
    cache: 'no-store'
  })

  const admins: Admin[] = await response.json()

  return (
    <main>
      <AppHeader label="Administradores" path="/admin" />
      <AppContainer>
        <section className="text-end">
          <CreateAdminDialog />
        </section>
        <section>
          <Table>
            <TableCaption>Lista de Administradores</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.nome}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <EditAdminDialog admin={admin} />
                    <DeleteAdminDialog admin={admin} />
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

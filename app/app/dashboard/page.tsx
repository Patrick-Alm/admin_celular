import { AppContainer } from "@/components/app-container"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Celular } from "@/app/api/celulares/route"
import { Cliente } from "@/app/api/clientes/route"
import { Proposta } from "@/app/api/propostas/route"
import { Marca } from "@/app/api/marcas/route"
import { DashboardCharts } from "./components/dashboard-charts"

export default async function Page() {
  // Fetch all necessary data
  const [celulares, clientes, propostas, marcas] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/celulares`).then(res => res.json()).catch((err) => {
      console.log('CELULAR ERROR', err)
      return []
    }),
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes`).then(res => res.json()).catch((err) => {
      console.log('CLIENTES ERROR', err)
      return []
    }),
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas`).then(res => res.json()).catch((err) => {
      console.log('PROPOSTAS ERROR', err)
      return []
    }),
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/marcas`).then(res => res.json()).catch((err) => {
      console.log('MARCAS ERROR', err)
      return []
    }),
  ]);

  // 1. Phones by brand chart data
  const phonesByBrand = marcas.map((marca: Marca) => ({
    name: marca.nome,
    quantidade: celulares.filter((cel: Celular) => cel.marcaId === marca.id).length
  }));

  // 2. Price range distribution
  const priceRanges = [
    { range: '0-1000', count: 0 },
    { range: '1001-2000', count: 0 },
    { range: '2001-3000', count: 0 },
    { range: '3000+', count: 0 },
  ];

  celulares.forEach((celular: Celular) => {
    if (celular.preco <= 1000) priceRanges[0].count++;
    else if (celular.preco <= 2000) priceRanges[1].count++;
    else if (celular.preco <= 3000) priceRanges[2].count++;
    else priceRanges[3].count++;
  });

  // 3. Proposals status
  const propostasStatus = [
    {
      name: 'Respondidas',
      value: propostas.filter((p: Proposta) => p.resposta).length
    },
    {
      name: 'Pendentes',
      value: propostas.filter((p: Proposta) => !p.resposta).length
    }
  ];

  return (
    <main>
      <AppHeader label="Dashboard" path="/dashboard" />
      <AppContainer>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Celulares</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{celulares.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{clientes.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Propostas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{propostas.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Marcas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{marcas.length}</p>
            </CardContent>
          </Card>
        </div>

        <DashboardCharts
          phonesByBrand={phonesByBrand}
          priceRanges={priceRanges}
          propostasStatus={propostasStatus}
        />
      </AppContainer>
    </main>
  )
}

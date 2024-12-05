'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Marca } from "@/app/api/marcas/route"

export function CreateCelularDialog({ marcas }: { marcas: Marca[] }) {
  const [open, setOpen] = useState(false)
  const [modelo, setModelo] = useState("")
  const [ano, setAno] = useState("")
  const [preco, setPreco] = useState("")
  const [foto, setFoto] = useState("")
  const [marcaId, setMarcaId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/celulares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelo,
          ano: parseInt(ano),
          preco: parseFloat(preco),
          foto,
          marcaId: parseInt(marcaId)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create celular')
      }

      setModelo("")
      setAno("")
      setPreco("")
      setFoto("")
      setMarcaId("")
      setOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('Error creating celular:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Celular</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo celular</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo celular
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Digite o modelo"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="ano">Ano</Label>
              <Input
                id="ano"
                type="number"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                placeholder="Digite o ano"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="preco">Preço</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="Digite o preço"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="foto">URL da Foto</Label>
              <Input
                id="foto"
                value={foto}
                onChange={(e) => setFoto(e.target.value)}
                placeholder="Digite a URL da foto"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="marca">Marca</Label>
              <Select value={marcaId} onValueChange={setMarcaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma marca" />
                </SelectTrigger>
                <SelectContent>
                  {marcas.map((marca) => (
                    <SelectItem key={marca.id} value={marca.id.toString()}>
                      {marca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar celular"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

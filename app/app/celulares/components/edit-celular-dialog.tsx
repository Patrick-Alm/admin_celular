'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit } from "lucide-react"
import { useState } from "react"
import { Celular } from "@/app/api/celulares/route"
import { Marca } from "@/app/api/marcas/route"

interface EditCelularDialogProps {
  celular: Celular
  marcas: Marca[]
}

export function EditCelularDialog({ celular, marcas }: EditCelularDialogProps) {
  const [open, setOpen] = useState(false)
  const [modelo, setModelo] = useState(celular.modelo)
  const [ano, setAno] = useState(celular.ano.toString())
  const [preco, setPreco] = useState(celular.preco.toString())
  const [foto, setFoto] = useState(celular.foto)
  const [marcaId, setMarcaId] = useState(celular.marcaId.toString())
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/celulares/${celular.id}`, {
        method: 'PUT',
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
        throw new Error('Failed to update celular')
      }

      setOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('Error updating celular:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost"><Edit /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar celular</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
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
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="foto">URL da Foto</Label>
              <Input
                id="foto"
                value={foto}
                onChange={(e) => setFoto(e.target.value)}
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
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

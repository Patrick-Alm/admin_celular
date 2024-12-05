'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from "lucide-react"
import { useState } from "react"
import { Marca } from "@/app/api/marcas/route"

interface EditMarcaDialogProps {
  marca: Marca
}

export function EditMarcaDialog({ marca }: EditMarcaDialogProps) {
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState(marca.nome)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/marcas/${marca.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome })
      })

      if (!response.ok) {
        throw new Error('Failed to update marca')
      }

      setOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('Error updating marca:', error)
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
          <DialogTitle>Editar marca</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="grid flex-1 gap-2 mb-5">
              <Label htmlFor="Nome">
                Nome
              </Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite a marca"
                disabled={isLoading}
              />
            </div>
            <div className="text-end">
              <Button type="submit" className="px-3" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

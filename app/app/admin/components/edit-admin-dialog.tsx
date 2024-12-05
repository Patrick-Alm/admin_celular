'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from "lucide-react"
import { useState } from "react"
import { Admin } from "@/app/api/admin/route"

interface EditAdminDialogProps {
  admin: Admin
}

export function EditAdminDialog({ admin }: EditAdminDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    nome: admin.nome,
    email: admin.email,
    senha: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const updateData = {
      nome: formData.nome,
      email: formData.email,
      ...(formData.senha && { senha: formData.senha })
    }

    try {
      const response = await fetch(`/api/admin/${admin.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error('Failed to update admin')
      }

      setOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('Error updating admin:', error)
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
          <DialogTitle>Editar administrador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="senha">Nova Senha (opcional)</Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Digite para alterar a senha"
                disabled={isLoading}
              />
            </div>
            <div className="text-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>z
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

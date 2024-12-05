'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function CreateMarcaDialog() {
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/marcas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome })
      })

      console.log(response)

      if (!response.ok) {
        throw new Error('Failed to create marca')
      }

      setNome("")
      setOpen(false)

      window.location.reload()
    } catch (error) {
      console.error('Error creating marca:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Marca</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar nova marca</DialogTitle>
          <DialogDescription>
            This action cannot be undone.This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
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
                {isLoading ? "Criando..." : "Criar marca"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog >
  )
}

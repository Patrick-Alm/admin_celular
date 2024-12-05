'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { MessageSquare } from "lucide-react"
import { useState } from "react"
import { Proposta } from "@/app/api/propostas/route"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface AnswerPropostaDialogProps {
  proposta: Proposta
}

export function AnswerPropostaDialog({ proposta }: AnswerPropostaDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resposta, setResposta] = useState(proposta.resposta || '')

  async function handleSubmit() {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/propostas/${proposta.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...proposta,
          resposta,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update proposta')
      }

      setOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('Error updating proposta:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost"><MessageSquare /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Responder Proposta</DialogTitle>
          <DialogDescription>
            Forneça uma resposta para a proposta do cliente {proposta.cliente.nome}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Descrição da Proposta</Label>
            <p className="text-sm text-gray-500">{proposta.descricao}</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="resposta">Resposta</Label>
            <Textarea
              id="resposta"
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              placeholder="Digite sua resposta..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Marca } from "@/app/api/marcas/route"
import Image from "next/image"
import { ImagePlus } from "lucide-react"

export function CreateCelularDialog({ marcas }: { marcas: Marca[] }) {
  const [open, setOpen] = useState(false)
  const [modelo, setModelo] = useState("")
  const [ano, setAno] = useState("")
  const [preco, setPreco] = useState("")
  const [marcaId, setMarcaId] = useState("")
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [additionalImages, setAdditionalImages] = useState<FileList | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0])
      const reader = new FileReader()
      reader.onload = (e) => {
        setMainImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  async function uploadMainImage(celularId: number) {
    if (!mainImage) return null;

    const formData = new FormData()
    formData.append('codigoFoto', mainImage)
    formData.append('descricao', `${modelo} - Main Image`)
    formData.append('celularId', celularId.toString())

    const response = await fetch('/api/fotos/main', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload main image')
    }

    return response.json()
  }

  async function uploadAdditionalImages(celularId: number) {
    if (!additionalImages) return;

    for (let i = 0; i < additionalImages.length; i++) {
      const formData = new FormData()
      formData.append('codigoFoto', additionalImages[i])
      formData.append('descricao', `${modelo} - Image ${i + 1}`)
      formData.append('celularId', celularId.toString())

      await fetch('/api/fotos', {
        method: 'POST',
        body: formData,
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const celularResponse = await fetch('/api/celulares', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelo,
          ano: parseInt(ano),
          preco: parseFloat(preco),
          marcaId: parseInt(marcaId),
        })
      })

      if (!celularResponse.ok) {
        throw new Error('Failed to create celular')
      }

      const celular = await celularResponse.json()

      if (mainImage) {
        await uploadMainImage(celular.id)
      }

      if (additionalImages && additionalImages.length > 0) {
        await uploadAdditionalImages(celular.id)
      }

      setModelo("")
      setAno("")
      setPreco("")
      setMarcaId("")
      setMainImage(null)
      setMainImagePreview(null)
      setAdditionalImages(null)
      setOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('Error:', error)
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
            {/* <div>
              <Label htmlFor="foto">URL da Foto</Label>
              <Input
                id="foto"
                value={foto}
                onChange={(e) => setFoto(e.target.value)}
                placeholder="Digite a URL da foto"
                disabled={isLoading}
              />
            </div> */}
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
            <div>
              <Label>Foto Principal</Label>
              <div className="mt-2 flex items-center gap-4">
                {mainImagePreview ? (
                  <Image
                    src={mainImagePreview}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-dashed">
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label>Fotos Adicionais</Label>
              <div className="mt-2">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setAdditionalImages(e.target.files)}
                  disabled={isLoading}
                />
              </div>
              {additionalImages && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {additionalImages.length} imagens selecionadas
                </p>
              )}
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

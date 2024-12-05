'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, ImagePlus, Loader2, Trash } from "lucide-react"
import { useState } from "react"
import { Celular } from "@/app/api/celulares/route"
import { Marca } from "@/app/api/marcas/route"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface EditCelularDialogProps {
  celular: Celular
  marcas: Marca[]
}

export function EditCelularDialog({ celular, marcas }: EditCelularDialogProps) {
  const [open, setOpen] = useState(false)
  const [modelo, setModelo] = useState(celular.modelo)
  const [ano, setAno] = useState(celular.ano.toString())
  const [preco, setPreco] = useState(celular.preco.toString())
  const [marcaId, setMarcaId] = useState(celular.marcaId.toString())
  const [newMainImage, setNewMainImage] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(
    celular.mainFoto ? `data:image/jpeg;base64,${celular.mainFoto.codigoFoto}` : null
  )
  const [additionalImages, setAdditionalImages] = useState<FileList | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [existingPhotos, setExistingPhotos] = useState(celular.fotos || [])

  function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setNewMainImage(e.target.files[0])
      const reader = new FileReader()
      reader.onload = (e) => {
        setMainImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  async function uploadMainImage(celularId: number) {
    if (!newMainImage) return null;

    const formData = new FormData()
    formData.append('codigoFoto', newMainImage)
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

  async function deletePhoto(photoId: number) {
    const response = await fetch(`/api/fotos/${photoId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete photo')
    }

    setExistingPhotos(existingPhotos.filter(photo => photo.id !== photoId))
  }

  async function setAsMainPhoto(photoId: number) {
    const response = await fetch(`/api/fotos/${photoId}/main`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ celularId: celular.id })
    })

    if (!response.ok) {
      throw new Error('Failed to set main photo')
    }

    const mainPhoto = existingPhotos.find(photo => photo.id === photoId)
    if (mainPhoto) {
      setMainImagePreview(`data:image/jpeg;base64,${mainPhoto.codigoFoto}`)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First update the celular basic info
      const response = await fetch(`/api/celulares/${celular.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelo,
          ano: parseInt(ano),
          preco: parseFloat(preco),
          marcaId: parseInt(marcaId)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update celular')
      }

      // Upload new main image if exists
      if (newMainImage) {
        await uploadMainImage(celular.id)
      }

      // Upload additional images if any
      if (additionalImages && additionalImages.length > 0) {
        await uploadAdditionalImages(celular.id)
      }

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
        <Button variant="ghost"><Edit /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar celular</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {/* Basic Info Fields */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Photo Management Section */}
            <div className="space-y-4">
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
                <Label>Fotos Existentes</Label>
                <div className="mt-2 grid grid-cols-4 gap-4">
                  {existingPhotos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <Image
                        src={`data:image/jpeg;base64,${photo.codigoFoto}`}
                        alt={photo.descricao}
                        width={100}
                        height={100}
                        className={cn(
                          "rounded-lg object-cover w-full h-24",
                          celular.mainFoto?.id === photo.id && "ring-2 ring-primary"
                        )}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => setAsMainPhoto(photo.id)}
                        >
                          <ImagePlus className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deletePhoto(photo.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Adicionar Novas Fotos</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setAdditionalImages(e.target.files)}
                  disabled={isLoading}
                />
                {additionalImages && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {additionalImages.length} novas imagens selecionadas
                  </p>
                )}
              </div>
            </div>

            <div className="text-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar alterações'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

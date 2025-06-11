"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Save, Upload, Trash2, Globe, LinkIcon } from "lucide-react"

interface EditProfileModalProps {
  user: any
  onClose: () => void
  onSave: (updates: any) => void
}

export function EditProfileModal({ user, onClose, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio)
  const [location, setLocation] = useState(user.location || "")
  const [website, setWebsite] = useState(user.website || "")
  const [status, setStatus] = useState(user.status || "")
  const [avatar, setAvatar] = useState(user.avatar)
  const [showGroupTags, setShowGroupTags] = useState(user.showGroupTags !== false)
  const [showStatus, setShowStatus] = useState(user.showStatus !== false)

  const handleSave = () => {
    onSave({
      name,
      bio,
      location,
      website,
      status,
      avatar,
      showGroupTags,
      showStatus,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="general">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="privacy">Privacidade</TabsTrigger>
              <TabsTrigger value="comments">Comentários</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-4">
              <div className="flex gap-6">
                <div className="w-1/3">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-32 h-32 border-4 border-blue-500">
                      <AvatarImage src={avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-4xl">{name[0]}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Alterar Avatar
                    </Button>
                  </div>
                </div>

                <div className="w-2/3 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">
                      Nome de Exibição
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-slate-300">
                      Status Personalizado
                    </Label>
                    <Input
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      placeholder="O que estás a pensar?"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-slate-300">
                      Biografia
                    </Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-slate-300 flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Localização
                      </Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Portugal"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-slate-300 flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" /> Website
                      </Label>
                      <Input
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://exemplo.com"
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6 mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Configurações de Privacidade</h3>

                <div className="space-y-4 p-4 bg-slate-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Mostrar tags de grupos</p>
                      <p className="text-sm text-slate-400">Exibir as tags dos grupos a que pertences no teu perfil</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="show-tags" className="sr-only">
                        Mostrar tags de grupos
                      </Label>
                      <input
                        type="checkbox"
                        id="show-tags"
                        checked={showGroupTags}
                        onChange={(e) => setShowGroupTags(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-600 text-blue-600 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Mostrar status personalizado</p>
                      <p className="text-sm text-slate-400">
                        Exibir o teu status personalizado para outros utilizadores
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="show-status" className="sr-only">
                        Mostrar status personalizado
                      </Label>
                      <input
                        type="checkbox"
                        id="show-status"
                        checked={showStatus}
                        onChange={(e) => setShowStatus(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-600 text-blue-600 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Perfil público</p>
                      <p className="text-sm text-slate-400">Permitir que qualquer pessoa veja o teu perfil completo</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="public-profile" className="sr-only">
                        Perfil público
                      </Label>
                      <input
                        type="checkbox"
                        id="public-profile"
                        defaultChecked
                        className="h-4 w-4 rounded border-slate-600 text-blue-600 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-6 mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Gerir Comentários</h3>
                <p className="text-slate-400">
                  Gerir os comentários no teu perfil. Podes eliminar comentários indesejados.
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-800 rounded-lg flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue-400 font-medium">João123</span>
                        <span className="text-xs text-slate-500">2 dias atrás</span>
                      </div>
                      <p className="text-slate-300">Ótimo jogador! Sempre disposto a ajudar a equipe.</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="p-4 bg-slate-800 rounded-lg flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue-400 font-medium">GamerGirl</span>
                        <span className="text-xs text-slate-500">1 semana atrás</span>
                      </div>
                      <p className="text-slate-300">Parabéns pelas conquistas no Cyberpunk! 🎉</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-slate-700">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Guardar Alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

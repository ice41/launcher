"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Upload, Trash2, Globe, LinkIcon, Camera, Shield, MessageSquare } from "lucide-react"

interface EditProfilePageProps {
  user: any
  onBack: () => void
  onSave: (updates: any) => void
}

export function EditProfilePage({ user, onBack, onSave }: EditProfilePageProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio,
    location: user.location || "",
    website: user.website || "",
    status: user.status || "",
    avatar: user.avatar,
    showGroupTags: user.showGroupTags !== false,
    showStatus: user.showStatus !== false,
    allowComments: user.allowComments !== false,
    profileVisibility: user.profileVisibility || "public",
  })

  const [comments] = useState([
    {
      id: "1",
      author: "João123",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "Ótimo jogador! Sempre disposto a ajudar a equipe.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      author: "GamerGirl",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "Parabéns pelas conquistas no Cyberpunk! 🎉",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      author: "ProPlayer2024",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "Vamos jogar CS2 juntos qualquer dia!",
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ])

  const handleSave = () => {
    onSave(formData)
    onBack()
  }

  const handleDeleteComment = (commentId: string) => {
    // Implementar lógica para eliminar comentário
    console.log("Eliminar comentário:", commentId)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "ontem"
    if (diffDays < 7) return `há ${diffDays} dias`
    if (diffDays < 30) return `há ${Math.ceil(diffDays / 7)} semanas`
    return `há ${Math.ceil(diffDays / 30)} meses`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Editar Perfil</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Avatar e Informações Básicas */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Informações do Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-32 h-32 border-4 border-blue-500">
                      <AvatarImage src={formData.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-4xl">{formData.name[0]}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Alterar Avatar
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">
                        Nome de Exibição
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-slate-300">
                        Status Personalizado
                      </Label>
                      <Input
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        placeholder="O que estás a pensar?"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-slate-300">
                        Biografia
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-slate-300 flex items-center gap-2">
                          <Globe className="w-4 h-4" /> Localização
                        </Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="Portugal"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-slate-300 flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" /> Website
                        </Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://exemplo.com"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configurações de Privacidade */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Configurações de Privacidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Mostrar tags de grupos</p>
                      <p className="text-sm text-slate-400">Exibir as tags dos grupos a que pertences no teu perfil</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.showGroupTags}
                      onChange={(e) => setFormData({ ...formData, showGroupTags: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-600 text-blue-600 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Mostrar status personalizado</p>
                      <p className="text-sm text-slate-400">
                        Exibir o teu status personalizado para outros utilizadores
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.showStatus}
                      onChange={(e) => setFormData({ ...formData, showStatus: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-600 text-blue-600 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Permitir comentários</p>
                      <p className="text-sm text-slate-400">Permitir que outros utilizadores comentem no teu perfil</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.allowComments}
                      onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-600 text-blue-600 focus:ring-blue-600"
                    />
                  </div>

                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <Label className="text-white font-medium mb-3 block">Visibilidade do perfil</Label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="visibility"
                          value="public"
                          checked={formData.profileVisibility === "public"}
                          onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value })}
                          className="text-blue-600"
                        />
                        <span className="text-slate-300">Público - Qualquer pessoa pode ver</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="visibility"
                          value="friends"
                          checked={formData.profileVisibility === "friends"}
                          onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value })}
                          className="text-blue-600"
                        />
                        <span className="text-slate-300">Apenas amigos</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="visibility"
                          value="private"
                          checked={formData.profileVisibility === "private"}
                          onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value })}
                          className="text-blue-600"
                        />
                        <span className="text-slate-300">Privado - Apenas eu</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gestão de Comentários */}
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Gerir Comentários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">
                  Gerir os comentários no teu perfil. Podes eliminar comentários indesejados.
                </p>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{comment.author[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-blue-400 font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-slate-500">{formatDate(comment.timestamp)}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-slate-300 text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas do Perfil */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nível</span>
                  <Badge className="bg-blue-600">{user.level}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amigos</span>
                  <span className="text-white">{user.friends}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jogos</span>
                  <span className="text-white">{user.gamesOwned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Conquistas</span>
                  <span className="text-white">{user.achievementsUnlocked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Membro desde</span>
                  <span className="text-white">{new Date(user.joinDate).getFullYear()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" onClick={onBack}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Guardar Alterações
          </Button>
        </div>
      </div>
    </div>
  )
}

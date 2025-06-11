"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save, Trash2, FolderOpen, Shield } from "lucide-react"

interface GamePropertiesModalProps {
  game: any
  onClose: () => void
  onSave: (gameId: string, updates: any) => void
  onUninstall: (gameId: string) => void
}

export function GamePropertiesModal({ game, onClose, onSave, onUninstall }: GamePropertiesModalProps) {
  const [localGame, setLocalGame] = useState({ ...game })
  const [launchOptions, setLaunchOptions] = useState(game.launchOptions || "")
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(game.cloudSyncEnabled || true)
  const [overlayEnabled, setOverlayEnabled] = useState(game.overlayEnabled || true)
  const [language, setLanguage] = useState(game.language || "Português (Portugal)")

  const handleSave = () => {
    onSave(game.id, {
      ...localGame,
      launchOptions,
      cloudSyncEnabled,
      overlayEnabled,
      language,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">{game.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 bg-slate-800 border-r border-slate-700 p-4">
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                Geral
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                Atualizações
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                DLC
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                Workshop
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                Gravação de Jogos
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white">
                Privacidade
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <Tabs defaultValue="general">
              <TabsList className="bg-slate-800 border-slate-700">
                <TabsTrigger value="general">Geral</TabsTrigger>
                <TabsTrigger value="updates">Atualizações</TabsTrigger>
                <TabsTrigger value="local">Ficheiros Locais</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="overlay" className="text-slate-300">
                      Ativar o Painel NPED durante o jogo
                    </Label>
                    <Switch id="overlay" checked={overlayEnabled} onCheckedChange={setOverlayEnabled} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-slate-300">
                      Idioma
                    </Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="Português (Portugal)">Português (Portugal)</SelectItem>
                        <SelectItem value="Português (Brasil)">Português (Brasil)</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Español">Español</SelectItem>
                        <SelectItem value="Français">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-2">NPED CLOUD</h3>
                    <p className="text-sm text-slate-400 mb-4">
                      A NPED Cloud guarda dados para teres uma experiência consistente entre computadores diferentes.
                    </p>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cloud" className="text-slate-300">
                        Guardar ficheiros de {game.title} na NPED Cloud
                      </Label>
                      <Switch id="cloud" checked={cloudSyncEnabled} onCheckedChange={setCloudSyncEnabled} />
                    </div>
                    <div className="mt-2 text-right text-sm text-slate-400">Usados: 0 bytes / Disponíveis: 10 GB</div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-2">OPÇÕES DE ARRANQUE</h3>
                    <p className="text-sm text-slate-400 mb-4">
                      Utilizadores avançados podem adicionar modificações às opções de arranque.
                    </p>
                    <Textarea
                      value={launchOptions}
                      onChange={(e) => setLaunchOptions(e.target.value)}
                      placeholder="-novid -tickrate 128 -high -freq 144 -console"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="updates" className="space-y-6 mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Atualizações Automáticas</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="update-auto"
                        name="update-preference"
                        className="text-blue-600"
                        defaultChecked
                      />
                      <Label htmlFor="update-auto" className="text-slate-300">
                        Manter este jogo atualizado automaticamente
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="update-high" name="update-preference" className="text-blue-600" />
                      <Label htmlFor="update-high" className="text-slate-300">
                        Prioridade alta - Atualizar este jogo antes de outros
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="update-manual" name="update-preference" className="text-blue-600" />
                      <Label htmlFor="update-manual" className="text-slate-300">
                        Apenas atualizar este jogo quando eu o iniciar
                      </Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="local" className="space-y-6 mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Ficheiros Locais</h3>
                  <p className="text-sm text-slate-400">Localização: C:\Program Files\NPED\games\{game.id}</p>
                  <p className="text-sm text-slate-400">Tamanho no disco: {game.size}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      Procurar ficheiros locais
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Verificar integridade dos ficheiros
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700">
          <Button variant="destructive" onClick={() => onUninstall(game.id)} className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Desinstalar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

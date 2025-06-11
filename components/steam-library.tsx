"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Play, Download, Clock, Calendar, Star } from "lucide-react"

interface SteamLibraryProps {
  games: any[]
  onInstall: (gameId: string) => void
  onPlay: (gameId: string) => void
}

export function SteamLibrary({ games, onInstall, onPlay }: SteamLibraryProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const installedGames = games.filter((game) => game.installed)
  const favoriteGames = games.filter((game) => game.isFavorite)
  const recentGames = installedGames.filter((game) => game.lastPlayed).slice(0, 8)
  const newGames = games.slice(0, 5) // Simular jogos novos

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, Math.ceil(newGames.length / 4)))
  }

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + Math.max(1, Math.ceil(newGames.length / 4))) % Math.max(1, Math.ceil(newGames.length / 4)),
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Novidades Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5" />
            Novidades
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={prevSlide} className="w-8 h-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextSlide} className="w-8 h-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {newGames.slice(currentSlide * 4, (currentSlide + 1) * 4).map((game) => (
            <Card key={game.id} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all group">
              <div className="relative overflow-hidden">
                <img
                  src={game.image || "/placeholder.svg"}
                  alt={game.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {game.discount && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                    -{game.discount}%
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <h3 className="text-white font-semibold text-sm mb-1">{game.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-300">{new Date(game.releaseDate).toLocaleDateString()}</div>
                    {game.installed ? (
                      <Button size="sm" onClick={() => onPlay(game.id)} className="bg-green-600 hover:bg-green-700">
                        <Play className="w-3 h-3 mr-1" />
                        Jogar
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => onInstall(game.id)} className="bg-blue-600 hover:bg-blue-700">
                        <Download className="w-3 h-3 mr-1" />
                        Instalar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Favoritos Section */}
      {favoriteGames.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Favoritos ({favoriteGames.length})</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>ORDENAR:</span>
              <select className="bg-slate-700 text-white border border-slate-600 rounded px-2 py-1 text-xs">
                <option>Última sessão</option>
                <option>Nome</option>
                <option>Horas jogadas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {favoriteGames.map((game) => (
              <div key={game.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={game.image || "/placeholder.svg"}
                    alt={game.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {game.downloading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="text-center">
                        <Progress value={game.downloadProgress} className="w-16 h-1 mb-1" />
                        <div className="text-xs text-white">{Math.round(game.downloadProgress)}%</div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {game.installed ? (
                      <Button size="sm" onClick={() => onPlay(game.id)} className="bg-green-600 hover:bg-green-700">
                        <Play className="w-3 h-3 mr-1" />
                        Jogar
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => onInstall(game.id)} className="bg-blue-600 hover:bg-blue-700">
                        <Download className="w-3 h-3 mr-1" />
                        Instalar
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-white text-xs font-medium truncate">{game.title}</h3>
                  <div className="text-xs text-slate-400">
                    {game.installed ? (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {game.lastPlayed ? new Date(game.lastPlayed).toLocaleDateString() : "Nunca jogado"}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(game.releaseDate).getFullYear()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Jogos Recentes Section */}
      {recentGames.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Jogos recentes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {recentGames.map((game) => (
              <div key={game.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={game.image || "/placeholder.svg"}
                    alt={game.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" onClick={() => onPlay(game.id)} className="bg-green-600 hover:bg-green-700">
                      <Play className="w-3 h-3 mr-1" />
                      Jogar
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-white text-xs font-medium truncate">{game.title}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {game.lastPlayed ? new Date(game.lastPlayed).toLocaleDateString() : "Hoje"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Todos os Jogos Section */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Todos os jogos ({games.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {games.map((game) => (
            <div key={game.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={game.image || "/placeholder.svg"}
                  alt={game.title}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {game.downloading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center">
                      <Progress value={game.downloadProgress} className="w-16 h-1 mb-1" />
                      <div className="text-xs text-white">{Math.round(game.downloadProgress)}%</div>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {game.installed ? (
                    <Button size="sm" onClick={() => onPlay(game.id)} className="bg-green-600 hover:bg-green-700">
                      <Play className="w-3 h-3 mr-1" />
                      Jogar
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => onInstall(game.id)} className="bg-blue-600 hover:bg-blue-700">
                      <Download className="w-3 h-3 mr-1" />
                      Instalar
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-white text-xs font-medium truncate">{game.title}</h3>
                <div className="text-xs text-slate-400">
                  {game.installed ? (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {game.lastPlayed ? new Date(game.lastPlayed).toLocaleDateString() : "Nunca jogado"}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(game.releaseDate).getFullYear()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

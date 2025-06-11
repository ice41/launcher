"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Edit, Trophy, Users, Calendar, MapPin, LinkIcon, MessageCircle, Heart, Gamepad2, Clock } from "lucide-react"

interface EnhancedProfileProps {
  user: any
  games: any[]
}

export function EnhancedProfile({ user, games }: EnhancedProfileProps) {
  const [selectedShowcase, setSelectedShowcase] = useState("favorites")

  const installedGames = games.filter((game) => game.installed)
  const favoriteGames = games.filter((game) => game.isFavorite)
  const recentGames = installedGames.slice(0, 6)

  const totalPlaytime = installedGames.reduce((total, game) => {
    const hours = Number.parseFloat(game.playtime.replace(" horas", ""))
    return total + hours
  }, 0)

  const achievements = [
    { id: 1, name: "Primeira Vitória", game: "Counter-Strike 2", icon: "🏆", rarity: "comum" },
    { id: 2, name: "Explorador", game: "Cyberpunk 2077", icon: "🗺️", rarity: "raro" },
    { id: 3, name: "Colecionador", game: "The Witcher 3", icon: "💎", rarity: "épico" },
    { id: 4, name: "Speedrunner", game: "GTA V", icon: "⚡", rarity: "lendário" },
  ]

  const badges = [
    { id: 1, name: "Veterano Steam", level: 5, icon: "🎖️" },
    { id: 2, name: "Colecionador", level: 3, icon: "📚" },
    { id: 3, name: "Avaliador", level: 2, icon: "⭐" },
  ]

  const comments = [
    {
      id: 1,
      author: "João123",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "Ótimo jogador! Sempre disposto a ajudar a equipe.",
      timestamp: "2 dias atrás",
    },
    {
      id: 2,
      author: "GamerGirl",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "Parabéns pelas conquistas no Cyberpunk! 🎉",
      timestamp: "1 semana atrás",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Background Header */}
      <div
        className="relative h-80 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('/placeholder.svg?height=320&width=1200')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        {/* Profile Header */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-blue-500">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-4xl">{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-slate-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex-1 pb-4">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-bold text-white">{user.name}</h1>
                  <Badge className="bg-blue-600 text-lg px-3 py-1">Nível {user.level}</Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    Online
                  </Badge>
                </div>

                <p className="text-slate-300 text-lg mb-3">{user.bio}</p>

                <div className="flex items-center gap-6 text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Portugal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Membro desde {new Date(user.joinDate).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    <span>nped.pt</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pb-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Adicionar Amigo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Overview */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{user.gamesOwned}</div>
                    <div className="text-sm text-slate-400">Jogos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{Math.round(totalPlaytime)}</div>
                    <div className="text-sm text-slate-400">Horas Jogadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{user.achievementsUnlocked}</div>
                    <div className="text-sm text-slate-400">Conquistas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{user.friends}</div>
                    <div className="text-sm text-slate-400">Amigos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Showcase */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Showcase de Jogos</CardTitle>
                  <select
                    value={selectedShowcase}
                    onChange={(e) => setSelectedShowcase(e.target.value)}
                    className="bg-slate-700 text-white border border-slate-600 rounded px-3 py-1 text-sm"
                  >
                    <option value="favorites">Favoritos</option>
                    <option value="recent">Jogados Recentemente</option>
                    <option value="achievements">Mais Conquistas</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(selectedShowcase === "favorites" ? favoriteGames : recentGames).slice(0, 6).map((game) => (
                    <div key={game.id} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={game.image || "/placeholder.svg"}
                          alt={game.title}
                          className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Gamepad2 className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="mt-2">
                        <h4 className="text-white text-sm font-medium truncate">{game.title}</h4>
                        <p className="text-slate-400 text-xs">{game.playtime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-white text-sm">Desbloqueou a conquista "Explorador"</p>
                      <p className="text-slate-400 text-xs">Cyberpunk 2077 • há 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-white text-sm">Jogou por 3.2 horas</p>
                      <p className="text-slate-400 text-xs">Counter-Strike 2 • ontem</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <Heart className="w-5 h-5 text-red-500" />
                    <div className="flex-1">
                      <p className="text-white text-sm">Adicionou aos favoritos</p>
                      <p className="text-slate-400 text-xs">Red Dead Redemption 2 • há 3 dias</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Progress */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Progresso do Nível</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Nível {user.level}</span>
                    <span className="text-slate-300">Nível {user.level + 1}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-slate-400">2,450 / 3,200 XP</p>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {badges.map((badge) => (
                    <div key={badge.id} className="text-center p-2 bg-slate-700/50 rounded-lg">
                      <div className="text-2xl mb-1">{badge.icon}</div>
                      <div className="text-xs text-white font-medium">{badge.name}</div>
                      <div className="text-xs text-slate-400">Nível {badge.level}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Conquistas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.slice(0, 4).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-lg">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white text-sm font-medium">{achievement.name}</h4>
                        <p className="text-slate-400 text-xs">{achievement.game}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          achievement.rarity === "lendário"
                            ? "border-orange-500 text-orange-500"
                            : achievement.rarity === "épico"
                              ? "border-purple-500 text-purple-500"
                              : achievement.rarity === "raro"
                                ? "border-blue-500 text-blue-500"
                                : "border-gray-500 text-gray-500"
                        }`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">Comentários</CardTitle>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Comentar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{comment.author[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-blue-400 text-sm font-medium">{comment.author}</span>
                        <span className="text-slate-500 text-xs">{comment.timestamp}</span>
                      </div>
                      <p className="text-slate-300 text-sm ml-8">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

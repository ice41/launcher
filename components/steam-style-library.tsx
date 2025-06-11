"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Grid3X3,
  List,
  ChevronDown,
  Play,
  Download,
  Trash2,
  Settings,
  EyeOff,
  Folder,
  Plus,
  Heart,
  Archive,
  MoreVertical,
} from "lucide-react"

interface SteamStyleLibraryProps {
  games: any[]
  collections: any[]
  onInstall: (gameId: string) => void
  onPlay: (gameId: string) => void
  onUninstall: (gameId: string) => void
  onToggleFavorite: (gameId: string) => void
  onCreateCollection: () => void
  onAddToCollection: (gameId: string, collectionId: string) => void
  onDeleteCollection: (collectionId: string) => void
  onShowProperties: (gameId: string) => void
  onHideGame: (gameId: string) => void
}

export function SteamStyleLibrary({
  games,
  collections,
  onInstall,
  onPlay,
  onUninstall,
  onToggleFavorite,
  onCreateCollection,
  onAddToCollection,
  onDeleteCollection,
  onShowProperties,
  onHideGame,
}: SteamStyleLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("alphabetical")

  const categories = [
    { id: "all", name: "Início", count: games.length },
    { id: "favorites", name: "FAVORITOS", count: games.filter((g) => g.isFavorite).length },
    { id: "installed", name: "INSTALADOS", count: games.filter((g) => g.installed).length },
    { id: "recent", name: "RECENTES", count: games.filter((g) => g.lastPlayed).length },
  ]

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase())

    let matchesCategory = true
    if (selectedCategory === "favorites") matchesCategory = game.isFavorite
    else if (selectedCategory === "installed") matchesCategory = game.installed
    else if (selectedCategory === "recent") matchesCategory = !!game.lastPlayed

    let matchesCollection = true
    if (selectedCollection) {
      const collection = collections.find((c) => c.id === selectedCollection)
      matchesCollection = collection ? collection.gameIds.includes(game.id) : false
    }

    return matchesSearch && matchesCategory && matchesCollection
  })

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.title.localeCompare(b.title)
      case "recent":
        return new Date(b.lastPlayed || 0).getTime() - new Date(a.lastPlayed || 0).getTime()
      case "playtime":
        return Number.parseFloat(b.playtime) - Number.parseFloat(a.playtime)
      default:
        return 0
    }
  })

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900/80 border-r border-slate-700">
        <div className="p-4">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white text-sm h-8"
            />
          </div>

          {/* Categories */}
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className={`w-full justify-between text-left h-8 px-3 ${
                    selectedCategory === category.id && !selectedCollection
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setSelectedCollection(null)
                  }}
                >
                  <span className="text-sm">{category.name}</span>
                  <span className="text-xs text-slate-500">({category.count})</span>
                </Button>
              ))}

              {/* Collections */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Coleções</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onCreateCollection}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                {collections.map((collection) => (
                  <div key={collection.id} className="relative group">
                    <Button
                      variant="ghost"
                      className={`w-full justify-between text-left h-8 px-3 ${
                        selectedCollection === collection.id
                          ? "bg-slate-700 text-white"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }`}
                      onClick={() => {
                        setSelectedCollection(collection.id)
                        setSelectedCategory("all")
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Folder className="w-3 h-3" />
                        <span className="text-sm">{collection.name}</span>
                      </div>
                      <span className="text-xs text-slate-500">({collection.gameIds.length})</span>
                    </Button>

                    {/* Collection Context Menu */}
                    {collection.id !== "favorites" && (
                      <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-5 h-5 p-0">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem
                              onClick={() => onDeleteCollection(collection.id)}
                              className="text-red-400"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remover Coleção
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/50 border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">
                {selectedCollection
                  ? collections.find((c) => c.id === selectedCollection)?.name
                  : categories.find((c) => c.id === selectedCategory)?.name}{" "}
                ({sortedGames.length})
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-slate-300">
                    ORDENAR:{" "}
                    {sortBy === "alphabetical" ? "Alfabeticamente" : sortBy === "recent" ? "Recente" : "Tempo de jogo"}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem onClick={() => setSortBy("alphabetical")}>Alfabeticamente</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("recent")}>Última sessão</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("playtime")}>Tempo de jogo</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Mode */}
              <div className="flex border border-slate-600 rounded">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-2 ${viewMode === "grid" ? "bg-slate-600" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-2 ${viewMode === "list" ? "bg-slate-600" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Games Grid/List */}
        <ScrollArea className="flex-1 p-4">
          {viewMode === "grid" ? (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
            >
              {sortedGames.map((game, index) => (
                <GameGridItem
                  key={game.id}
                  game={game}
                  index={index}
                  onPlay={onPlay}
                  onInstall={onInstall}
                  onUninstall={onUninstall}
                  onToggleFavorite={onToggleFavorite}
                  onShowProperties={onShowProperties}
                  onHideGame={onHideGame}
                  collections={collections}
                  onAddToCollection={onAddToCollection}
                />
              ))}
            </motion.div>
          ) : (
            <div className="space-y-1">
              {sortedGames.map((game) => (
                <GameListItem
                  key={game.id}
                  game={game}
                  onPlay={onPlay}
                  onInstall={onInstall}
                  onUninstall={onUninstall}
                  onToggleFavorite={onToggleFavorite}
                  onShowProperties={onShowProperties}
                  onHideGame={onHideGame}
                  collections={collections}
                  onAddToCollection={onAddToCollection}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}

// Game Grid Item Component
function GameGridItem({
  game,
  index,
  onPlay,
  onInstall,
  onUninstall,
  onToggleFavorite,
  onShowProperties,
  onHideGame,
  collections,
  onAddToCollection,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded cursor-pointer">
        <img
          src={game.image || "/placeholder.svg"}
          alt={game.title}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {/* Overlay */}
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

        {/* Status Indicators */}
        <div className="absolute top-2 left-2 flex gap-1">
          {game.isFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0 bg-red-600 hover:bg-red-700"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(game.id)
              }}
            >
              <Heart className="w-3 h-3 text-white fill-current" />
            </Button>
          )}
          {game.downloading && (
            <Badge className="bg-blue-600 text-xs px-1 py-0">{Math.round(game.downloadProgress)}%</Badge>
          )}
        </div>

        {/* Context Menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-6 h-6 bg-black/50">
                <MoreVertical className="w-3 h-3 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700">
              {game.installed ? (
                <DropdownMenuItem onClick={() => onPlay(game.id)} className="text-green-400">
                  <Play className="w-4 h-4 mr-2" />
                  Jogar
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onInstall(game.id)} className="text-blue-400">
                  <Download className="w-4 h-4 mr-2" />
                  Instalar
                </DropdownMenuItem>
              )}

              <DropdownMenuItem onClick={() => onToggleFavorite(game.id)}>
                <Heart className="w-4 h-4 mr-2" />
                {game.isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <DropdownMenuItem>
                    <Folder className="w-4 h-4 mr-2" />
                    Adicionar a...
                  </DropdownMenuItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700" side="right">
                  {collections.map((collection) => (
                    <DropdownMenuItem key={collection.id} onClick={() => onAddToCollection(game.id, collection.id)}>
                      {collection.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenuItem onClick={() => onShowProperties(game.id)}>
                <Settings className="w-4 h-4 mr-2" />
                Propriedades
              </DropdownMenuItem>

              {game.installed && (
                <>
                  <DropdownMenuItem>
                    <Archive className="w-4 h-4 mr-2" />
                    Ver pasta de instalação
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => onUninstall(game.id)} className="text-red-400">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Desinstalar
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuItem onClick={() => onHideGame(game.id)}>
                <EyeOff className="w-4 h-4 mr-2" />
                Ocultar este jogo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-2">
        <h3 className="text-white text-xs font-medium truncate">{game.title}</h3>
        {game.installed && game.lastPlayed && (
          <p className="text-slate-400 text-xs">{new Date(game.lastPlayed).toLocaleDateString()}</p>
        )}
      </div>
    </motion.div>
  )
}

// Game List Item Component
function GameListItem({
  game,
  onPlay,
  onInstall,
  onUninstall,
  onToggleFavorite,
  onShowProperties,
  onHideGame,
  collections,
  onAddToCollection,
}: any) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded group">
      <img src={game.image || "/placeholder.svg"} alt={game.title} className="w-12 h-12 object-cover rounded" />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-medium">{game.title}</h3>
          {game.isFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5 p-0 hover:bg-red-700"
              onClick={() => onToggleFavorite(game.id)}
            >
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </Button>
          )}
        </div>
        <div className="text-sm text-slate-400">
          {game.installed
            ? `${game.playtime} • ${game.lastPlayed ? new Date(game.lastPlayed).toLocaleDateString() : "Nunca jogado"}`
            : game.genre.join(", ")}
        </div>
      </div>

      <div className="flex items-center gap-2">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-800 border-slate-700">
            <DropdownMenuItem onClick={() => onToggleFavorite(game.id)}>
              <Heart className="w-4 h-4 mr-2" />
              {game.isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DropdownMenuItem>
                  <Folder className="w-4 h-4 mr-2" />
                  Adicionar a...
                </DropdownMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700" side="right">
                {collections.map((collection) => (
                  <DropdownMenuItem key={collection.id} onClick={() => onAddToCollection(game.id, collection.id)}>
                    {collection.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenuItem onClick={() => onShowProperties(game.id)}>
              <Settings className="w-4 h-4 mr-2" />
              Propriedades
            </DropdownMenuItem>

            {game.installed && (
              <>
                <DropdownMenuItem>
                  <Archive className="w-4 h-4 mr-2" />
                  Ver pasta de instalação
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => onUninstall(game.id)} className="text-red-400">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Desinstalar
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuItem onClick={() => onHideGame(game.id)}>
              <EyeOff className="w-4 h-4 mr-2" />
              Ocultar este jogo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

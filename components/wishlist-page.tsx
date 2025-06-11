"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Star, Heart, ShoppingCart, Download } from "lucide-react"

interface WishlistPageProps {
  games: any[]
  onBack: () => void
  onRemoveFromWishlist: (gameId: string) => void
  onAddToCart: (gameId: string) => void
  onInstall: (gameId: string) => void
}

export function WishlistPage({ games, onBack, onRemoveFromWishlist, onAddToCart, onInstall }: WishlistPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterBy, setFilterBy] = useState("all")

  const wishlistGames = games.filter((game) => game.isWishlisted)

  const filteredGames = wishlistGames
    .filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase())
      let matchesFilter = true

      if (filterBy === "on-sale") matchesFilter = game.discount > 0
      else if (filterBy === "free") matchesFilter = game.price === 0
      else if (filterBy === "under-10") matchesFilter = game.price < 10

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "release":
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        default:
          return 0
      }
    })

  const totalValue = wishlistGames.reduce((sum, game) => {
    const finalPrice = game.discount ? game.price * (1 - game.discount / 100) : game.price
    return sum + finalPrice
  }, 0)

  const totalSavings = wishlistGames.reduce((sum, game) => {
    if (game.discount) {
      return sum + game.price * (game.discount / 100)
    }
    return sum
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">Lista de Desejos</h1>
            <p className="text-slate-400">
              {wishlistGames.length} {wishlistGames.length === 1 ? "jogo" : "jogos"} na tua lista
            </p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">€ {totalValue.toFixed(2)}</p>
                <p className="text-slate-400 text-sm">Valor total</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">€ {totalSavings.toFixed(2)}</p>
                <p className="text-slate-400 text-sm">Poupanças em ofertas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{wishlistGames.filter((g) => g.discount > 0).length}</p>
                <p className="text-slate-400 text-sm">Jogos em oferta</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Pesquisa */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar na lista de desejos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white rounded px-3 py-2"
            >
              <option value="all">Todos</option>
              <option value="on-sale">Em oferta</option>
              <option value="free">Grátis</option>
              <option value="under-10">Menos de €10</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white rounded px-3 py-2"
            >
              <option value="name">Nome A-Z</option>
              <option value="price-low">Menor preço</option>
              <option value="price-high">Maior preço</option>
              <option value="rating">Avaliação</option>
              <option value="release">Mais recente</option>
            </select>
          </div>
        </div>

        {/* Lista de Jogos */}
        {filteredGames.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery || filterBy !== "all" ? "Nenhum jogo encontrado" : "Lista de desejos vazia"}
              </h3>
              <p className="text-slate-400">
                {searchQuery || filterBy !== "all"
                  ? "Tenta ajustar os filtros de pesquisa"
                  : "Adiciona jogos à tua lista de desejos para os veres aqui"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredGames.map((game) => (
              <WishlistGameCard
                key={game.id}
                game={game}
                onRemoveFromWishlist={onRemoveFromWishlist}
                onAddToCart={onAddToCart}
                onInstall={onInstall}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function WishlistGameCard({ game, onRemoveFromWishlist, onAddToCart, onInstall }: any) {
  const finalPrice = game.discount ? game.price * (1 - game.discount / 100) : game.price

  return (
    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all duration-200 group">
      <div className="relative overflow-hidden">
        <img
          src={game.image || "/placeholder.svg"}
          alt={game.title}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {game.discount && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
            -{game.discount}%
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50"
          onClick={() => onRemoveFromWishlist(game.id)}
        >
          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
        </Button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-white mb-2">{game.title}</h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs text-slate-300">{game.rating}</span>
          </div>
          <span className="text-xs text-slate-400">({game.reviews.toLocaleString()})</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {game.genre.slice(0, 2).map((g: string) => (
            <Badge key={g} variant="secondary" className="text-xs">
              {g}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {game.price === 0 ? (
              <span className="font-bold text-green-500">Grátis</span>
            ) : (
              <>
                {game.discount && (
                  <span className="text-slate-400 line-through text-sm">€ {game.price.toFixed(2)}</span>
                )}
                <span className="font-bold text-white">€ {finalPrice.toFixed(2)}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {game.installed ? (
            <Badge className="bg-green-600 flex-1 justify-center">Instalado</Badge>
          ) : (
            <Button
              onClick={() => (game.price === 0 ? onInstall(game.id) : onAddToCart(game.id))}
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {game.price === 0 ? (
                <>
                  <Download className="w-3 h-3 mr-1" />
                  Instalar
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Carrinho
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

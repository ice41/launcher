"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Star, Heart, ShoppingCart, Download, TrendingUp, Clock, Gift } from "lucide-react"

interface SteamStoreProps {
  games: any[]
  onInstall: (gameId: string) => void
  onWishlist: (gameId: string) => void
  onAddToCart: (gameId: string) => void
}

export function SteamStore({ games, onInstall, onWishlist, onAddToCart }: SteamStoreProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("featured")

  const featuredGames = games.slice(0, 8)
  const newReleases = games.filter((game) => new Date(game.releaseDate) > new Date("2023-01-01")).slice(0, 8)
  const onSaleGames = games.filter((game) => game.discount).slice(0, 8)
  const topSellers = games.sort((a, b) => b.reviews - a.reviews).slice(0, 8)

  const filteredGames = games.filter(
    (game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.genre.some((g: string) => g.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getGamesByCategory = () => {
    switch (selectedCategory) {
      case "new":
        return newReleases
      case "sale":
        return onSaleGames
      case "top":
        return topSellers
      default:
        return featuredGames
    }
  }

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Buscar na loja..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white"
          />
        </div>
      </div>

      {/* Featured Game Banner */}
      {!searchQuery && (
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-slate-700 overflow-hidden">
            <div className="relative h-64 md:h-80">
              <img
                src="/placeholder.svg?height=320&width=800"
                alt="Featured Game"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
              <div className="absolute inset-0 p-8 flex items-end">
                <div className="max-w-md">
                  <Badge className="bg-yellow-600 mb-3">EM DESTAQUE</Badge>
                  <h2 className="text-4xl font-bold text-white mb-3">Cyberpunk 2077</h2>
                  <p className="text-slate-200 mb-4">
                    Experimente Night City como nunca antes. Agora com Ray Tracing e DLSS 3.0.
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-green-600">-50%</Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 line-through text-lg">R$ 199,90</span>
                      <span className="text-3xl font-bold text-white">R$ 99,95</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                    <Button variant="outline">
                      <Heart className="w-4 h-4 mr-2" />
                      Lista de Desejos
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Category Tabs */}
      {!searchQuery && (
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="featured" className="data-[state=active]:bg-slate-700">
              <Star className="w-4 h-4 mr-2" />
              Em Destaque
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-slate-700">
              <Clock className="w-4 h-4 mr-2" />
              Novidades
            </TabsTrigger>
            <TabsTrigger value="sale" className="data-[state=active]:bg-slate-700">
              <Gift className="w-4 h-4 mr-2" />
              Ofertas
            </TabsTrigger>
            <TabsTrigger value="top" className="data-[state=active]:bg-slate-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Mais Vendidos
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Games Grid */}
      <div className="space-y-6">
        {searchQuery ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Resultados para "{searchQuery}" ({filteredGames.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredGames.map((game) => (
                <StoreGameCard
                  key={game.id}
                  game={game}
                  onInstall={onInstall}
                  onWishlist={onWishlist}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {getGamesByCategory().map((game) => (
              <StoreGameCard
                key={game.id}
                game={game}
                onInstall={onInstall}
                onWishlist={onWishlist}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Special Offers Section */}
      {!searchQuery && onSaleGames.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-white">Ofertas Especiais</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {onSaleGames.slice(0, 4).map((game) => (
              <Card key={game.id} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all group">
                <div className="relative overflow-hidden">
                  <img
                    src={game.image || "/placeholder.svg"}
                    alt={game.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                    -{game.discount}%
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50"
                    onClick={() => onWishlist(game.id)}
                  >
                    <Heart className={`w-4 h-4 ${game.isWishlisted ? "fill-red-500 text-red-500" : "text-white"}`} />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-2 truncate">{game.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-slate-300">{game.rating}</span>
                    </div>
                    <span className="text-xs text-slate-400">({game.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 line-through text-sm">R$ {game.price.toFixed(2)}</span>
                      <span className="font-bold text-green-400">
                        R$ {(game.price * (1 - game.discount / 100)).toFixed(2)}
                      </span>
                    </div>
                    <Button size="sm" onClick={() => onAddToCart(game.id)} className="bg-green-600 hover:bg-green-700">
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Carrinho
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Store Game Card Component
function StoreGameCard({ game, onInstall, onWishlist, onAddToCart }: any) {
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
          onClick={() => onWishlist(game.id)}
        >
          <Heart className={`w-4 h-4 ${game.isWishlisted ? "fill-red-500 text-red-500" : "text-white"}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-white mb-2">{game.title}</h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs text-slate-300">{game.rating}</span>
          </div>
          <span className="text-xs text-slate-400">({game.reviews.toLocaleString()} avaliações)</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {game.genre.slice(0, 2).map((g: string) => (
            <Badge key={g} variant="secondary" className="text-xs">
              {g}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {game.price === 0 ? (
              <span className="font-bold text-green-500">Grátis</span>
            ) : (
              <>
                {game.discount && (
                  <span className="text-slate-400 line-through text-sm">R$ {game.price.toFixed(2)}</span>
                )}
                <span className="font-bold text-white">R$ {finalPrice.toFixed(2)}</span>
              </>
            )}
          </div>

          {game.installed ? (
            <Badge className="bg-green-600">Instalado</Badge>
          ) : (
            <Button
              onClick={() => (game.price === 0 ? onInstall(game.id) : onAddToCart(game.id))}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
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

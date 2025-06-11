"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Star,
  Heart,
  ShoppingCart,
  Download,
  TrendingUp,
  Clock,
  Gift,
  SlidersHorizontal,
  X,
  Loader2,
} from "lucide-react"

interface EnhancedSteamStoreProps {
  games: any[]
  onInstall: (gameId: string) => void
  onWishlist: (gameId: string) => void
  onAddToCart: (gameId: string) => void
}

export function EnhancedSteamStore({ games, onInstall, onWishlist, onAddToCart }: EnhancedSteamStoreProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("relevance")
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredGame, setHoveredGame] = useState<string | null>(null)

  const allGenres = Array.from(new Set(games.flatMap((game) => game.genre)))

  const featuredGames = games.slice(0, 8)
  const newReleases = games.filter((game) => new Date(game.releaseDate) > new Date("2023-01-01")).slice(0, 8)
  const onSaleGames = games.filter((game) => game.discount).slice(0, 8)
  const topSellers = games.sort((a, b) => b.reviews - a.reviews).slice(0, 8)

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.genre.some((g: string) => g.toLowerCase().includes(searchQuery.toLowerCase()))

    const finalPrice = game.discount ? game.price * (1 - game.discount / 100) : game.price
    const matchesPrice = finalPrice >= priceRange[0] && finalPrice <= priceRange[1]

    const matchesGenre = selectedGenres.length === 0 || selectedGenres.some((genre) => game.genre.includes(genre))

    return matchesSearch && matchesPrice && matchesGenre
  })

  const getGamesByCategory = () => {
    let categoryGames = []
    switch (selectedCategory) {
      case "new":
        categoryGames = newReleases
        break
      case "sale":
        categoryGames = onSaleGames
        break
      case "top":
        categoryGames = topSellers
        break
      default:
        categoryGames = featuredGames
    }

    // Apply sorting
    return categoryGames.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (
            (a.discount ? a.price * (1 - a.discount / 100) : a.price) -
            (b.discount ? b.price * (1 - b.discount / 100) : b.price)
          )
        case "price-high":
          return (
            (b.discount ? b.price * (1 - b.discount / 100) : a.price) -
            (a.discount ? a.price * (1 - a.discount / 100) : a.price)
          )
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query) {
      setIsLoading(true)
      // Simulate search delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsLoading(false)
    }
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const clearFilters = () => {
    setPriceRange([0, 100])
    setSelectedGenres([])
    setSortBy("relevance")
  }

  return (
    <div className="p-6">
      {/* Enhanced Search Bar */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Buscar jogos, gêneros, desenvolvedores..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 animate-spin" />
          )}
        </div>

        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {(selectedGenres.length > 0 || priceRange[0] > 0 || priceRange[1] < 100) && (
            <Badge className="ml-2 bg-blue-600">
              {selectedGenres.length + (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Animated Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price Range */}
                  <div>
                    <h3 className="text-white font-semibold mb-3">Preço</h3>
                    <div className="space-y-3">
                      <Slider value={priceRange} onValueChange={setPriceRange} max={100} step={5} className="w-full" />
                      <div className="flex justify-between text-sm text-slate-400">
                        <span>€ {priceRange[0] / 5}</span>
                        <span>€ {priceRange[1] / 5}</span>
                      </div>
                    </div>
                  </div>

                  {/* Genres */}
                  <div>
                    <h3 className="text-white font-semibold mb-3">Gêneros</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {allGenres.map((genre) => (
                        <div key={genre} className="flex items-center space-x-2">
                          <Checkbox
                            id={genre}
                            checked={selectedGenres.includes(genre)}
                            onCheckedChange={() => toggleGenre(genre)}
                          />
                          <label htmlFor={genre} className="text-sm text-slate-300 cursor-pointer">
                            {genre}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h3 className="text-white font-semibold mb-3">Ordenar por</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
                    >
                      <option value="relevance">Relevância</option>
                      <option value="name">Nome A-Z</option>
                      <option value="price-low">Menor Preço</option>
                      <option value="price-high">Maior Preço</option>
                      <option value="rating">Avaliação</option>
                    </select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="mt-2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Game Banner with Animation */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-slate-700 overflow-hidden">
            <div className="relative h-64 md:h-80">
              <motion.img
                src="/placeholder.svg?height=320&width=800"
                alt="Featured Game"
                className="w-full h-full object-cover opacity-60"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
              <div className="absolute inset-0 p-8 flex items-end">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="max-w-md"
                >
                  <Badge className="bg-yellow-600 mb-3">EM DESTAQUE</Badge>
                  <h2 className="text-4xl font-bold text-white mb-3">Cyberpunk 2077</h2>
                  <p className="text-slate-200 mb-4">
                    Experimente Night City como nunca antes. Agora com Ray Tracing e DLSS 3.0.
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-green-600">-50%</Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 line-through text-lg">€ 39,99</span>
                      <span className="text-3xl font-bold text-white">€ 19,99</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Adicionar ao Carrinho
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline">
                        <Heart className="w-4 h-4 mr-2" />
                        Lista de Desejos
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Animated Category Tabs */}
      {!searchQuery && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
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
        </motion.div>
      )}

      {/* Animated Games Grid */}
      <div className="space-y-6">
        {searchQuery ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h2 className="text-2xl font-bold text-white mb-4">
              Resultados para "{searchQuery}" ({filteredGames.length})
            </h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <EnhancedStoreGameCard
                    game={game}
                    onInstall={onInstall}
                    onWishlist={onWishlist}
                    onAddToCart={onAddToCart}
                    onHover={setHoveredGame}
                    isHovered={hoveredGame === game.id}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {getGamesByCategory().map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <EnhancedStoreGameCard
                  game={game}
                  onInstall={onInstall}
                  onWishlist={onWishlist}
                  onAddToCart={onAddToCart}
                  onHover={setHoveredGame}
                  isHovered={hoveredGame === game.id}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Animated Special Offers Section */}
      {!searchQuery && onSaleGames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Gift className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-white">Ofertas Especiais</h2>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delay: 0.2 }}
          >
            {onSaleGames.slice(0, 4).map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all group">
                  <motion.div
                    className="relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={game.image || "/placeholder.svg"}
                      alt={game.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-bold"
                    >
                      -{game.discount}%
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50"
                        onClick={() => onWishlist(game.id)}
                      >
                        <Heart
                          className={`w-4 h-4 ${game.isWishlisted ? "fill-red-500 text-red-500" : "text-white"}`}
                        />
                      </Button>
                    </motion.div>
                  </motion.div>
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
                        <span className="text-slate-400 line-through text-sm">€ {(game.price / 5).toFixed(2)}</span>
                        <span className="font-bold text-green-400">
                          € {((game.price * (1 - game.discount / 100)) / 5).toFixed(2)}
                        </span>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          size="sm"
                          onClick={() => onAddToCart(game.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Carrinho
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

// Enhanced Store Game Card Component with Animations
function EnhancedStoreGameCard({ game, onInstall, onWishlist, onAddToCart, onHover, isHovered }: any) {
  const finalPrice = game.discount ? game.price * (1 - game.discount / 100) : game.price

  return (
    <motion.div
      onHoverStart={() => onHover(game.id)}
      onHoverEnd={() => onHover(null)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all duration-200 group overflow-hidden">
        <div className="relative overflow-hidden">
          <motion.img
            src={game.image || "/placeholder.svg"}
            alt={game.title}
            className="w-full h-40 object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />

          {game.discount && (
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -12 }}
              className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-bold"
            >
              -{game.discount}%
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 right-2"
          >
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/50 backdrop-blur-sm"
              onClick={() => onWishlist(game.id)}
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                <Heart className={`w-4 h-4 ${game.isWishlisted ? "fill-red-500 text-red-500" : "text-white"}`} />
              </motion.div>
            </Button>
          </motion.div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center"
          >
            <motion.div initial={{ scale: 0 }} whileHover={{ scale: 1 }} transition={{ delay: 0.1 }}>
              {game.installed ? (
                <Badge className="bg-green-600 text-lg px-4 py-2">Instalado</Badge>
              ) : (
                <Button
                  onClick={() => (game.price === 0 ? onInstall(game.id) : onAddToCart(game.id))}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {game.price === 0 ? (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Instalar
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Carrinho
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>

        <CardContent className="p-4">
          <motion.h3
            className="font-semibold text-white mb-2"
            animate={{ color: isHovered ? "#60a5fa" : "#ffffff" }}
            transition={{ duration: 0.2 }}
          >
            {game.title}
          </motion.h3>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs text-slate-300">{game.rating}</span>
            </div>
            <span className="text-xs text-slate-400">({game.reviews.toLocaleString()} avaliações)</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {game.genre.slice(0, 2).map((g: string) => (
              <motion.div key={g} whileHover={{ scale: 1.05 }} transition={{ duration: 0.1 }}>
                <Badge variant="secondary" className="text-xs">
                  {g}
                </Badge>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {game.price === 0 ? (
                <motion.span className="font-bold text-green-500" animate={{ scale: isHovered ? 1.05 : 1 }}>
                  Grátis
                </motion.span>
              ) : (
                <>
                  {game.discount && (
                    <span className="text-slate-400 line-through text-sm">€ {(game.price / 5).toFixed(2)}</span>
                  )}
                  <motion.span className="font-bold text-white" animate={{ scale: isHovered ? 1.05 : 1 }}>
                    € {(finalPrice / 5).toFixed(2)}
                  </motion.span>
                </>
              )}
            </div>

            {!game.installed && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Download, ShoppingCart } from "lucide-react"

interface CartViewProps {
  cartItems: string[]
  games: any[]
  onRemoveFromCart: (gameId: string) => void
  onInstall: (gameId: string) => void
}

export function CartView({ cartItems, games, onRemoveFromCart, onInstall }: CartViewProps) {
  const cartGames = games.filter((game) => cartItems.includes(game.id))
  const totalPrice = cartGames.reduce((sum, game) => {
    const finalPrice = game.discount ? game.price * (1 - game.discount / 100) : game.price
    return sum + finalPrice
  }, 0)

  const handleCheckout = () => {
    // Simular compra e instalar jogos gratuitos
    cartGames.forEach((game) => {
      if (game.price === 0) {
        onInstall(game.id)
      }
    })
    alert(`Compra realizada! Total: R$ ${totalPrice.toFixed(2)}`)
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Carrinho de Compras</h1>
          <Badge variant="outline" className="text-slate-300">
            {cartItems.length} {cartItems.length === 1 ? "item" : "itens"}
          </Badge>
        </div>

        {cartItems.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Seu carrinho está vazio</h2>
              <p className="text-slate-400">Adicione alguns jogos da loja para começar!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Jogos */}
            <div className="lg:col-span-2 space-y-4">
              {cartGames.map((game) => {
                const finalPrice = game.discount ? game.price * (1 - game.discount / 100) : game.price
                return (
                  <Card key={game.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={game.image || "/placeholder.svg"}
                          alt={game.title}
                          className="w-24 h-24 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">{game.title}</h3>
                          <p className="text-sm text-slate-400 mb-2">{game.developer}</p>
                          <div className="flex flex-wrap gap-1">
                            {game.genre.slice(0, 3).map((g: string) => (
                              <Badge key={g} variant="secondary" className="text-xs">
                                {g}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            {game.discount && <Badge className="bg-green-600">-{game.discount}%</Badge>}
                          </div>
                          <div className="flex items-center gap-2">
                            {game.discount && (
                              <span className="text-slate-400 line-through text-sm">R$ {game.price.toFixed(2)}</span>
                            )}
                            <span className="text-xl font-bold text-white">
                              {game.price === 0 ? "Grátis" : `R$ ${finalPrice.toFixed(2)}`}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveFromCart(game.id)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Resumo da Compra */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800 border-slate-700 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-white">Resumo da Compra</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cartGames.map((game) => {
                      const finalPrice = game.discount ? game.price * (1 - game.discount / 100) : game.price
                      return (
                        <div key={game.id} className="flex justify-between text-sm">
                          <span className="text-slate-300 truncate mr-2">{game.title}</span>
                          <span className="text-white">
                            {game.price === 0 ? "Grátis" : `R$ ${finalPrice.toFixed(2)}`}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <hr className="border-slate-600" />

                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">Total:</span>
                    <span className="text-white">R$ {totalPrice.toFixed(2)}</span>
                  </div>

                  <Button onClick={handleCheckout} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    {totalPrice === 0 ? "Baixar Jogos" : "Finalizar Compra"}
                  </Button>

                  <p className="text-xs text-slate-400 text-center">Jogos gratuitos serão baixados automaticamente</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Download,
  Settings,
  RefreshCw,
  User,
  Heart,
  Wifi,
  WifiOff,
  ChevronDown,
  ShoppingCart,
  Bell,
  ExternalLink,
  Check,
  Users,
  Link,
  Unlink,
  Gamepad2,
  Edit,
} from "lucide-react"
import { CartView } from "../components/cart-view"
import { EnhancedProfile } from "../components/enhanced-profile"
import { motion } from "framer-motion"
import { AnimatedPageTransition } from "../components/animated-page-transition"
import { EnhancedSteamStore } from "../components/enhanced-steam-store"
import { FriendsSystem } from "../components/friends-system"
import { SteamStyleLibrary } from "../components/steam-style-library"
import { GamePropertiesModal } from "../components/game-properties-modal"
import { EditProfileModal } from "../components/edit-profile-modal"
import { GroupSystem } from "../components/group-system"
import { LoginPage } from "../components/login-page"
import { EditProfilePage } from "../components/edit-profile-page"
import { WishlistPage } from "../components/wishlist-page"

interface Game {
  id: string
  title: string
  description: string
  image: string
  size: string
  rating: number
  reviews: number
  releaseDate: string
  genre: string[]
  price: number
  discount?: number
  installed: boolean
  downloading: boolean
  downloadProgress: number
  lastPlayed?: string
  playtime: string
  achievements?: number
  isWishlisted: boolean
  isFavorite: boolean
  developer: string
  publisher: string
  collections: string[]
}

interface UserType {
  name: string
  avatar: string
  level: number
  friends: number
  bio: string
  joinDate: string
  gamesOwned: number
  achievementsUnlocked: number
  location: string
  website: string
  status: string
  showGroupTags: boolean
  showStatus: boolean
  allowComments: boolean
  profileVisibility: string
}

interface NotificationType {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
}

interface Collection {
  id: string
  name: string
  gameIds: string[]
  color: string
}

interface ConnectedAccount {
  platform: string
  username: string
  connected: boolean
  avatar?: string
}

interface SettingsType {
  autoStart: boolean
  minimizeToTray: boolean
  autoUpdate: boolean
  downloadLimit: number
  notifications: boolean
  soundEffects: boolean
  theme: "dark" | "light"
  language: string
  connectedAccounts: ConnectedAccount[]
}

export default function NPEDLauncher() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentView, setCurrentView] = useState("library")
  const [libraryView, setLibraryView] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [launcherVersion] = useState("1.2.3")
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [cartItems, setCartItems] = useState<string[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showCreateCollection, setShowCreateCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [showFriendsSystem, setShowFriendsSystem] = useState(false)
  const [showGameProperties, setShowGameProperties] = useState<string | null>(null)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showGroupSystem, setShowGroupSystem] = useState(false)
  const [hiddenGames, setHiddenGames] = useState<string[]>([])

  const [user, setUser] = useState<UserType>({
    name: "Player",
    avatar: "/placeholder.svg?height=40&width=40",
    level: 15,
    friends: 42,
    bio: "Gamer apaixonado por RPGs e jogos de ação. Sempre em busca de novas aventuras!",
    joinDate: "2020-03-15",
    gamesOwned: 127,
    achievementsUnlocked: 1543,
    location: "Portugal",
    website: "https://nped.pt",
    status: "Jogando Cyberpunk 2077",
    showGroupTags: true,
    showStatus: true,
    allowComments: true,
    profileVisibility: "public",
  })

  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      id: "1",
      title: "Download Concluído",
      message: "Cyberpunk 2077 foi instalado com sucesso!",
      type: "success",
      timestamp: new Date(Date.now() - 300000),
      read: false,
    },
    {
      id: "2",
      title: "Atualização Disponível",
      message: "Nova versão do NPED Launcher disponível (v1.2.4)",
      type: "info",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: "3",
      title: "Oferta Especial",
      message: "The Witcher 3 com 75% de desconto por tempo limitado!",
      type: "warning",
      timestamp: new Date(Date.now() - 7200000),
      read: true,
    },
  ])

  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "favorites",
      name: "Favoritos",
      gameIds: ["1", "3"],
      color: "red",
    },
    {
      id: "rpg-collection",
      name: "RPGs Épicos",
      gameIds: ["1", "2"],
      color: "purple",
    },
  ])

  const [settings, setSettings] = useState<SettingsType>({
    autoStart: true,
    minimizeToTray: false,
    autoUpdate: true,
    downloadLimit: 0,
    notifications: true,
    soundEffects: true,
    theme: "dark",
    language: "pt-BR",
    connectedAccounts: [
      { platform: "Steam", username: "", connected: false },
      { platform: "Epic Games", username: "", connected: false },
      { platform: "Discord", username: "", connected: false },
      { platform: "Amazon Prime Gaming", username: "", connected: false },
      { platform: "GOG.com", username: "", connected: false },
      { platform: "Xbox", username: "", connected: false },
    ],
  })

  const [games, setGames] = useState<Game[]>([
    {
      id: "1",
      title: "Cyberpunk 2077",
      description:
        "Cyberpunk 2077 é um RPG de ação em mundo aberto que se passa em Night City, uma megalópole perigosa onde você luta pelo poder, glamour e imortalidade.",
      image: "/placeholder.svg?height=300&width=460",
      size: "70.2 GB",
      rating: 4.2,
      reviews: 284567,
      releaseDate: "2020-12-10",
      genre: ["RPG", "Ação", "Aventura"],
      price: 11.99,
      discount: 50,
      installed: true,
      downloading: false,
      downloadProgress: 0,
      lastPlayed: "2024-01-08",
      playtime: "127.5 horas",
      achievements: 23,
      isWishlisted: false,
      isFavorite: true,
      developer: "CD PROJEKT RED",
      publisher: "CD PROJEKT RED",
      collections: ["favorites", "rpg-collection"],
    },
    {
      id: "2",
      title: "The Witcher 3: Wild Hunt",
      description:
        "Como Geralt de Rivia, um caçador de monstros profissional, embarque numa aventura épica em um mundo aberto rico em conteúdo.",
      image: "/placeholder.svg?height=300&width=460",
      size: "35.7 GB",
      rating: 4.8,
      reviews: 567234,
      releaseDate: "2015-05-19",
      genre: ["RPG", "Aventura"],
      price: 7.99,
      discount: 75,
      installed: false,
      downloading: false,
      downloadProgress: 0,
      playtime: "0 horas",
      achievements: 0,
      isWishlisted: true,
      isFavorite: false,
      developer: "CD PROJEKT RED",
      publisher: "CD PROJEKT RED",
      collections: ["rpg-collection"],
    },
    {
      id: "3",
      title: "Grand Theft Auto V",
      description:
        "Quando um jovem golpista de rua, um ladrão de banco aposentado e um psicopata aterrorizante se envolvem com o submundo criminal...",
      image: "/placeholder.svg?height=300&width=460",
      size: "95.3 GB",
      rating: 4.5,
      reviews: 1234567,
      releaseDate: "2013-09-17",
      genre: ["Ação", "Aventura", "Crime"],
      price: 5.99,
      installed: true,
      downloading: false,
      downloadProgress: 0,
      lastPlayed: "2024-01-10",
      playtime: "89.2 horas",
      achievements: 15,
      isWishlisted: false,
      isFavorite: true,
      developer: "Rockstar North",
      publisher: "Rockstar Games",
      collections: ["favorites"],
    },
    {
      id: "4",
      title: "Red Dead Redemption 2",
      description:
        "A história épica de Arthur Morgan e da gangue Van der Linde, fugindo pela América em uma era de declínio do Velho Oeste.",
      image: "/placeholder.svg?height=300&width=460",
      size: "120.1 GB",
      rating: 4.7,
      reviews: 456789,
      releaseDate: "2018-10-26",
      genre: ["Ação", "Aventura", "Western"],
      price: 11.99,
      discount: 30,
      installed: false,
      downloading: false,
      downloadProgress: 0,
      playtime: "0 horas",
      achievements: 0,
      isWishlisted: true,
      isFavorite: false,
      developer: "Rockstar Studios",
      publisher: "Rockstar Games",
      collections: [],
    },
    {
      id: "5",
      title: "Counter-Strike 2",
      description:
        "O jogo de tiro tático mais popular do mundo, agora com gráficos aprimorados e nova engine Source 2.",
      image: "/placeholder.svg?height=300&width=460",
      size: "25.8 GB",
      rating: 4.3,
      reviews: 2345678,
      releaseDate: "2023-09-27",
      genre: ["Ação", "FPS", "Competitivo"],
      price: 0,
      installed: true,
      downloading: false,
      downloadProgress: 0,
      lastPlayed: "2024-01-11",
      playtime: "234.7 horas",
      achievements: 8,
      isWishlisted: false,
      isFavorite: false,
      developer: "Valve",
      publisher: "Valve",
      collections: [],
    },
    {
      id: "6",
      title: "Fortnite",
      description: "Battle Royale gratuito com construção e combate intenso.",
      image: "/placeholder.svg?height=300&width=460",
      size: "32.4 GB",
      rating: 4.1,
      reviews: 3456789,
      releaseDate: "2017-07-25",
      genre: ["Battle Royale", "Ação", "Multijogador"],
      price: 0,
      installed: false,
      downloading: false,
      downloadProgress: 0,
      playtime: "0 horas",
      achievements: 0,
      isWishlisted: false,
      isFavorite: false,
      developer: "Epic Games",
      publisher: "Epic Games",
      collections: [],
    },
    {
      id: "7",
      title: "Apex Legends",
      description: "Battle Royale com heróis únicos e habilidades especiais.",
      image: "/placeholder.svg?height=300&width=460",
      size: "28.7 GB",
      rating: 4.3,
      reviews: 2876543,
      releaseDate: "2019-02-04",
      genre: ["Battle Royale", "FPS", "Multijogador"],
      price: 0,
      installed: false,
      downloading: false,
      downloadProgress: 0,
      playtime: "0 horas",
      achievements: 0,
      isWishlisted: true,
      isFavorite: false,
      developer: "Respawn Entertainment",
      publisher: "Electronic Arts",
      collections: [],
    },
  ])

  // Auto-update check
  useEffect(() => {
    const checkForUpdates = () => {
      setTimeout(() => {
        setUpdateAvailable(Math.random() > 0.8)
      }, 2000)
    }

    checkForUpdates()
    const interval = setInterval(checkForUpdates, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentView("library")
  }

  const handleHideGame = (gameId: string) => {
    setHiddenGames([...hiddenGames, gameId])
  }

  const filteredGames = games.filter((game) => {
    if (hiddenGames.includes(game.id)) return false

    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))

    let matchesCategory = true
    if (selectedCategory === "installed") matchesCategory = game.installed
    else if (selectedCategory === "wishlist") matchesCategory = game.isWishlisted
    else if (selectedCategory === "favorites") matchesCategory = game.isFavorite
    else if (selectedCategory !== "all") {
      matchesCategory = game.genre.some((g) => g.toLowerCase() === selectedCategory.toLowerCase())
    }

    let matchesCollection = true
    if (selectedCollection) {
      const collection = collections.find((c) => c.id === selectedCollection)
      matchesCollection = collection ? collection.gameIds.includes(game.id) : false
    }

    return matchesSearch && matchesCategory && matchesCollection
  })

  const installedGames = games.filter((game) => game.installed)
  const downloadingGames = games.filter((game) => game.downloading)
  const wishlistGames = games.filter((game) => game.isWishlisted)
  const favoriteGames = games.filter((game) => game.isFavorite)
  const unreadNotifications = notifications.filter((n) => !n.read).length

  const handleInstallGame = (gameId: string) => {
    setGames((prev) =>
      prev.map((game) => (game.id === gameId ? { ...game, downloading: true, downloadProgress: 0 } : game)),
    )

    const interval = setInterval(() => {
      setGames((prev) =>
        prev.map((game) => {
          if (game.id === gameId && game.downloading) {
            const newProgress = Math.min(game.downloadProgress + Math.random() * 8, 100)
            if (newProgress >= 100) {
              clearInterval(interval)
              // Add notification
              const newNotification: NotificationType = {
                id: Date.now().toString(),
                title: "Download Concluído",
                message: `${game.title} foi instalado com sucesso!`,
                type: "success",
                timestamp: new Date(),
                read: false,
              }
              setNotifications((prev) => [newNotification, ...prev])
              return { ...game, downloading: false, installed: true, downloadProgress: 100 }
            }
            return { ...game, downloadProgress: newProgress }
          }
          return game
        }),
      )
    }, 500)
  }

  const handleToggleFavorite = (gameId: string) => {
    setGames((prev) =>
      prev.map((game) => {
        if (game.id === gameId) {
          const isFavorite = !game.isFavorite
          let collections = [...game.collections]

          if (isFavorite && !collections.includes("favorites")) {
            collections.push("favorites")
          } else if (!isFavorite) {
            collections = collections.filter((c) => c !== "favorites")
          }

          return { ...game, isFavorite, collections }
        }
        return game
      }),
    )
  }

  const handleToggleWishlist = (gameId: string) => {
    setGames((prev) => prev.map((game) => (game.id === gameId ? { ...game, isWishlisted: !game.isWishlisted } : game)))
  }

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: newCollectionName.trim(),
        gameIds: [],
        color: "blue",
      }
      setCollections([...collections, newCollection])
      setNewCollectionName("")
      setShowCreateCollection(false)
    }
  }

  const handleAddToCollection = (gameId: string, collectionId: string) => {
    setCollections((prev) =>
      prev.map((collection) => {
        if (collection.id === collectionId && !collection.gameIds.includes(gameId)) {
          return { ...collection, gameIds: [...collection.gameIds, gameId] }
        }
        return collection
      }),
    )

    setGames((prev) =>
      prev.map((game) => {
        if (game.id === gameId && !game.collections.includes(collectionId)) {
          return { ...game, collections: [...game.collections, collectionId] }
        }
        return { ...game, collections: [...game.collections, collectionId] }
        return game
      }),
    )
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }

  const handleUninstallGame = (gameId: string) => {
    setGames((prev) =>
      prev.map((game) => (game.id === gameId ? { ...game, installed: false, downloadProgress: 0 } : game)),
    )
  }

  const handleConnectAccount = (platform: string) => {
    setSettings((prev) => ({
      ...prev,
      connectedAccounts: prev.connectedAccounts.map((account) =>
        account.platform === platform
          ? {
              ...account,
              connected: !account.connected,
              username: account.connected ? "" : `user_${platform.toLowerCase().replace(/\s+/g, "")}`,
            }
          : account,
      ),
    }))
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Steam":
        return "🎮"
      case "Epic Games":
        return "🎯"
      case "Discord":
        return "💬"
      case "Amazon Prime Gaming":
        return "📦"
      case "GOG.com":
        return "🎲"
      case "Xbox":
        return "🎮"
      default:
        return "🔗"
    }
  }

  const categories = [
    { id: "all", name: "Todos os Jogos", count: games.length },
    { id: "installed", name: "Instalados", count: installedGames.length },
    { id: "favorites", name: "Favoritos", count: favoriteGames.length },
    { id: "wishlist", name: "Lista de Desejos", count: wishlistGames.length },
  ]

  const showSidebar = currentView === "library"

  // Se não estiver logado, mostrar página de login
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  // Se estiver na página de editar perfil
  if (currentView === "edit-profile") {
    return (
      <EditProfilePage
        user={user}
        onBack={() => setCurrentView("profile")}
        onSave={(updates) => {
          setUser({ ...user, ...updates })
          setCurrentView("profile")
        }}
      />
    )
  }

  // Se estiver na página da lista de desejos
  if (currentView === "wishlist") {
    return (
      <WishlistPage
        games={games}
        onBack={() => setCurrentView("store")}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(id) => setCartItems([...cartItems, id])}
        onInstall={handleInstallGame}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Top Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-800 border-b border-slate-700"
      >
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-400 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">N</span>
              </div>
              <span className="text-white font-semibold">NPED</span>
            </div>

            <nav className="flex items-center gap-4 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className={`text-slate-300 hover:text-white ${currentView === "library" ? "text-white bg-slate-700" : ""}`}
                onClick={() => setCurrentView("library")}
              >
                BIBLIOTECA
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-slate-300 hover:text-white ${currentView === "store" ? "text-white bg-slate-700" : ""}`}
                onClick={() => setCurrentView("store")}
              >
                LOJA
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-slate-300 hover:text-white ${currentView === "community" ? "text-white bg-slate-700" : ""}`}
                onClick={() => setCurrentView("community")}
              >
                COMUNIDADE
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {updateAvailable && (
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                <RefreshCw className="w-3 h-3 mr-1" />
                Atualizar
              </Button>
            )}

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8 relative">
                    <Bell className="w-4 h-4" />
                    {unreadNotifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center bg-red-600">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700 w-80">
                  <div className="p-2">
                    <h3 className="font-semibold text-white mb-2">Notificações</h3>
                    {notifications.length === 0 ? (
                      <p className="text-slate-400 text-sm">Nenhuma notificação</p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-2 rounded cursor-pointer transition-colors ${
                              notification.read ? "bg-slate-700/50" : "bg-slate-700"
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                                <p className="text-xs text-slate-300 mt-1">{notification.message}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {notification.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                              {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="w-8 h-8 relative" onClick={() => setCurrentView("cart")}>
                <ShoppingCart className="w-4 h-4" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">
                    {cartItems.length}
                  </Badge>
                )}
              </Button>

              {/* Wishlist Button */}
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 relative"
                onClick={() => setCurrentView("wishlist")}
              >
                <Heart className="w-4 h-4" />
                {wishlistGames.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center bg-red-600">
                    {wishlistGames.length}
                  </Badge>
                )}
              </Button>

              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setShowFriendsSystem(true)}>
                <Users className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setShowGroupSystem(true)}>
                <Users className="w-4 h-4" />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-slate-300 hover:text-white">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                <DropdownMenuItem className="text-slate-300 cursor-pointer" onClick={() => setCurrentView("profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-slate-300 cursor-pointer"
                  onClick={() => setCurrentView("edit-profile")}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 cursor-pointer" onClick={() => setCurrentView("settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="text-slate-300 cursor-pointer" onClick={handleLogout}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-1 text-xs text-slate-400">
              {isOnline ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3 text-red-500" />}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1">
          <AnimatedPageTransition currentView={currentView}>
            {/* Library View */}
            {currentView === "library" && (
              <SteamStyleLibrary
                games={filteredGames}
                collections={collections}
                onInstall={handleInstallGame}
                onPlay={(id) => alert(`Iniciando ${games.find((g) => g.id === id)?.title}...`)}
                onUninstall={handleUninstallGame}
                onToggleFavorite={handleToggleFavorite}
                onCreateCollection={() => setShowCreateCollection(true)}
                onAddToCollection={handleAddToCollection}
                onDeleteCollection={(collectionId) => {
                  setCollections((prev) => prev.filter((c) => c.id !== collectionId))
                }}
                onShowProperties={setShowGameProperties}
                onHideGame={handleHideGame}
              />
            )}

            {/* Profile View */}
            {currentView === "profile" && (
              <EnhancedProfile user={user} games={games} onEditProfile={() => setCurrentView("edit-profile")} />
            )}

            {/* Settings View */}
            {currentView === "settings" && (
              <div className="p-6">
                <div className="max-w-2xl mx-auto">
                  <h1 className="text-2xl font-bold text-white mb-6">Configurações</h1>

                  <Tabs defaultValue="general" className="space-y-6">
                    <TabsList className="bg-slate-800 border-slate-700">
                      <TabsTrigger value="general" className="data-[state=active]:bg-slate-700">
                        Geral
                      </TabsTrigger>
                      <TabsTrigger value="downloads" className="data-[state=active]:bg-slate-700">
                        Downloads
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700">
                        Notificações
                      </TabsTrigger>
                      <TabsTrigger value="accounts" className="data-[state=active]:bg-slate-700">
                        Contas
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6">
                      <Card className="bg-slate-800 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white">Configurações Gerais</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="auto-start" className="text-slate-300">
                              Iniciar com o Windows
                            </Label>
                            <Switch
                              id="auto-start"
                              checked={settings.autoStart}
                              onCheckedChange={(checked) => setSettings({ ...settings, autoStart: checked })}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="minimize-tray" className="text-slate-300">
                              Minimizar para bandeja do sistema
                            </Label>
                            <Switch
                              id="minimize-tray"
                              checked={settings.minimizeToTray}
                              onCheckedChange={(checked) => setSettings({ ...settings, minimizeToTray: checked })}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="auto-update" className="text-slate-300">
                              Atualizações automáticas
                            </Label>
                            <Switch
                              id="auto-update"
                              checked={settings.autoUpdate}
                              onCheckedChange={(checked) => setSettings({ ...settings, autoUpdate: checked })}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="downloads" className="space-y-6">
                      <Card className="bg-slate-800 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white">Configurações de Download</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="download-limit" className="text-slate-300 mb-2 block">
                              Limite de velocidade (MB/s) - 0 = Ilimitado
                            </Label>
                            <Input
                              id="download-limit"
                              type="number"
                              value={settings.downloadLimit}
                              onChange={(e) =>
                                setSettings({ ...settings, downloadLimit: Number.parseInt(e.target.value) || 0 })
                              }
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                      <Card className="bg-slate-800 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white">Configurações de Notificações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="notifications" className="text-slate-300">
                              Ativar notificações
                            </Label>
                            <Switch
                              id="notifications"
                              checked={settings.notifications}
                              onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="sound-effects" className="text-slate-300">
                              Efeitos sonoros
                            </Label>
                            <Switch
                              id="sound-effects"
                              checked={settings.soundEffects}
                              onCheckedChange={(checked) => setSettings({ ...settings, soundEffects: checked })}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="accounts" className="space-y-6">
                      <Card className="bg-slate-800 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Gamepad2 className="w-5 h-5" />
                            Contas Conectadas
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-slate-400 text-sm mb-4">
                            Conecte suas contas de gaming para sincronizar jogos e conquistas.
                          </p>

                          {settings.connectedAccounts.map((account) => (
                            <div
                              key={account.platform}
                              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{getPlatformIcon(account.platform)}</span>
                                <div>
                                  <h3 className="text-white font-medium">{account.platform}</h3>
                                  {account.connected ? (
                                    <p className="text-green-400 text-sm">Conectado como {account.username}</p>
                                  ) : (
                                    <p className="text-slate-400 text-sm">Não conectado</p>
                                  )}
                                </div>
                              </div>

                              <Button
                                variant={account.connected ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleConnectAccount(account.platform)}
                                className={
                                  account.connected
                                    ? "text-red-400 border-red-400 hover:bg-red-400/10"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }
                              >
                                {account.connected ? (
                                  <>
                                    <Unlink className="w-4 h-4 mr-2" />
                                    Desconectar
                                  </>
                                ) : (
                                  <>
                                    <Link className="w-4 h-4 mr-2" />
                                    Conectar
                                  </>
                                )}
                              </Button>
                            </div>
                          ))}

                          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                            <h4 className="text-blue-400 font-medium mb-2">💡 Dica</h4>
                            <p className="text-slate-300 text-sm">
                              Conectar suas contas permite que o NPED sincronize automaticamente sua biblioteca de
                              jogos, conquistas e progresso entre diferentes plataformas.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}

            {/* Community View */}
            {currentView === "community" && (
              <div className="p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-4xl">N</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">NPED Launcher</h1>
                    <p className="text-xl text-slate-300 mb-6">
                      O seu launcher de jogos definitivo - Simples, Rápido e Poderoso
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Download className="w-5 h-5" />
                          Recursos Principais
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-slate-300">Downloads rápidos e seguros</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-slate-300">Biblioteca organizada</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-slate-300">Atualizações automáticas</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-slate-300">Interface moderna</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-slate-300">Coleções personalizadas</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Sobre o NPED
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 mb-4">
                          O NPED Launcher foi criado para oferecer a melhor experiência de gaming, combinando
                          simplicidade com recursos avançados. Nossa missão é tornar o acesso aos seus jogos favoritos
                          mais fácil e organizado.
                        </p>
                        <p className="text-slate-300">
                          Desenvolvido com tecnologias modernas e foco na experiência do usuário, o NPED está sempre
                          evoluindo para atender às necessidades da comunidade gamer.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center">
                    <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-slate-700">
                      <CardContent className="p-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Visite nosso site oficial</h2>
                        <p className="text-slate-200 mb-6">
                          Descubra mais sobre o NPED, baixe a versão mais recente e junte-se à nossa comunidade.
                        </p>
                        <Button
                          className="bg-white text-slate-900 hover:bg-slate-100"
                          onClick={() => window.open("https://nped.pt", "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visitar NPED.pt
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Store View */}
            {currentView === "store" && (
              <EnhancedSteamStore
                games={games}
                onInstall={handleInstallGame}
                onWishlist={handleToggleWishlist}
                onAddToCart={(id) => setCartItems([...cartItems, id])}
              />
            )}

            {currentView === "cart" && (
              <CartView
                cartItems={cartItems}
                games={games}
                onRemoveFromCart={(id) => setCartItems(cartItems.filter((item) => item !== id))}
                onInstall={handleInstallGame}
              />
            )}
          </AnimatedPageTransition>
        </main>
      </div>
      {/* Modais */}
      {showGameProperties && (
        <GamePropertiesModal
          game={games.find((g) => g.id === showGameProperties)}
          onClose={() => setShowGameProperties(null)}
          onSave={(gameId, updates) => {
            setGames((prev) => prev.map((g) => (g.id === gameId ? { ...g, ...updates } : g)))
          }}
          onUninstall={handleUninstallGame}
        />
      )}

      {showEditProfile && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSave={(updates) => {
            setUser({ ...user, ...updates })
          }}
        />
      )}

      {showGroupSystem && <GroupSystem onClose={() => setShowGroupSystem(false)} user={user} />}
      {showFriendsSystem && <FriendsSystem onClose={() => setShowFriendsSystem(false)} />}
    </div>
  )
}

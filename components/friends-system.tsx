"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  MessageCircle,
  UserPlus,
  Search,
  Send,
  Phone,
  Video,
  Settings,
  Crown,
  Shield,
  Gamepad2,
  Clock,
} from "lucide-react"

interface Friend {
  id: string
  name: string
  avatar: string
  status: "online" | "away" | "busy" | "offline"
  currentGame?: string
  lastSeen?: string
}

interface Group {
  id: string
  name: string
  description: string
  memberCount: number
  avatar: string
  isOwner: boolean
  isAdmin: boolean
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
}

interface FriendsSystemProps {
  onClose: () => void
}

export function FriendsSystem({ onClose }: FriendsSystemProps) {
  const [activeTab, setActiveTab] = useState("friends")
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const [friends] = useState<Friend[]>([
    {
      id: "1",
      name: "João123",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      currentGame: "Counter-Strike 2",
    },
    {
      id: "2",
      name: "GamerGirl",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
      currentGame: "Cyberpunk 2077",
    },
    {
      id: "3",
      name: "ProPlayer",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "busy",
      currentGame: "The Witcher 3",
    },
    {
      id: "4",
      name: "CasualGamer",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastSeen: "há 2 horas",
    },
  ])

  const [groups] = useState<Group[]>([
    {
      id: "1",
      name: "RPG Lovers",
      description: "Grupo para fãs de RPGs",
      memberCount: 24,
      avatar: "/placeholder.svg?height=40&width=40",
      isOwner: true,
      isAdmin: true,
    },
    {
      id: "2",
      name: "FPS Masters",
      description: "Competitivo de FPS",
      memberCount: 156,
      avatar: "/placeholder.svg?height=40&width=40",
      isOwner: false,
      isAdmin: false,
    },
  ])

  const [chatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "1",
      senderName: "João123",
      content: "Oi! Vamos jogar CS2?",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "2",
      senderId: "me",
      senderName: "Você",
      content: "Claro! Já estou entrando",
      timestamp: new Date(Date.now() - 240000),
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online"
      case "away":
        return "Ausente"
      case "busy":
        return "Ocupado"
      default:
        return "Offline"
    }
  }

  const sendMessage = () => {
    if (chatMessage.trim()) {
      // Implementar envio de mensagem
      setChatMessage("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[800px] h-[600px] bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Amigos & Grupos
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-80px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="bg-slate-700 border-b border-slate-600 w-full rounded-none">
              <TabsTrigger value="friends" className="data-[state=active]:bg-slate-600">
                Amigos ({friends.length})
              </TabsTrigger>
              <TabsTrigger value="groups" className="data-[state=active]:bg-slate-600">
                Grupos ({groups.length})
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-slate-600">
                Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="friends" className="h-full p-4">
              <div className="flex h-full gap-4">
                {/* Friends List */}
                <div className="w-1/2 space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar amigos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>

                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {friends.map((friend) => (
                        <div
                          key={friend.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedFriend === friend.id ? "bg-slate-600" : "bg-slate-700 hover:bg-slate-650"
                          }`}
                          onClick={() => setSelectedFriend(friend.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{friend.name[0]}</AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${getStatusColor(friend.status)}`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{friend.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {getStatusText(friend.status)}
                                </Badge>
                              </div>
                              {friend.currentGame ? (
                                <div className="flex items-center gap-1 text-xs text-green-400">
                                  <Gamepad2 className="w-3 h-3" />
                                  {friend.currentGame}
                                </div>
                              ) : friend.lastSeen ? (
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                  <Clock className="w-3 h-3" />
                                  {friend.lastSeen}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Friend Details */}
                <div className="w-1/2">
                  {selectedFriend ? (
                    <Card className="bg-slate-700 border-slate-600 h-full">
                      <CardContent className="p-4">
                        {(() => {
                          const friend = friends.find((f) => f.id === selectedFriend)
                          if (!friend) return null

                          return (
                            <div className="space-y-4">
                              <div className="text-center">
                                <Avatar className="w-20 h-20 mx-auto mb-3">
                                  <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-2xl">{friend.name[0]}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-bold text-white">{friend.name}</h3>
                                <Badge className={getStatusColor(friend.status)}>{getStatusText(friend.status)}</Badge>
                              </div>

                              {friend.currentGame && (
                                <div className="bg-slate-600 p-3 rounded-lg">
                                  <div className="flex items-center gap-2 text-green-400">
                                    <Gamepad2 className="w-4 h-4" />
                                    <span className="font-medium">Jogando agora</span>
                                  </div>
                                  <p className="text-white">{friend.currentGame}</p>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Chat
                                </Button>
                                <Button variant="outline" size="icon">
                                  <Phone className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                  <Video className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )
                        })()}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      Selecione um amigo para ver detalhes
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="groups" className="h-full p-4">
              <div className="flex h-full gap-4">
                {/* Groups List */}
                <div className="w-1/2 space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar grupos..."
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Criar
                    </Button>
                  </div>

                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {groups.map((group) => (
                        <div
                          key={group.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedGroup === group.id ? "bg-slate-600" : "bg-slate-700 hover:bg-slate-650"
                          }`}
                          onClick={() => setSelectedGroup(group.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={group.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{group.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{group.name}</span>
                                {group.isOwner && <Crown className="w-4 h-4 text-yellow-500" />}
                                {group.isAdmin && !group.isOwner && <Shield className="w-4 h-4 text-blue-500" />}
                              </div>
                              <p className="text-xs text-slate-400">{group.memberCount} membros</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Group Details */}
                <div className="w-1/2">
                  {selectedGroup ? (
                    <Card className="bg-slate-700 border-slate-600 h-full">
                      <CardContent className="p-4">
                        {(() => {
                          const group = groups.find((g) => g.id === selectedGroup)
                          if (!group) return null

                          return (
                            <div className="space-y-4">
                              <div className="text-center">
                                <Avatar className="w-20 h-20 mx-auto mb-3">
                                  <AvatarImage src={group.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-2xl">{group.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <h3 className="text-xl font-bold text-white">{group.name}</h3>
                                  {group.isOwner && <Crown className="w-5 h-5 text-yellow-500" />}
                                  {group.isAdmin && !group.isOwner && <Shield className="w-5 h-5 text-blue-500" />}
                                </div>
                                <p className="text-slate-300">{group.description}</p>
                                <Badge variant="outline" className="mt-2">
                                  {group.memberCount} membros
                                </Badge>
                              </div>

                              <div className="space-y-2">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Chat do Grupo
                                </Button>
                                <Button variant="outline" className="w-full">
                                  <Users className="w-4 h-4 mr-2" />
                                  Ver Membros
                                </Button>
                                {(group.isOwner || group.isAdmin) && (
                                  <Button variant="outline" className="w-full">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Configurações
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        })()}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      Selecione um grupo para ver detalhes
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="h-full p-4">
              <div className="h-full flex flex-col">
                {/* Chat Messages */}
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-3">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === "me" ? "bg-blue-600 text-white" : "bg-slate-700 text-white"
                          }`}
                        >
                          {message.senderId !== "me" && (
                            <p className="text-xs text-slate-300 mb-1">{message.senderName}</p>
                          )}
                          <p>{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

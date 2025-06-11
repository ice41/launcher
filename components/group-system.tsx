"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  Search,
  Plus,
  Settings,
  Crown,
  Shield,
  MessageCircle,
  UserPlus,
  X,
  Save,
  Upload,
  Check,
  MoreVertical,
  Globe,
  Lock,
  User,
  UserMinus,
  LogOut,
  Trash2,
} from "lucide-react"
import { Label } from "@/components/ui/label"

interface GroupMember {
  id: string
  name: string
  avatar: string
  role: "owner" | "admin" | "member"
  joinDate: string
}

interface GroupJoinRequest {
  id: string
  name: string
  avatar: string
  requestDate: string
}

interface Group {
  id: string
  name: string
  description: string
  avatar: string
  tag: string
  tagColor: string
  memberCount: number
  isPublic: boolean
  createdAt: string
  owner: string
  members: GroupMember[]
  joinRequests: GroupJoinRequest[]
}

interface GroupSystemProps {
  onClose: () => void
  user: any
}

export function GroupSystem({ onClose, user }: GroupSystemProps) {
  const [activeTab, setActiveTab] = useState("myGroups")
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showGroupProfile, setShowGroupProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editMode, setEditMode] = useState(false)

  // Dados de exemplo
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "1",
      name: "RPG Lovers",
      description:
        "Grupo para fãs de RPGs e jogos de aventura. Partilhamos dicas, organizamos sessões de jogo e discutimos os últimos lançamentos.",
      avatar: "/placeholder.svg?height=80&width=80",
      tag: "RPG",
      tagColor: "purple",
      memberCount: 24,
      isPublic: true,
      createdAt: "2023-05-15",
      owner: user.name,
      members: [
        { id: "1", name: user.name, avatar: user.avatar, role: "owner", joinDate: "2023-05-15" },
        {
          id: "2",
          name: "João123",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "admin",
          joinDate: "2023-05-16",
        },
        {
          id: "3",
          name: "GamerGirl",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "member",
          joinDate: "2023-05-20",
        },
        {
          id: "4",
          name: "RPGMaster",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "member",
          joinDate: "2023-06-01",
        },
      ],
      joinRequests: [
        { id: "5", name: "NewPlayer", avatar: "/placeholder.svg?height=40&width=40", requestDate: "2023-07-10" },
      ],
    },
    {
      id: "2",
      name: "FPS Masters",
      description: "Competitivo de FPS. Treinos diários e participação em torneios.",
      avatar: "/placeholder.svg?height=80&width=80",
      tag: "FPS",
      tagColor: "red",
      memberCount: 156,
      isPublic: false,
      createdAt: "2023-03-10",
      owner: "ProGamer",
      members: [
        {
          id: "1",
          name: "ProGamer",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "owner",
          joinDate: "2023-03-10",
        },
        { id: "2", name: user.name, avatar: user.avatar, role: "member", joinDate: "2023-04-05" },
      ],
      joinRequests: [],
    },
  ])

  // Grupo selecionado
  const currentGroup = groups.find((g) => g.id === selectedGroup)

  // Grupos do usuário
  const myGroups = groups.filter((g) => g.members.some((m) => m.name === user.name))

  // Grupos públicos que o usuário não é membro
  const publicGroups = groups.filter((g) => g.isPublic && !g.members.some((m) => m.name === user.name))

  // Verificar se o usuário é dono ou admin do grupo
  const isOwnerOrAdmin = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId)
    if (!group) return false
    const member = group.members.find((m) => m.name === user.name)
    return member && (member.role === "owner" || member.role === "admin")
  }

  const isOwner = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId)
    if (!group) return false
    const member = group.members.find((m) => m.name === user.name)
    return member && member.role === "owner"
  }

  // Criar novo grupo
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    tag: "",
    tagColor: "blue",
    isPublic: true,
  })

  const handleCreateGroup = () => {
    if (newGroup.name.trim() && newGroup.tag.trim()) {
      const group: Group = {
        id: Date.now().toString(),
        name: newGroup.name,
        description: newGroup.description,
        avatar: "/placeholder.svg?height=80&width=80",
        tag: newGroup.tag,
        tagColor: newGroup.tagColor,
        memberCount: 1,
        isPublic: newGroup.isPublic,
        createdAt: new Date().toISOString().split("T")[0],
        owner: user.name,
        members: [
          {
            id: "1",
            name: user.name,
            avatar: user.avatar,
            role: "owner",
            joinDate: new Date().toISOString().split("T")[0],
          },
        ],
        joinRequests: [],
      }

      setGroups([...groups, group])
      setShowCreateGroup(false)
      setSelectedGroup(group.id)
      setActiveTab("myGroups")
    }
  }

  // Editar grupo
  const [editedGroup, setEditedGroup] = useState<Partial<Group>>({})

  const handleSaveGroupChanges = () => {
    if (!currentGroup) return

    setGroups(groups.map((g) => (g.id === currentGroup.id ? { ...g, ...editedGroup } : g)))

    setEditMode(false)
  }

  // Gerenciar membros
  const handlePromoteToAdmin = (memberId: string) => {
    if (!currentGroup) return

    setGroups(
      groups.map((g) =>
        g.id === currentGroup.id
          ? {
              ...g,
              members: g.members.map((m) => (m.id === memberId ? { ...m, role: "admin" } : m)),
            }
          : g,
      ),
    )
  }

  const handleDemoteToMember = (memberId: string) => {
    if (!currentGroup) return

    setGroups(
      groups.map((g) =>
        g.id === currentGroup.id
          ? {
              ...g,
              members: g.members.map((m) => (m.id === memberId ? { ...m, role: "member" } : m)),
            }
          : g,
      ),
    )
  }

  const handleRemoveMember = (memberId: string) => {
    if (!currentGroup) return

    setGroups(
      groups.map((g) =>
        g.id === currentGroup.id
          ? {
              ...g,
              members: g.members.filter((m) => m.id !== memberId),
              memberCount: g.memberCount - 1,
            }
          : g,
      ),
    )
  }

  // Gerenciar solicitações
  const handleAcceptRequest = (requestId: string) => {
    if (!currentGroup) return

    const request = currentGroup.joinRequests.find((r) => r.id === requestId)
    if (!request) return

    setGroups(
      groups.map((g) =>
        g.id === currentGroup.id
          ? {
              ...g,
              members: [
                ...g.members,
                {
                  id: request.id,
                  name: request.name,
                  avatar: request.avatar,
                  role: "member",
                  joinDate: new Date().toISOString().split("T")[0],
                },
              ],
              joinRequests: g.joinRequests.filter((r) => r.id !== requestId),
              memberCount: g.memberCount + 1,
            }
          : g,
      ),
    )
  }

  const handleRejectRequest = (requestId: string) => {
    if (!currentGroup) return

    setGroups(
      groups.map((g) =>
        g.id === currentGroup.id
          ? {
              ...g,
              joinRequests: g.joinRequests.filter((r) => r.id !== requestId),
            }
          : g,
      ),
    )
  }

  // Entrar/Sair de grupo
  const handleJoinGroup = (groupId: string) => {
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              members: [
                ...g.members,
                {
                  id: Date.now().toString(),
                  name: user.name,
                  avatar: user.avatar,
                  role: "member",
                  joinDate: new Date().toISOString().split("T")[0],
                },
              ],
              memberCount: g.memberCount + 1,
            }
          : g,
      ),
    )
  }

  const handleRequestJoin = (groupId: string) => {
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              joinRequests: [
                ...g.joinRequests,
                {
                  id: Date.now().toString(),
                  name: user.name,
                  avatar: user.avatar,
                  requestDate: new Date().toISOString().split("T")[0],
                },
              ],
            }
          : g,
      ),
    )
  }

  const handleLeaveGroup = (groupId: string) => {
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              members: g.members.filter((m) => m.name !== user.name),
              memberCount: g.memberCount - 1,
            }
          : g,
      ),
    )

    if (selectedGroup === groupId) {
      setSelectedGroup(null)
    }
  }

  // Excluir grupo
  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter((g) => g.id !== groupId))
    setSelectedGroup(null)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <Card className="w-[900px] h-[650px] bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Grupos
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-80px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="bg-slate-700 border-b border-slate-600 w-full rounded-none">
              <TabsTrigger value="myGroups" className="data-[state=active]:bg-slate-600">
                Meus Grupos ({myGroups.length})
              </TabsTrigger>
              <TabsTrigger value="discover" className="data-[state=active]:bg-slate-600">
                Descobrir
              </TabsTrigger>
              {selectedGroup && (
                <TabsTrigger value="groupProfile" className="data-[state=active]:bg-slate-600">
                  {currentGroup?.name}
                </TabsTrigger>
              )}
            </TabsList>

            {/* Meus Grupos */}
            <TabsContent value="myGroups" className="h-full p-4">
              <div className="flex h-full gap-4">
                {/* Lista de Grupos */}
                <div className="w-1/3 space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar grupos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowCreateGroup(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar
                    </Button>
                  </div>

                  <ScrollArea className="h-[450px]">
                    <div className="space-y-2">
                      {myGroups.length === 0 ? (
                        <div className="text-center p-4 text-slate-400">
                          <p>Não estás em nenhum grupo.</p>
                          <p className="text-sm mt-2">Cria um novo grupo ou descobre grupos existentes.</p>
                        </div>
                      ) : (
                        myGroups.map((group) => (
                          <div
                            key={group.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedGroup === group.id ? "bg-slate-600" : "bg-slate-700 hover:bg-slate-650"
                            }`}
                            onClick={() => {
                              setSelectedGroup(group.id)
                              setActiveTab("groupProfile")
                              setEditMode(false)
                              setEditedGroup({})
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={group.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{group.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium">{group.name}</span>
                                  {group.owner === user.name && <Crown className="w-4 h-4 text-yellow-500" />}
                                  {group.members.some((m) => m.name === user.name && m.role === "admin") && (
                                    <Shield className="w-4 h-4 text-blue-500" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={`bg-${group.tagColor}-600 text-xs`}
                                    style={{ backgroundColor: `var(--${group.tagColor}-600)` }}
                                  >
                                    {group.tag}
                                  </Badge>
                                  <span className="text-xs text-slate-400">{group.memberCount} membros</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Detalhes do Grupo */}
                <div className="w-2/3">
                  {selectedGroup && currentGroup ? (
                    <Card className="bg-slate-700 border-slate-600 h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={currentGroup.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-2xl">{currentGroup.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h2 className="text-xl font-bold text-white">{currentGroup.name}</h2>
                              {currentGroup.isPublic ? (
                                <Badge variant="outline" className="border-green-500 text-green-500">
                                  <Globe className="w-3 h-3 mr-1" /> Público
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-orange-500 text-orange-500">
                                  <Lock className="w-3 h-3 mr-1" /> Privado
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                className={`bg-${currentGroup.tagColor}-600 text-xs`}
                                style={{ backgroundColor: `var(--${currentGroup.tagColor}-600)` }}
                              >
                                {currentGroup.tag}
                              </Badge>
                              <span className="text-sm text-slate-300">
                                Criado em {new Date(currentGroup.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div>
                            {isOwnerOrAdmin(currentGroup.id) ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setActiveTab("groupProfile")
                                  setEditMode(true)
                                  setEditedGroup({
                                    name: currentGroup.name,
                                    description: currentGroup.description,
                                    tag: currentGroup.tag,
                                    tagColor: currentGroup.tagColor,
                                    isPublic: currentGroup.isPublic,
                                  })
                                }}
                              >
                                <Settings className="w-4 h-4 mr-2" />
                                Gerenciar
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-400 border-red-400 hover:bg-red-400/10"
                                onClick={() => handleLeaveGroup(currentGroup.id)}
                              >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sair do Grupo
                              </Button>
                            )}
                          </div>
                        </div>

                        <p className="text-slate-300 mb-6">{currentGroup.description}</p>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Membros ({currentGroup.memberCount})</h3>
                            {isOwnerOrAdmin(currentGroup.id) && currentGroup.joinRequests.length > 0 && (
                              <Badge className="bg-blue-600">{currentGroup.joinRequests.length} pedido(s)</Badge>
                            )}
                          </div>

                          <ScrollArea className="h-[300px]">
                            <div className="space-y-2">
                              {isOwnerOrAdmin(currentGroup.id) && currentGroup.joinRequests.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-slate-300 mb-2">Pedidos de Adesão</h4>
                                  {currentGroup.joinRequests.map((request) => (
                                    <div
                                      key={request.id}
                                      className="p-3 bg-blue-900/20 rounded-lg flex items-center justify-between"
                                    >
                                      <div className="flex items-center gap-3">
                                        <Avatar className="w-8 h-8">
                                          <AvatarImage src={request.avatar || "/placeholder.svg"} />
                                          <AvatarFallback>{request.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="text-white font-medium">{request.name}</p>
                                          <p className="text-xs text-slate-400">
                                            Pedido em {new Date(request.requestDate).toLocaleDateString()}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          className="bg-green-600 hover:bg-green-700"
                                          onClick={() => handleAcceptRequest(request.id)}
                                        >
                                          <Check className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="border-red-400 text-red-400 hover:bg-red-400/10"
                                          onClick={() => handleRejectRequest(request.id)}
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {currentGroup.members.map((member) => (
                                <div
                                  key={member.id}
                                  className="p-3 bg-slate-600/50 rounded-lg flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className="text-white font-medium">{member.name}</p>
                                        {member.role === "owner" && (
                                          <Crown className="w-4 h-4 text-yellow-500" title="Dono do Grupo" />
                                        )}
                                        {member.role === "admin" && (
                                          <Shield className="w-4 h-4 text-blue-500" title="Administrador" />
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-400">
                                        Membro desde {new Date(member.joinDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>

                                  {isOwner(currentGroup.id) && member.name !== user.name && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreVertical className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent className="bg-slate-800 border-slate-700">
                                        {member.role === "member" && (
                                          <DropdownMenuItem
                                            className="text-blue-400 cursor-pointer"
                                            onClick={() => handlePromoteToAdmin(member.id)}
                                          >
                                            <Shield className="w-4 h-4 mr-2" />
                                            Promover a Admin
                                          </DropdownMenuItem>
                                        )}
                                        {member.role === "admin" && (
                                          <DropdownMenuItem
                                            className="text-slate-300 cursor-pointer"
                                            onClick={() => handleDemoteToMember(member.id)}
                                          >
                                            <User className="w-4 h-4 mr-2" />
                                            Rebaixar para Membro
                                          </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator className="bg-slate-700" />
                                        <DropdownMenuItem
                                          className="text-red-400 cursor-pointer"
                                          onClick={() => handleRemoveMember(member.id)}
                                        >
                                          <UserMinus className="w-4 h-4 mr-2" />
                                          Remover do Grupo
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      <div className="text-center">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Selecione um grupo para ver detalhes</p>
                        <p className="text-sm mt-2">ou crie um novo grupo</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Descobrir Grupos */}
            <TabsContent value="discover" className="h-full p-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input placeholder="Procurar grupos..." className="pl-10 bg-slate-700 border-slate-600 text-white" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {publicGroups.map((group) => (
                    <Card key={group.id} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={group.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{group.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-white font-medium">{group.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`bg-${group.tagColor}-600 text-xs`}
                                style={{ backgroundColor: `var(--${group.tagColor}-600)` }}
                              >
                                {group.tag}
                              </Badge>
                              <span className="text-xs text-slate-400">{group.memberCount} membros</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-slate-300 mb-4 line-clamp-2">{group.description}</p>

                        <div className="flex justify-between items-center">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              if (group.isPublic) {
                                handleJoinGroup(group.id)
                              } else {
                                handleRequestJoin(group.id)
                              }
                            }}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            {group.isPublic ? "Entrar" : "Solicitar Adesão"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedGroup(group.id)
                              setActiveTab("groupProfile")
                            }}
                          >
                            Ver Detalhes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {publicGroups.length === 0 && (
                    <div className="col-span-3 text-center p-8 text-slate-400">
                      <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Não há grupos públicos disponíveis no momento.</p>
                      <p className="text-sm mt-2">Crie o seu próprio grupo!</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Perfil do Grupo */}
            <TabsContent value="groupProfile" className="h-full">
              {currentGroup && (
                <div className="h-full">
                  {editMode ? (
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-white mb-6">Editar Grupo</h2>

                      <div className="space-y-6">
                        <div className="flex gap-6">
                          <div className="w-1/4">
                            <div className="flex flex-col items-center gap-4">
                              <Avatar className="w-24 h-24">
                                <AvatarImage src={currentGroup.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-3xl">{currentGroup.name[0]}</AvatarFallback>
                              </Avatar>
                              <Button variant="outline" className="w-full">
                                <Upload className="w-4 h-4 mr-2" />
                                Alterar Avatar
                              </Button>
                            </div>
                          </div>

                          <div className="w-3/4 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="group-name" className="text-slate-300">
                                Nome do Grupo
                              </Label>
                              <Input
                                id="group-name"
                                value={editedGroup.name || currentGroup.name}
                                onChange={(e) => setEditedGroup({ ...editedGroup, name: e.target.value })}
                                className="bg-slate-800 border-slate-700 text-white"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="group-tag" className="text-slate-300">
                                  Tag do Grupo
                                </Label>
                                <Input
                                  id="group-tag"
                                  value={editedGroup.tag || currentGroup.tag}
                                  onChange={(e) => setEditedGroup({ ...editedGroup, tag: e.target.value })}
                                  className="bg-slate-800 border-slate-700 text-white"
                                  maxLength={10}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="tag-color" className="text-slate-300">
                                  Cor da Tag
                                </Label>
                                <select
                                  id="tag-color"
                                  value={editedGroup.tagColor || currentGroup.tagColor}
                                  onChange={(e) => setEditedGroup({ ...editedGroup, tagColor: e.target.value })}
                                  className="w-full h-10 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                                >
                                  <option value="blue">Azul</option>
                                  <option value="red">Vermelho</option>
                                  <option value="green">Verde</option>
                                  <option value="purple">Roxo</option>
                                  <option value="yellow">Amarelo</option>
                                  <option value="pink">Rosa</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="group-description" className="text-slate-300">
                                Descrição
                              </Label>
                              <Textarea
                                id="group-description"
                                value={editedGroup.description || currentGroup.description}
                                onChange={(e) => setEditedGroup({ ...editedGroup, description: e.target.value })}
                                rows={4}
                                className="bg-slate-800 border-slate-700 text-white"
                              />
                            </div>

                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="group-public"
                                checked={
                                  editedGroup.isPublic !== undefined ? editedGroup.isPublic : currentGroup.isPublic
                                }
                                onChange={(e) => setEditedGroup({ ...editedGroup, isPublic: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-600 text-blue-600 focus:ring-blue-600"
                              />
                              <Label htmlFor="group-public" className="text-slate-300">
                                Grupo Público (qualquer pessoa pode entrar)
                              </Label>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between pt-4 border-t border-slate-700">
                          <Button
                            variant="destructive"
                            onClick={() => {
                              if (
                                confirm("Tem certeza que deseja excluir este grupo? Esta ação não pode ser desfeita.")
                              ) {
                                handleDeleteGroup(currentGroup.id)
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir Grupo
                          </Button>

                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setEditMode(false)}>
                              Cancelar
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveGroupChanges}>
                              <Save className="w-4 h-4 mr-2" />
                              Salvar Alterações
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      {/* Cabeçalho do Grupo */}
                      <div
                        className="relative h-40 bg-cover bg-center"
                        style={{
                          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/placeholder.svg?height=160&width=900')`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-4">
                          <Avatar className="w-20 h-20 border-4 border-slate-900">
                            <AvatarImage src={currentGroup.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-3xl">{currentGroup.name[0]}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h2 className="text-2xl font-bold text-white">{currentGroup.name}</h2>
                              <Badge
                                className={`bg-${currentGroup.tagColor}-600`}
                                style={{ backgroundColor: `var(--${currentGroup.tagColor}-600)` }}
                              >
                                {currentGroup.tag}
                              </Badge>
                              {currentGroup.isPublic ? (
                                <Badge variant="outline" className="border-green-500 text-green-500">
                                  <Globe className="w-3 h-3 mr-1" /> Público
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-orange-500 text-orange-500">
                                  <Lock className="w-3 h-3 mr-1" /> Privado
                                </Badge>
                              )}
                            </div>
                            <p className="text-slate-300 text-sm">
                              {currentGroup.memberCount} membros • Criado em{" "}
                              {new Date(currentGroup.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            {isOwnerOrAdmin(currentGroup.id) ? (
                              <Button variant="outline" onClick={() => setEditMode(true)}>
                                <Settings className="w-4 h-4 mr-2" />
                                Gerenciar
                              </Button>
                            ) : currentGroup.members.some((m) => m.name === user.name) ? (
                              <Button
                                variant="outline"
                                className="text-red-400 border-red-400 hover:bg-red-400/10"
                                onClick={() => handleLeaveGroup(currentGroup.id)}
                              >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sair
                              </Button>
                            ) : (
                              <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => {
                                  if (currentGroup.isPublic) {
                                    handleJoinGroup(currentGroup.id)
                                  } else {
                                    handleRequestJoin(currentGroup.id)
                                  }
                                }}
                              >
                                <UserPlus className="w-4 h-4 mr-2" />
                                {currentGroup.isPublic ? "Entrar" : "Solicitar Adesão"}
                              </Button>
                            )}
                            <Button variant="outline">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Chat
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Conteúdo do Grupo */}
                      <div className="flex-1 p-6">
                        <div className="grid grid-cols-3 gap-6">
                          <div className="col-span-2">
                            <h3 className="text-lg font-semibold text-white mb-4">Sobre o Grupo</h3>
                            <p className="text-slate-300 mb-6">{currentGroup.description}</p>

                            <h3 className="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
                            <div className="space-y-3">
                              <div className="p-3 bg-slate-700/50 rounded-lg">
                                <p className="text-white text-sm">João123 entrou no grupo</p>
                                <p className="text-slate-400 text-xs">há 2 horas</p>
                              </div>
                              <div className="p-3 bg-slate-700/50 rounded-lg">
                                <p className="text-white text-sm">Novo evento: Torneio de CS2</p>
                                <p className="text-slate-400 text-xs">há 1 dia</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-white mb-4">
                              Membros ({currentGroup.memberCount})
                            </h3>
                            <ScrollArea className="h-[300px]">
                              <div className="space-y-2">
                                {currentGroup.members.map((member) => (
                                  <div
                                    key={member.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50"
                                  >
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-1">
                                        <p className="text-white text-sm font-medium">{member.name}</p>
                                        {member.role === "owner" && <Crown className="w-3 h-3 text-yellow-500" />}
                                        {member.role === "admin" && <Shield className="w-3 h-3 text-blue-500" />}
                                      </div>
                                      <p className="text-slate-400 text-xs">
                                        {member.role === "owner"
                                          ? "Dono"
                                          : member.role === "admin"
                                            ? "Admin"
                                            : "Membro"}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal de Criar Grupo */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60">
          <Card className="w-[500px] bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Criar Novo Grupo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-group-name" className="text-slate-300">
                  Nome do Grupo
                </Label>
                <Input
                  id="new-group-name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="Ex: RPG Lovers"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-group-tag" className="text-slate-300">
                    Tag do Grupo
                  </Label>
                  <Input
                    id="new-group-tag"
                    value={newGroup.tag}
                    onChange={(e) => setNewGroup({ ...newGroup, tag: e.target.value })}
                    placeholder="Ex: RPG"
                    className="bg-slate-700 border-slate-600 text-white"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-tag-color" className="text-slate-300">
                    Cor da Tag
                  </Label>
                  <select
                    id="new-tag-color"
                    value={newGroup.tagColor}
                    onChange={(e) => setNewGroup({ ...newGroup, tagColor: e.target.value })}
                    className="w-full h-10 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  >
                    <option value="blue">Azul</option>
                    <option value="red">Vermelho</option>
                    <option value="green">Verde</option>
                    <option value="purple">Roxo</option>
                    <option value="yellow">Amarelo</option>
                    <option value="pink">Rosa</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-group-description" className="text-slate-300">
                  Descrição
                </Label>
                <Textarea
                  id="new-group-description"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="Descreva o propósito do grupo..."
                  rows={3}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="new-group-public"
                  checked={newGroup.isPublic}
                  onChange={(e) => setNewGroup({ ...newGroup, isPublic: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-600 text-blue-600 focus:ring-blue-600"
                />
                <Label htmlFor="new-group-public" className="text-slate-300">
                  Grupo Público (qualquer pessoa pode entrar)
                </Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateGroup(false)}>
                  Cancelar
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleCreateGroup}
                  disabled={!newGroup.name.trim() || !newGroup.tag.trim()}
                >
                  Criar Grupo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

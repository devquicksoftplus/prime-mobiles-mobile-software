"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  MoreHorizontal,
  UserCog,
  Trash2,
  RefreshCw,
  UserPlus,
  Filter,
  Download,
  Mail,
  Phone,
  Store,
  Calendar,
  Shield,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AdminLayout } from "@/features/admin/components/admin-layout"
import { toast } from "sonner"

interface User {
  uid: string
  email: string
  name: string
  role: "user" | "admin"
  shopName?: string
  phone?: string
  createdAt: string
  lastLogin?: string
  subscription?: {
    plan: string
    status: string
  }
}

export default function UsersManagementPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [newUserData, setNewUserData] = useState({
    email: "",
    name: "",
    password: "",
    shopName: "",
    phone: "",
    role: "user" as "user" | "admin",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    let result = users

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.shopName?.toLowerCase().includes(query)
      )
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(result)
  }, [searchQuery, roleFilter, users])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      
      if (!token) {
        toast.error("Not authenticated. Please log out and log back in.")
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()

      if (response.ok) {
        setUsers(data.users || [])
        setFilteredUsers(data.users || [])
        if (data.users?.length === 0) {
          toast.info("No users found in database")
        }
      } else {
        console.error("API Error:", data)
        toast.error(data.error || "Failed to fetch users")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to connect to server")
    }
    setIsLoading(false)
  }

  const handleRoleChange = async (uid: string, newRole: "user" | "admin") => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, role: newRole }),
      })

      if (response.ok) {
        setUsers((prev) =>
          prev.map((user) => (user.uid === uid ? { ...user, role: newRole } : user))
        )
        toast.success(`User role updated to ${newRole}`)
      }
    } catch (error) {
      console.error("Error updating user role:", error)
      toast.error("Failed to update user role")
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/admin/users?uid=${selectedUser.uid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user.uid !== selectedUser.uid))
        toast.success("User deleted successfully")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    }

    setDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  const handleAddUser = async () => {
    if (!newUserData.email || !newUserData.name || !newUserData.password) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUserData),
      })

      if (response.ok) {
        toast.success("User created successfully")
        setAddUserDialogOpen(false)
        setNewUserData({
          email: "",
          name: "",
          password: "",
          shopName: "",
          phone: "",
          role: "user",
        })
        fetchUsers()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to create user")
      }
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error("Failed to create user")
    }
    setIsSubmitting(false)
  }

  const exportUsers = () => {
    const csvContent = [
      ["Name", "Email", "Shop Name", "Phone", "Role", "Joined"],
      ...filteredUsers.map((user) => [
        user.name,
        user.email,
        user.shopName || "",
        user.phone || "",
        user.role,
        new Date(user.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout
      title="User Management"
      description="View and manage all registered users"
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, email, or shop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32 bg-white border-slate-200 text-slate-900">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchUsers}
            disabled={isLoading}
            className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="outline"
            onClick={exportUsers}
            className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setAddUserDialogOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-slate-50 bg-slate-50/50">
                  <TableHead className="text-slate-600">User</TableHead>
                  <TableHead className="text-slate-600 hidden md:table-cell">Contact</TableHead>
                  <TableHead className="text-slate-600 hidden lg:table-cell">Shop</TableHead>
                  <TableHead className="text-slate-600">Role</TableHead>
                  <TableHead className="text-slate-600 hidden sm:table-cell">Joined</TableHead>
                  <TableHead className="text-slate-600 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.uid}
                      className="border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm text-slate-600">
                          {user.phone ? (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {user.phone}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm text-slate-600">
                          {user.shopName ? (
                            <span className="flex items-center gap-1">
                              <Store className="w-3 h-3 text-slate-400" />
                              {user.shopName}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            user.role === "admin"
                              ? "border-purple-200 text-purple-700 bg-purple-50"
                              : "border-slate-200 text-slate-600 bg-white"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <Shield className="w-3 h-3 mr-1" />
                          ) : (
                            <User className="w-3 h-3 mr-1" />
                          )}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-sm text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white border-slate-200 p-1"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(
                                  user.uid,
                                  user.role === "admin" ? "user" : "admin"
                                )
                              }
                              className="text-slate-600 focus:bg-slate-100 focus:text-slate-900 cursor-pointer"
                            >
                              <UserCog className="w-4 h-4 mr-2" />
                              {user.role === "admin" ? "Demote to User" : "Promote to Admin"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-100" />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user)
                                setDeleteDialogOpen(true)
                              }}
                              className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Are you sure you want to delete <strong>{selectedUser?.name}</strong>? This
              action cannot be undone and will remove all their data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="bg-white border-slate-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              Add New User
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Create a new user account for your platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-600">
                Full Name *
              </Label>
              <Input
                id="name"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                placeholder="Enter full name"
                className="bg-white border-slate-200 text-slate-900 focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-600">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                placeholder="Enter email"
                className="bg-white border-slate-200 text-slate-900 focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-600">
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                placeholder="Enter password (min 6 characters)"
                className="bg-white border-slate-200 text-slate-900 focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shopName" className="text-slate-600">
                  Shop Name
                </Label>
                <Input
                  id="shopName"
                  value={newUserData.shopName}
                  onChange={(e) => setNewUserData({ ...newUserData, shopName: e.target.value })}
                  placeholder="Shop name"
                  className="bg-white border-slate-200 text-slate-900 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-600">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                  placeholder="Phone number"
                  className="bg-white border-slate-200 text-slate-900 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-600">
                Role
              </Label>
              <Select
                value={newUserData.role}
                onValueChange={(value: "user" | "admin") =>
                  setNewUserData({ ...newUserData, role: value })
                }
              >
                <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddUserDialogOpen(false)}
              className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

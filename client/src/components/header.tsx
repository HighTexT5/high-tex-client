"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingCart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Header() {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in on component mount
    const token = localStorage.getItem("token")
    const storedUsername = localStorage.getItem("username")

    if (token && storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  const handleCartClick = () => {
    router.push("/cart")
  }

  const handleLoginClick = () => {
    router.push("/login")
  }

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    setUsername(null)

    // Redirect to home page
    router.push("/")
  }

  return (
    <header className="bg-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex items-center mr-8">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mr-2">
            <span className="text-accent-yellow font-bold text-xl">?</span>
          </div>
          <span className="text-dark-blue text-2xl font-bold">HighTEx</span>
        </Link>

        <Button variant="outline" className="mr-2 bg-white border-gray-300 text-black text-sm h-9">
          Kênh người bán
        </Button>
      </div>

      <div className="flex-1 max-w-md mx-4 relative">
        <Input placeholder="Value" className="pr-10 border-gray-300" />
        <div className="absolute right-0 top-0 h-full flex items-center pr-3">
          <span className="text-gray-400 cursor-pointer">×</span>
        </div>
        <Button className="absolute right-0 top-0 h-full bg-white border-l border-gray-300" variant="ghost">
          <Search className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      <div className="flex items-center">
        <Button variant="outline" className="mr-2 bg-accent text-black border-accent h-9">
          Tra cứu đơn hàng
        </Button>
        <Button
          variant="outline"
          className="mr-2 bg-accent text-black border-accent h-9 w-9 p-0"
          onClick={handleCartClick}
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>

        {username ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-accent text-black border-accent h-9">
                {username}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" className="bg-accent text-black border-accent h-9" onClick={handleLoginClick}>
            Đăng nhập
          </Button>
        )}
      </div>
    </header>
  )
}


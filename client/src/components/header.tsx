"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [username, setUsername] = useState<string | null>(null)
  const [shouldRender, setShouldRender] = useState(true)
  const [cartData, setCartData] = useState<{
    items: Array<{
      itemName: string
      quantity: number
      currentPrice: number
      thumbnailUrl: string
    }>
    totalPrice: number
  } | null>(null)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isCartLoading, setIsCartLoading] = useState(false)

  useEffect(() => {
    if (pathname.startsWith("/seller") || pathname.startsWith("/admin")) {
      setShouldRender(false)
      return
    }
    setShouldRender(true)

    // Check if user is logged in on component mount and on every render
    const token = localStorage.getItem("token")
    const storedUsername = localStorage.getItem("username")

    if (token && storedUsername) {
      setUsername(storedUsername)
    } else {
      setUsername(null)
    }
  }, [pathname])

  // Add this after the first useEffect hook
  useEffect(() => {
    // Function to handle storage changes
    const handleStorageChange = () => {
      const token = localStorage.getItem("token")
      const storedUsername = localStorage.getItem("username")

      if (token && storedUsername) {
        setUsername(storedUsername)
      } else {
        setUsername(null)
      }
    }

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange)

    // Also check on mount
    handleStorageChange()

    // Clean up
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // useEffect(() => {
  //   fetchCartData()
  // }, [])

  const handleCartClick = async () => {
    setIsCartLoading(true)

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8080/api/shopping-cart/get-cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.status === 200 && data.message === "Success") {
        setCartData(data.data)
        setCartItemCount(data.data.items.reduce((total: number, item: any) => total + item.quantity, 0))

        // Store cart data in localStorage for persistence
        localStorage.setItem("cartData", JSON.stringify(data.data))

        // Navigate to cart page after successful fetch
        router.push("/cart")
      } else {
        throw new Error(`API returned error: ${data.message}`)
      }
    } catch (err) {
      console.error("Error fetching cart data:", err)

      // Create empty cart data
      const emptyCartData = {
        items: [],
        totalPrice: 0,
      }

      setCartData(emptyCartData)
      setCartItemCount(0)

      // Store empty cart data in localStorage
      localStorage.setItem("cartData", JSON.stringify(emptyCartData))

      // Navigate to cart page
      router.push("/cart")
    } finally {
      setIsCartLoading(false)
    }
  }

  const fetchCartData = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8080/api/shopping-cart/get-cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.status === 200 && data.message === "Success") {
        setCartData(data.data)
        setCartItemCount(data.data.items.reduce((total: number, item: any) => total + item.quantity, 0))

        // Store cart data in localStorage for persistence
        localStorage.setItem("cartData", JSON.stringify(data.data))
      } else {
        throw new Error(`API returned error: ${data.message}`)
      }
    } catch (err) {
      console.error("Error fetching cart data:", err)

      // Try to get cart data from localStorage
      const storedCartData = localStorage.getItem("cartData")
      if (storedCartData) {
        const parsedData = JSON.parse(storedCartData)
        setCartData(parsedData)
        setCartItemCount(parsedData.items.reduce((total: number, item: any) => total + item.quantity, 0))
      } else {
        // Create empty cart data if nothing in localStorage
        const emptyCartData = {
          items: [],
          totalPrice: 0,
        }
        setCartData(emptyCartData)
        setCartItemCount(0)
        localStorage.setItem("cartData", JSON.stringify(emptyCartData))
      }
    }
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

  const handleSellerClick = () => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")

    // Check if user has the required role
    if (userRole === "ROLE_ADMIN" || userRole === "ROLE_DISTRIBUTOR") {
      router.push("/seller")
    } else {
      // Show notification and stay on current page
      alert("Bạn không có quyền truy cập vào kênh người bán")
    }
  }

  const handleMemberClick = () => {
    router.push("/member")
  }

  // Add this function after the other handler functions
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token")
    const storedUsername = localStorage.getItem("username")

    if (token && storedUsername) {
      setUsername(storedUsername)
    } else {
      setUsername(null)
    }
  }

  // Add this useEffect to handle unauthorized access to seller page
  useEffect(() => {
    // Check if current path is /seller
    if (pathname.startsWith("/seller")) {
      const userRole = localStorage.getItem("userRole")

      // If user doesn't have required role, redirect to home
      if (userRole !== "ROLE_ADMIN" && userRole !== "ROLE_DISTRIBUTOR") {
        router.push("/")
        // Show notification after redirect
        setTimeout(() => {
          alert("Bạn không có quyền truy cập vào kênh người bán")
        }, 100)
      }
    }
  }, [pathname, router])

  if (!shouldRender) {
    return null
  }

  return (
    <header className="bg-[#0A2463] text-white p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
        <Link href="/" className="flex items-center text-white">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mr-2">
            <span className="text-accent-yellow font-bold text-xl">?</span>
          </div>
          <span className="text-dark-blue text-2xl font-bold">HighTEx</span>
        </Link>

        <Button
          variant="outline"
          className="bg-[#0A2463] border-white text-white hover:bg-[#2962FF] h-9 cursor-pointer"
          onClick={handleSellerClick}
        >
          Kênh người bán
        </Button>

      <div className="relative w-64">
          <Input placeholder="Tìm kiếm" className="pr-10 border-gray-600 text-black bg-white h-9" />
        <div className="absolute right-0 top-0 h-full flex items-center pr-3">
          <span className="text-gray-600 cursor-pointer">×</span>
        </div>
        <Button
          className="absolute right-0 top-0 h-full bg-[#a2c2f5] border-l border-gray-300 cursor-pointer hover:bg-[#2962FF]"
          variant="ghost"
        >
          <Search className="h-5 w-5 text-white" />
        </Button>
      </div>

        <Button
          variant="outline"
          className="bg-[#0A2463] text-white border-white hover:bg-[#2962FF] h-9 cursor-pointer whitespace-nowrap"
        >
          Tra cứu đơn hàng
        </Button>

        <div className="relative">
          <Button
            variant="outline"
            className="bg-[#0A2463] text-white border-white hover:bg-[#2962FF] h-9 w-9 p-0 cursor-pointer"
            onClick={handleCartClick}
            disabled={isCartLoading}
          >
            {isCartLoading ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ShoppingCart className="h-5 w-5" />
            )}
          </Button>
          {cartItemCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount}
            </div>
          )}
        </div>

        {username ? (
          <Button
            variant="outline"
            className="bg-[#0A2463] text-white border-white hover:bg-[#2962FF] h-9 cursor-pointer"
            onClick={handleMemberClick}
          >
            {username}
          </Button>
        ) : (
          <Button
            variant="outline"
            className="bg-[#0A2463] text-white border-white hover:bg-[#2962FF] h-9 cursor-pointer"
            onClick={handleLoginClick}
          >
            Đăng nhập
          </Button>
        )}
      </div>
    </header>
  )
}
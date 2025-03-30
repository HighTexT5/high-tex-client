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

  useEffect(() => {
    fetchCartData()
  }, [])

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

      // Use example data if API fails
      const exampleData = {
        items: [
          {
            itemName: "Smartphone XYZ",
            quantity: 4,
            currentPrice: 999.99,
            thumbnailUrl: "https://i.ibb.co/tpQcK667/5e71f2a46ad2.png",
          },
          {
            itemName: "Smartphone XYZ2",
            quantity: 3,
            currentPrice: 999999.0,
            thumbnailUrl: "https://i.ibb.co/G3tnXrwq/0616f75332c6.png",
          },
        ],
        totalPrice: 3003996.96,
      }

      setCartData(exampleData)
      setCartItemCount(exampleData.items.reduce((total, item) => total + item.quantity, 0))

      // Store example data in localStorage
      localStorage.setItem("cartData", JSON.stringify(exampleData))

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
    router.push("/seller")
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

  if (!shouldRender) {
    return null
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

        <Button
          variant="outline"
          className="mr-2 bg-white border-gray-300 text-black text-sm h-9 cursor-pointer"
          onClick={handleSellerClick}
        >
          Kênh người bán
        </Button>
      </div>

      <div className="flex-1 max-w-md mx-4 relative">
        <Input placeholder="Value" className="pr-10 border-gray-300" />
        <div className="absolute right-0 top-0 h-full flex items-center pr-3">
          <span className="text-gray-400 cursor-pointer">×</span>
        </div>
        <Button
          className="absolute right-0 top-0 h-full bg-white border-l border-gray-300 cursor-pointer"
          variant="ghost"
        >
          <Search className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      <div className="flex items-center">
        <Button variant="outline" className="mr-2 bg-accent text-black border-accent h-9 cursor-pointer">
          Tra cứu đơn hàng
        </Button>
        <div className="relative">
        <Button
          variant="outline"
          className="mr-2 bg-accent text-black border-accent h-9 w-9 p-0 cursor-pointer"
          onClick={handleCartClick}
          disabled={isCartLoading}
        >
          {isCartLoading ? (
              <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
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
            className="bg-accent text-black border-accent h-9 cursor-pointer"
            onClick={handleMemberClick}
          >
            {username}
          </Button>
        ) : (
          <Button
            variant="outline"
            className="bg-accent text-black border-accent h-9 cursor-pointer"
            onClick={handleLoginClick}
          >
            Đăng nhập
          </Button>
        )}
      </div>
    </header>
  )
}


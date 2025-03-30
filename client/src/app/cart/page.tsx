"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartItem {
  itemName: string
  itemCode: string
  quantity: number
  currentPrice: number
  thumbnailUrl: string
}

interface CartData {
  items: CartItem[]
  totalPrice: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch cart data from localStorage or API
    const fetchCartData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Try to get cart data from localStorage first (set by header component)
        const storedCartData = localStorage.getItem("cartData")

        if (storedCartData) {
          const parsedData: CartData = JSON.parse(storedCartData)
          setCartItems(parsedData.items)
          setTotalPrice(parsedData.totalPrice)
          setIsLoading(false)
          return
        }

        // If no data in localStorage, fetch from API
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
          setCartItems(data.data.items)
          setTotalPrice(data.data.totalPrice)

          // Store in localStorage for future use
          localStorage.setItem("cartData", JSON.stringify(data.data))
        } else {
          throw new Error(`API returned error: ${data.message}`)
        }
      } catch (err) {
        console.error("Error fetching cart data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch cart data")

        // Use example data if API fails
        const exampleData = {
          items: [
            {
              itemName: "Smartphone XYZ",
              itemCode: "123123131231",
              quantity: 4,
              currentPrice: 999.99,
              thumbnailUrl: "https://i.ibb.co/tpQcK667/5e71f2a46ad2.png",
            },
            {
              itemName: "Smartphone XYZ2",
              itemCode: "s9d0afugj20jeqj",
              quantity: 3,
              currentPrice: 999999.0,
              thumbnailUrl: "https://i.ibb.co/G3tnXrwq/0616f75332c6.png",
            },
          ],
          totalPrice: 3003996.96,
        }

        setCartItems(exampleData.items)
        setTotalPrice(exampleData.totalPrice)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartData()
  }, [])

  const handleRemoveItem = async (index: number) => {
    try {
      // Make API call to remove item
      // Replace with your actual API endpoint
      const itemToRemove = cartItems[index]

      const response = await fetch(`http://localhost:8080/api/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          itemName: itemToRemove.itemName,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to remove item: ${response.statusText}`)
      }

      // Update local state
      const updatedItems = [...cartItems]
      updatedItems.splice(index, 1)
      setCartItems(updatedItems)

      // Recalculate total
      const newTotal = updatedItems.reduce((total, item) => total + item.currentPrice * item.quantity, 0)
      setTotalPrice(newTotal)

      // Update localStorage
      localStorage.setItem(
        "cartData",
        JSON.stringify({
          items: updatedItems,
          totalPrice: newTotal,
        }),
      )

      // Trigger storage event to update cart count in header
      window.dispatchEvent(new Event("storage"))
    } catch (err) {
      console.error("Error removing item:", err)
      alert("Failed to remove item. Please try again.")
    }
  }

  const handleUpdateQuantity = async (index: number, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      // Make API call to update quantity
      // Replace with your actual API endpoint
      const itemToUpdate = cartItems[index]

      const response = await fetch(`http://localhost:8080/api/shopping-cart/add?itemCode=${itemToUpdate.itemCode}&quantity=${newQuantity}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to update quantity: ${response.statusText}`)
      }

      // Update local state
      const updatedItems = [...cartItems]
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: newQuantity,
      }
      setCartItems(updatedItems)

      // Recalculate total
      const newTotal = updatedItems.reduce((total, item) => total + item.currentPrice * item.quantity, 0)
      setTotalPrice(newTotal)

      // Update localStorage
      localStorage.setItem(
        "cartData",
        JSON.stringify({
          items: updatedItems,
          totalPrice: newTotal,
        }),
      )

      // Trigger storage event to update cart count in header
      window.dispatchEvent(new Event("storage"))
    } catch (err) {
      console.error("Error updating quantity:", err)
      alert("Failed to update quantity. Please try again.")
    }
  }

  // Format price to Vietnamese currency format
  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")}đ`
  }

  return (
    <div className="min-h-screen bg-blue-50 pb-32">
      {/* Cart Header */}
      <div className="py-4 border-b bg-white">
        <div className="container mx-auto flex items-center">
          <Link href="/" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold text-center flex-1">Giỏ hàng của bạn</h1>
          <div className="w-5"></div> {/* For balance */}
        </div>
      </div>

      {/* Cart Items */}
      <div className="container mx-auto py-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Đang tải giỏ hàng...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
            <p>{error}</p>
            <p className="mt-2">Đang hiển thị dữ liệu mẫu</p>
          </div>
        ) : null}

        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-blue-200 flex items-center justify-between mb-4"
            >
              <div className="flex items-center">
                <Image
                  src={item.thumbnailUrl || "/placeholder.svg"}
                  alt={item.itemName}
                  width={100}
                  height={100}
                  className="object-contain mr-4"
                />
                <div>
                  <h3 className="font-medium text-sm">{item.itemName}</h3>
                  <div className="mt-2">
                    <span className="font-semibold">{formatPrice(item.currentPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex items-center border rounded mr-4">
                  <button
                    className="w-8 h-8 flex items-center justify-center border-r"
                    onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value)
                      if (!isNaN(value) && value > 0) {
                        handleUpdateQuantity(index, value)
                      }
                    }}
                    className="w-8 h-8 text-center"
                  />
                  <button
                    className="w-8 h-8 flex items-center justify-center border-l"
                    onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                  <Trash2 className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
            <Link href="/">
              <Button className="mt-4 bg-accent text-black border-accent">Tiếp tục mua sắm</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Fixed Checkout Section */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md py-4 border-t">
          <div className="container mx-auto flex justify-between items-center">
            <div className="font-semibold">Tổng giá trị: {formatPrice(totalPrice)}</div>
            <Button className="bg-accent text-black border-accent">Mua ngay</Button>
          </div>
        </div>
      )}
    </div>
  )
}


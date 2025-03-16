"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import CartItem from "@/components/cart-item"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Chuột chơi game không dây Dareu EM911x RGB Đen",
      description: "",
      price: 490000,
      originalPrice: 699000,
      image: "/placeholder.svg?height=100&width=100",
      quantity: 1,
    },
  ])

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
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
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <CartItem
              key={item.id}
              product={item}
              onRemove={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
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
            <div className="font-semibold">Tổng giá trị: {calculateTotal().toLocaleString()}đ</div>
            <Button className="bg-accent text-black border-accent">Mua ngay</Button>
          </div>
        </div>
      )}
    </div>
  )
}


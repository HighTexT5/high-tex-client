"use client"

import type React from "react"

import Image from "next/image"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartItemProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    image: string
    quantity: number
  }
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
}

export default function CartItem({ product, onRemove, onUpdateQuantity }: CartItemProps) {
  const handleDecrement = () => {
    if (product.quantity > 1) {
      onUpdateQuantity(product.id, product.quantity - 1)
    }
  }

  const handleIncrement = () => {
    onUpdateQuantity(product.id, product.quantity + 1)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      onUpdateQuantity(product.id, value)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-blue-200 flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={100}
          height={100}
          className="object-contain mr-4"
        />
        <div>
          <h3 className="font-medium text-sm">{product.name}</h3>
          <p className="text-gray-600 text-xs">{product.description}</p>
          <div className="mt-2">
            <span className="font-semibold">{product.price.toLocaleString()}đ</span>
            {product.originalPrice && (
              <span className="line-through text-gray-500 ml-2 text-sm">{product.originalPrice.toLocaleString()}đ</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex items-center border rounded mr-4">
          <button className="w-8 h-8 flex items-center justify-center border-r" onClick={handleDecrement}>
            -
          </button>
          <input type="text" value={product.quantity} onChange={handleQuantityChange} className="w-8 h-8 text-center" />
          <button className="w-8 h-8 flex items-center justify-center border-l" onClick={handleIncrement}>
            +
          </button>
        </div>

        <Button variant="ghost" size="icon" onClick={() => onRemove(product.id)}>
          <Trash2 className="h-5 w-5 text-gray-500" />
        </Button>
      </div>
    </div>
  )
}


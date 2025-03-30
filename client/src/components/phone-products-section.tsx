"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PhoneCard from "@/components/phone-card"

interface PhoneProduct {
  id: number
  name: string
  price: number
  quantity: number
  rating: number
  imageURL: string
}

interface ApiResponse {
  status: number
  message: string
  data: PhoneProduct[]
}

export default function PhoneProductsSection() {
  const [phoneProducts, setPhoneProducts] = useState<PhoneProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPhoneProducts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Replace with your actual API endpoint
        const response = await fetch("http://localhost:8080/api/item/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data: ApiResponse = await response.json()

        if (data.status === 200 && data.message === "Success") {
          setPhoneProducts(data.data)
        } else {
          throw new Error(`API returned error: ${data.message}`)
        }
      } catch (err) {
        console.error("Error fetching phone products:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch phone products")

        // Use fallback data if API fails
        setPhoneProducts([
          {
            id: 1,
            name: "Samsung Galaxy S25 Ultra 12GB 1TB",
            price: 41490000,
            quantity: 96,
            rating: 5,
            imageURL: "/placeholder.svg?height=150&width=150",
          },
          {
            id: 2,
            name: "iPhone 15 Pro Max 1TB",
            price: 39990000,
            quantity: 45,
            rating: 4.9,
            imageURL: "/placeholder.svg?height=150&width=150",
          },
          {
            id: 3,
            name: "Xiaomi 14 Ultra",
            price: 25990000,
            quantity: 120,
            rating: 4.8,
            imageURL: "/placeholder.svg?height=150&width=150",
          },
          {
            id: 4,
            name: "Google Pixel 8 Pro",
            price: 22990000,
            quantity: 60,
            rating: 4.7,
            imageURL: "/placeholder.svg?height=150&width=150",
          },
          {
            id: 5,
            name: "OPPO Find X7 Ultra",
            price: 24990000,
            quantity: 75,
            rating: 4.6,
            imageURL: "/placeholder.svg?height=150&width=150",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPhoneProducts()
  }, [])

  // Format price to Vietnamese currency format
  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} đ`
  }

  return (
    <div className="relative">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Đang tải sản phẩm...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          <p>Có lỗi xảy ra: {error}</p>
          <p className="text-sm mt-2">Đang hiển thị dữ liệu mẫu</p>
        </div>
      ) : (
        <>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {phoneProducts.map((product) => (
              <PhoneCard
                key={product.id}
                product={{
                  name: product.name,
                  price: formatPrice(product.price),
                  rating: product.rating.toString(),
                  image: product.imageURL || "/placeholder.svg?height=150&width=150",
                }}
              />
            ))}
          </div>
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  )
}


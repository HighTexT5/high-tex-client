"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import PhoneCard from "@/components/phone-card"
import { ChevronLeft, ChevronRight } from "lucide-react"


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

  const phoneScrollRef = useRef<HTMLDivElement>(null)

  const [phoneScrollPosition, setPhoneScrollPosition] = useState(0)
  const [phoneMaxScroll, setPhoneMaxScroll] = useState(0)

  // Calculate item width based on viewport - now returns fixed width
  const getItemWidth = () => {
    return 184 + 16 // Item width (184px) + spacing (16px)
  }

  // Scroll one item left or right
    const scrollPhoneItem = (
      direction: "left" | "right",
      scrollRef: React.RefObject<HTMLDivElement>,
      setScrollPosition: React.Dispatch<React.SetStateAction<number>>,
    ) => {
      if (!scrollRef.current) return
  
      const containerWidth = scrollRef.current.clientWidth
      const itemWidth = getItemWidth()
      const scrollAmount = direction === "left" ? -itemWidth : itemWidth
  
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }

  useEffect(() => {

    const updateScrollInfo = () => {
      if (phoneScrollRef.current) {
        setPhoneScrollPosition(phoneScrollRef.current.scrollLeft)
        setPhoneMaxScroll(phoneScrollRef.current.scrollWidth - phoneScrollRef.current.clientWidth)
      }
    }

    // Initial update
    updateScrollInfo()

    // Add scroll event listeners
    phoneScrollRef.current?.addEventListener("scroll", updateScrollInfo)

    

    const fetchPhoneProducts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Replace with your actual API endpoint
        const response = await fetch("http://localhost:8080/api/item/all", {
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem("token")}`,
          // },
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
            name: "Iphone 15 Pro",
            price: 41490000,
            quantity: 96,
            rating: 5,
            imageURL: "/smartphone/homepage/1.png",
          },
          {
            id: 2,
            name: "Asus ROG Phone 7",
            price: 39990000,
            quantity: 45,
            rating: 4.9,
            imageURL: "/smartphone/homepage/2.png",
          },
          {
            id: 3,
            name: "OnePlus 11",
            price: 25990000,
            quantity: 120,
            rating: 4.8,
            imageURL: "/smartphone/homepage/3.png",
          },
          {
            id: 4,
            name: "Samsung Galaxy S23",
            price: 22990000,
            quantity: 60,
            rating: 4.7,
            imageURL: "/smartphone/homepage/4.png",
          },
          {
            id: 5,
            name: "Samsung Z Flip 5",
            price: 24990000,
            quantity: 75,
            rating: 4.6,
            imageURL: "/smartphone/homepage/5.png",
          },
          {
            id: 6,
            name: "Google Pixel 7",
            price: 5990000,
            quantity: 20,
            rating: 5,
            imageURL: "/smartphone/homepage/6.png",
          },
          {
            id: 7,
            name: "Huawei Nova 11",
            price: 8590000,
            quantity: 10,
            rating: 4.6,
            imageURL: "/smartphone/homepage/7.png",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPhoneProducts()

    return () => {
      phoneScrollRef.current?.removeEventListener("scroll", updateScrollInfo)
    }

  }, [])

  // Format price to Vietnamese currency format
  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} đ`
  }

  return (
    <div className="relative w-full">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Đang tải sản phẩm...</span>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 text-red-500 p-2 rounded-md mb-4 text-sm">
              <p>Lỗi kết nối API: Đang hiển thị dữ liệu mẫu</p>
            </div>
          )}
          <div className="relative">
            <div
              ref={phoneScrollRef}
              className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-hide"
            >
              {phoneProducts.map((product) => (
                <div
                  key={product.id}
                  className="min-w-[184px] w-[184px] flex-shrink-0 snap-start"
                >
                  <PhoneCard
                    product={{
                      name: product.name,
                      price: formatPrice(product.price),
                      rating: product.rating.toString(),
                      image: product.imageURL || "/placeholder.svg?height=150&width=150",
                    }}
                  />
                </div>
              ))}
            </div>
            <button
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 ${phoneScrollPosition <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                onClick={() => scrollPhoneItem("left", phoneScrollRef, setPhoneScrollPosition)}
                disabled={phoneScrollPosition <= 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 ${phoneScrollPosition >= phoneMaxScroll ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                onClick={() => scrollPhoneItem("right", phoneScrollRef, setPhoneScrollPosition)}
                disabled={phoneScrollPosition >= phoneMaxScroll}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
          </div>
        </>
      )}
    </div>
  )
}


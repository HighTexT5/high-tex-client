"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react"
import PhoneCard from "@/components/phone-card"

interface ShopInfo {
  shopCode: string
  shopName: string
  phoneNumber: string
  email: string
  shopAddress: string
}

interface ShopProduct {
  id: number
  name: string
  price: number
  rating: number
  image: string
}

export default function ShopPage() {
  const params = useParams()
  const shopCode = params.shopCode as string

  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null)
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShopData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch shop information
        const shopResponse = await fetch(`http://localhost:8080/api/shop/get-by-code/${shopCode}`)

        if (!shopResponse.ok) {
          throw new Error(`Failed to fetch shop information: ${shopResponse.status}`)
        }

        const shopData = await shopResponse.json()
        console.log("Shop data:", shopData)

        if (shopData) {
          setShopInfo(shopData)
        } else {
          throw new Error("Invalid shop data format")
        }

        // Fetch shop products
        const productsResponse = await fetch(`http://localhost:8080/api/item/shopCode?shopCode=${shopCode}`, {
          headers: {
          },
        })

        if (!productsResponse.ok) {
          throw new Error(`Failed to fetch shop products: ${productsResponse.status}`)
        }

        const productsData = await productsResponse.json()
        console.log("Products data:", productsData)

        if (productsData && productsData.data && Array.isArray(productsData.data)) {
          setShopProducts(
            productsData.data.map((product: any) => ({
              id: product.id,
              name: product.name,
              price: product.price,
              rating: product.rating || 0,
              image: product.imageURL || "/placeholder.svg?height=150&width=150",
            })),
          )
        } else {
          throw new Error("Invalid products data format")
        }
      } catch (err) {
        console.error("Error fetching shop data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch shop data")

        // Use fallback data if API fails
        setShopInfo({
          shopCode: shopCode,
          shopName: "Cửa hàng mẫu",
          phoneNumber: "0123456789",
          email: "shop@example.com",
          shopAddress: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
        })

        setShopProducts(
          Array(5).fill({
            id: 1,
            name: "Smartphone mẫu",
            price: 9990000,
            rating: 4.5,
            image: "/placeholder.svg?height=150&width=150",
          }),
        )
      } finally {
        setIsLoading(false)
      }
    }

    if (shopCode) {
      fetchShopData()
    }
  }, [shopCode])

  // Format price to Vietnamese currency format
  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} đ`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg">Đang tải thông tin cửa hàng...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 pb-12">
      {/* Back button */}
      <div className="bg-white p-4 shadow-sm mb-4">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center text-gray-600 hover:text-primary">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="container mx-auto px-4 mb-4">
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            <p>Lỗi kết nối API: {error}</p>
            <p>Đang hiển thị dữ liệu mẫu</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Shop Information */}
        {shopInfo && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mr-4 text-white">
                <span className="text-2xl font-bold">{shopInfo.shopName.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{shopInfo.shopName}</h1>
                <p className="text-gray-500">Mã cửa hàng: {shopInfo.shopCode}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span>{shopInfo.phoneNumber}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span>{shopInfo.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <span>{shopInfo.shopAddress}</span>
              </div>
            </div>
          </div>
        )}

        {/* Shop Products */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Sản phẩm</h2>

          {shopProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {shopProducts.map((product, index) => (
                <PhoneCard
                  key={product.id || index}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: formatPrice(product.price),
                    rating: product.rating.toString(),
                    image: product.image,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Không có sản phẩm nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

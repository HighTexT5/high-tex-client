"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductDetail {
  screenSize: number
  screenResolution: string
  os: string
  screenTechnology: string
  backCamera: string
  frontCamera: string
  nfc: boolean
  sim: string
  screenFeature: string
  compatible: string
  chipset: string
  cpu: string
  memory: string
  ram: string
  battery: string
}

interface ProductData {
  id: number
  itemCode: string
  itemName: string
  shopCode: string
  shopName: string
  category: string
  brand: string
  productSource: string
  quantity: number
  originPrice: number
  currentPrice: number
  rating: number
  fileUrls: string[] | null
  thumbnailUrl: string
  detail: ProductDetail
}

interface ApiResponse {
  status: number
  message: string
  data: ProductData
}

export default function ProductDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const productId = searchParams.get("id")

  const [product, setProduct] = useState<ProductData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [addToCartSuccess, setAddToCartSuccess] = useState(false)
  const [addToCartError, setAddToCartError] = useState<string | null>(null)

  // Add debug info to the state so we can display it on the page
  // const addDebugInfo = (message: string) => {
  //   console.log(message)
  //   setDebugInfo((prev) => prev + "\n" + message)
  // }

  // Run this immediately when component mounts
  // useEffect(() => {
  //   addDebugInfo(`Component mounted with slug: ${params.slug}, productId: ${productId || "none"}`)
  // }, [])

  useEffect(() => {
    const fetchProductDetail = async () => {
      setIsLoading(true)
      setError(null)

      // Check if we have a product ID
      if (!productId) {
        const errorMsg = "No product ID provided in URL"
        // addDebugInfo(errorMsg)
        setError(errorMsg)

        // Use fallback data
        const fallbackProduct = createFallbackProduct()
        setProduct(fallbackProduct)
        setActiveImage(fallbackProduct.thumbnailUrl)
        setIsLoading(false)
        return
      }

      try {
        // addDebugInfo(`Attempting to fetch product with ID: ${productId}`)

        // Replace with your actual API endpoint
        const apiUrl = `http://localhost:8080/api/item/detail?id=${productId}`
        // addDebugInfo(`API URL: ${apiUrl}`)

        const response = await fetch(apiUrl)
        // addDebugInfo(`API response status: ${response.status}`)

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()
        // addDebugInfo(`API response data received: ${JSON.stringify(data).substring(0, 100)}...`)

        if (data.status === 200 && data.message === "Success") {
          setProduct(data.data)
          setActiveImage(data.data.thumbnailUrl)
          // addDebugInfo("Successfully set product data from API")
        } else {
          throw new Error(`API returned error: ${data.message}`)
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to fetch product details"
        // addDebugInfo(`Error: ${errorMsg}`)
        setError(errorMsg)

        // Use fallback data if API fails
        const fallbackProduct = createFallbackProduct()
        setProduct(fallbackProduct)
        setActiveImage(fallbackProduct.thumbnailUrl)
      } finally {
        setIsLoading(false)
      }
    }

    // Create fallback product data
    const createFallbackProduct = () => {
      const productName = params.slug
        ? String(params.slug)
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : "Smartphone XYZ2"

      // addDebugInfo(`Created fallback product with name: ${productName}`)

      return {
        id: Number.parseInt(productId as string) || 2,
        itemCode: "SM28841743270276718",
        itemName: productName,
        shopCode: "SHOP1742835163046",
        shopName: "Shop Acc2",
        category: "smartphone",
        brand: "BrandName",
        productSource: "Manufacturer",
        quantity: 97,
        originPrice: 999999.0,
        currentPrice: 999999.0,
        rating: 0.0,
        fileUrls: [
          "/smartphone/iphone15pro/2.png",
          "/smartphone/iphone15pro/3.png",
          "/smartphone/iphone15pro/4.png",
        ],
        thumbnailUrl: "/smartphone/iphone15pro/1.png",
        detail: {
          screenSize: 6.5,
          screenResolution: "1080x2400",
          os: "Android 11",
          screenTechnology: "AMOLED",
          backCamera: "108MP",
          frontCamera: "32MP",
          nfc: true,
          sim: "Dual SIM",
          screenFeature: "HDR10+",
          compatible: "5G",
          chipset: "Snapdragon 888",
          cpu: "Octa-core",
          memory: "256GB",
          ram: "12GB",
          battery: "4500mAh",
        },
      }
    }

    // Start the fetch process
    fetchProductDetail()
  }, [productId, params.slug])

  const handleAddToCart = async () => {
    if (!product) return

    setIsAddingToCart(true)
    setAddToCartSuccess(false)
    setAddToCartError(null)

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8080/api/shopping-cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          itemCode: product.itemCode,
          quantity: 1,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.status === 200 && data.message === "Success") {
        setAddToCartSuccess(true)

        // Update cart count in localStorage if needed
        const cartDataString = localStorage.getItem("cartData")
        if (cartDataString) {
          try {
            const cartData = JSON.parse(cartDataString)

            // Check if item already exists in cart
            const existingItemIndex = cartData.items.findIndex((item: any) => item.itemCode === product.itemCode)

            if (existingItemIndex >= 0) {
              // Update quantity if item exists
              cartData.items[existingItemIndex].quantity += 1
            } else {
              // Add new item if it doesn't exist
              cartData.items.push({
                itemName: product.itemName,
                quantity: 1,
                currentPrice: product.currentPrice,
                thumbnailUrl: product.thumbnailUrl,
              })
            }

            // Update total price
            cartData.totalPrice = cartData.items.reduce(
              (total: number, item: any) => total + item.currentPrice * item.quantity,
              0,
            )

            localStorage.setItem("cartData", JSON.stringify(cartData))

            // Trigger storage event to update cart count in header
            window.dispatchEvent(new Event("storage"))
          } catch (err) {
            console.error("Error updating cart data in localStorage:", err)
          }
        }

        // Hide success message after 3 seconds
        setTimeout(() => {
          setAddToCartSuccess(false)
        }, 3000)
      } else {
        throw new Error(data.message || "Failed to add item to cart")
      }
    } catch (err) {
      console.error("Error adding to cart:", err)
      setAddToCartError(err instanceof Error ? err.message : "Failed to add item to cart")

      // Hide error message after 3 seconds
      setTimeout(() => {
        setAddToCartError(null)
      }, 3000)
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Format price to Vietnamese currency format
  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} đ`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <span className="text-lg">Đang tải thông tin sản phẩm...</span>
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

      {/* Debug information - only visible during development */}
      {process.env.NODE_ENV === "development" && debugInfo && (
        <div className="container mx-auto px-4 mb-4">
          <details className="bg-gray-100 p-3 rounded-md text-xs">
            <summary className="font-medium cursor-pointer">Debug Information</summary>
            <pre className="mt-2 whitespace-pre-wrap">{debugInfo}</pre>
          </details>
        </div>
      )}

      {/* {error && (
        <div className="container mx-auto px-4 mb-4">
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            <p>Lỗi: {error}</p>
            <p>Đang hiển thị dữ liệu mẫu</p>
          </div>
        </div>
      )} */}

      {product && (
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div>
                <div className="mb-4 border rounded-lg p-4 flex justify-center">
                  <Image
                    src={activeImage || product.thumbnailUrl || "/placeholder.svg"}
                    alt={product.itemName}
                    width={400}
                    height={400}
                    className="object-contain"
                  />
                </div>

                {/* Thumbnail Gallery */}
                {product.fileUrls && product.fileUrls.length > 0 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {/* Show thumbnail as first image */}
                    <div
                      className={`border rounded p-2 cursor-pointer ${activeImage === product.thumbnailUrl ? "border-primary" : "border-gray-200"}`}
                      onClick={() => setActiveImage(product.thumbnailUrl)}
                    >
                      <Image
                        src={product.thumbnailUrl || "/placeholder.svg"}
                        alt={`${product.itemName} thumbnail`}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>

                    {/* Show other images */}
                    {product.fileUrls.map((url, index) => (
                      <div
                        key={index}
                        className={`border rounded p-2 cursor-pointer ${activeImage === url ? "border-primary" : "border-gray-200"}`}
                        onClick={() => setActiveImage(url)}
                      >
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`${product.itemName} - ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-2xl font-semibold mb-2">{product.itemName}</h1>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm">{product.rating}</span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-gray-500">Còn {product.quantity} sản phẩm</span>
                </div>

                <div className="mb-6">
                  <div className="text-2xl font-bold text-red-600">{formatPrice(product.currentPrice)}</div>
                  {product.originPrice > product.currentPrice && (
                    <div className="flex items-center mt-1">
                      <span className="line-through text-gray-500">{formatPrice(product.originPrice)}</span>
                      <span className="ml-2 text-red-500">
                        -{Math.round((1 - product.currentPrice / product.originPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Thông tin cửa hàng</h3>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                      <span className="text-sm font-medium">{product.shopName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.shopName}</p>
                      <p className="text-xs text-gray-500">Mã cửa hàng: {product.shopCode}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button className="w-full bg-primary text-white hover:bg-primary/90 h-12">Mua ngay</Button>
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10 h-12"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        Đang thêm...
                      </>
                    ) : (
                      <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Thêm vào giỏ hàng
                      </>
                    )}
                  </Button>
                  {addToCartSuccess && (
                    <div className="mt-2 p-2 bg-green-50 text-green-600 rounded-md text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Đã thêm sản phẩm vào giỏ hàng
                    </div>
                  )}

                  {addToCartError && (
                    <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-md text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {addToCartError}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Thông số kỹ thuật</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Màn hình</span>
                  <span className="font-medium">
                    {product.detail.screenSize} inch, {product.detail.screenTechnology}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Độ phân giải</span>
                  <span className="font-medium">{product.detail.screenResolution}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Hệ điều hành</span>
                  <span className="font-medium">{product.detail.os}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Camera sau</span>
                  <span className="font-medium">{product.detail.backCamera}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Camera trước</span>
                  <span className="font-medium">{product.detail.frontCamera}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Chip xử lý</span>
                  <span className="font-medium">{product.detail.chipset}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">CPU</span>
                  <span className="font-medium">{product.detail.cpu}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">RAM</span>
                  <span className="font-medium">{product.detail.ram}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Bộ nhớ trong</span>
                  <span className="font-medium">{product.detail.memory}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Pin</span>
                  <span className="font-medium">{product.detail.battery}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">SIM</span>
                  <span className="font-medium">{product.detail.sim}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">NFC</span>
                  <span className="font-medium">{product.detail.nfc ? "Có" : "Không"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Kết nối</span>
                  <span className="font-medium">{product.detail.compatible}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Tính năng màn hình</span>
                  <span className="font-medium">{product.detail.screenFeature}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, User, Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import SellerSidebar from "@/components/seller-sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id: number
  name: string
  price: number
  quantity: number
  rating: number
  imageURL: string
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<string>("name")

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [productDetails, setProductDetails] = useState<any>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get shopCode from localStorage or another source
      // For demo purposes, we'll use a placeholder
      const shopCode = localStorage.getItem("shopCode") || "SHOP1746464777390"

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Bạn chưa đăng nhập")
      }

      const response = await fetch(`http://localhost:8080/api/item/shopCode?shopCode=${shopCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.status === 200 && data.message === "Success") {
        setProducts(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch products")
      }
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err instanceof Error ? err.message : "Không thể tải danh sách sản phẩm")

      // Use example data if API fails
      setProducts([
        {
          id: 3,
          name: "iPhone 15 Pro",
          price: 899.99,
          quantity: 86,
          rating: 4.5,
          imageURL:
            "https://raw.githubusercontent.com/HighTexT5/high-tex-client/refs/heads/main/client/public/smartphone/iphone15pro/1.png",
        },
        {
          id: 4,
          name: "Samsung Galaxy S23",
          price: 749.99,
          quantity: 150,
          rating: 4.2,
          imageURL:
            "https://raw.githubusercontent.com/HighTexT5/high-tex-client/refs/heads/main/client/public/smartphone/homepage/4.png",
        },
        {
          id: 5,
          name: "Google Pixel 8",
          price: 699.99,
          quantity: 75,
          rating: 4.3,
          imageURL:
            "https://raw.githubusercontent.com/HighTexT5/high-tex-client/refs/heads/main/client/public/smartphone/homepage/5.png",
        },
        {
          id: 6,
          name: "Xiaomi 14",
          price: 649.99,
          quantity: 120,
          rating: 4.1,
          imageURL:
            "https://raw.githubusercontent.com/HighTexT5/high-tex-client/refs/heads/main/client/public/smartphone/homepage/6.png",
        },
        {
          id: 7,
          name: "OnePlus 12",
          price: 799.99,
          quantity: 60,
          rating: 4.4,
          imageURL:
            "https://raw.githubusercontent.com/HighTexT5/high-tex-client/refs/heads/main/client/public/smartphone/homepage/7.png",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewProductDetails = async (productId: number) => {
    setSelectedProductId(productId)
    setIsDetailsModalOpen(true)
    setIsLoadingDetails(true)
    setDetailsError(null)
    setProductDetails(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Bạn chưa đăng nhập")
      }

      const response = await fetch(`http://localhost:8080/api/item/detail?id=${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.status === 200 && data.message === "Success") {
        setProductDetails(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch product details")
      }
    } catch (err) {
      console.error("Error fetching product details:", err)
      setDetailsError(err instanceof Error ? err.message : "Không thể tải thông tin chi tiết sản phẩm")
    } finally {
      setIsLoadingDetails(false)
    }
  }


  // Format price to Vietnamese currency
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ"
  }

  // Filter and sort products
  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.id.toString().includes(searchTerm),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price_asc":
          return a.price - b.price
        case "price_desc":
          return b.price - a.price
        case "quantity":
          return b.quantity - a.quantity
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-4">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mr-2">
              <span className="text-accent-yellow font-bold text-xl">?</span>
            </div>
            <span className="text-dark-blue text-2xl font-bold">HighTEx</span>
          </Link>
          <h1 className="text-xl font-semibold">Kênh người bán</h1>
        </div>

        <div className="flex items-center">
          <Link href="/">
            <Button variant="outline" className="mr-2 bg-accent text-black border-accent h-10 px-3">
              Về trang chủ
            </Button>
          </Link>
          <Button variant="outline" className="mr-2 bg-accent text-black border-accent h-10 w-10 p-0">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="bg-accent text-black border-accent h-10 w-10 p-0">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <SellerSidebar activePage="products" />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-blue-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Tất cả sản phẩm</h2>
              <div className="flex space-x-2">
                <Button onClick={fetchProducts} variant="outline" size="sm" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      Đang tải...
                    </>
                  ) : (
                    "Làm mới"
                  )}
                </Button>
                <Link href="/seller/add_product">
                  <Button className="bg-primary text-white" size="sm">
                    Thêm sản phẩm
                  </Button>
                </Link>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm mb-4">
                {error}
                <p>Đang hiển thị dữ liệu mẫu</p>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Tìm kiếm theo tên sản phẩm hoặc ID"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Tên (A-Z)</SelectItem>
                    <SelectItem value="price_asc">Giá (Thấp - Cao)</SelectItem>
                    <SelectItem value="price_desc">Giá (Cao - Thấp)</SelectItem>
                    <SelectItem value="quantity">Số lượng</SelectItem>
                    <SelectItem value="rating">Đánh giá</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span className="ml-3">Đang tải dữ liệu...</span>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead className="text-right">Giá</TableHead>
                      <TableHead className="text-center">Số lượng</TableHead>
                      <TableHead className="text-center">Đánh giá</TableHead>
                      <TableHead className="w-[100px] text-center">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                        <TableCell className="text-center">{product.quantity}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <span>{product.rating.toFixed(1)}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-yellow-400 fill-yellow-400 ml-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleViewProductDetails(product.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-md border">
                <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                <Link href="/seller/add_product">
                  <Button className="mt-4 bg-primary text-white">Thêm sản phẩm mới</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Product Details Modal */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Chi tiết sản phẩm</h3>
                <button
                  onClick={() => {
                    setIsDetailsModalOpen(false)
                    setSelectedProductId(null)
                    setProductDetails(null)
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {isLoadingDetails ? (
                <div className="flex justify-center items-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <span className="ml-3">Đang tải thông tin chi tiết...</span>
                </div>
              ) : detailsError ? (
                <div className="bg-red-100 text-red-600 p-4 rounded-md">
                  <p>{detailsError}</p>
                </div>
              ) : productDetails ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <div className="flex justify-center items-center border rounded-lg p-4">
                      <img
                        src={productDetails.thumbnailUrl || "/placeholder.svg?height=300&width=300"}
                        alt={productDetails.itemName}
                        className="max-h-[300px] object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">{productDetails.itemName}</h2>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-yellow-400 fill-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-sm">{productDetails.rating.toFixed(1)}</span>
                        </div>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-sm text-gray-500">Còn {productDetails.quantity} sản phẩm</span>
                      </div>

                      <div className="mb-6">
                        <div className="text-2xl font-bold text-red-600">
                          {productDetails.currentPrice.toLocaleString("vi-VN")}đ
                        </div>
                        {productDetails.originPrice > productDetails.currentPrice && (
                          <div className="flex items-center mt-1">
                            <span className="line-through text-gray-500">
                              {productDetails.originPrice.toLocaleString("vi-VN")}đ
                            </span>
                            <span className="ml-2 text-red-500">
                              -{Math.round((1 - productDetails.currentPrice / productDetails.originPrice) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mã sản phẩm:</span>
                          <span className="font-medium">{productDetails.itemCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Danh mục:</span>
                          <span className="font-medium">{productDetails.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thương hiệu:</span>
                          <span className="font-medium">{productDetails.brand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nguồn gốc:</span>
                          <span className="font-medium">{productDetails.productSource}</span>
                        </div>
                      </div>

                      <div className="mt-6 flex space-x-3">
                        <Button className="bg-primary text-white flex-1">Chỉnh sửa</Button>
                        <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 flex-1">
                          Xóa sản phẩm
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Product Specifications */}
                  {productDetails.detail && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Thông số kỹ thuật</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Màn hình</span>
                            <span className="font-medium">
                              {productDetails.detail.screenSize} inch, {productDetails.detail.screenTechnology}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Độ phân giải</span>
                            <span className="font-medium">{productDetails.detail.screenResolution}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Hệ điều hành</span>
                            <span className="font-medium">{productDetails.detail.os}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Camera sau</span>
                            <span className="font-medium">{productDetails.detail.backCamera}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Camera trước</span>
                            <span className="font-medium">{productDetails.detail.frontCamera}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Chip xử lý</span>
                            <span className="font-medium">{productDetails.detail.chipset}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">CPU</span>
                            <span className="font-medium">{productDetails.detail.cpu}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">RAM</span>
                            <span className="font-medium">{productDetails.detail.ram}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Bộ nhớ trong</span>
                            <span className="font-medium">{productDetails.detail.memory}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Pin</span>
                            <span className="font-medium">{productDetails.detail.battery}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">SIM</span>
                            <span className="font-medium">{productDetails.detail.sim}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">NFC</span>
                            <span className="font-medium">{productDetails.detail.nfc ? "Có" : "Không"}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Kết nối</span>
                            <span className="font-medium">{productDetails.detail.compatible}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Tính năng màn hình</span>
                            <span className="font-medium">{productDetails.detail.screenFeature}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Không tìm thấy thông tin sản phẩm</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

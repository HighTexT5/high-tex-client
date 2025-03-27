"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import SellerSidebar from "@/components/seller-sidebar"
import { useRouter } from "next/navigation"

export default function AddProductPage() {
  const [productType, setProductType] = useState("Smartphone")
  const router = useRouter()

  const handleContinue = () => {
    // Navigate to the appropriate product type page
    if (productType) {
      router.push(`/seller/add_product/${productType.toLowerCase()}`)
    }
  }

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
        <SellerSidebar activePage="add_product" />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-blue-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-8">Bước 1: Chọn loại sản phẩm</h2>

            <div className="mb-8 max-w-md">
              <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1">
                Loại sản phẩm
              </label>
              <div className="relative">
                <select
                  id="productType"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full p-2 pr-8 border rounded appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Smartphone">Smartphone</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Phụ kiện">Phụ kiện</option>
                  <option value="Đồng hồ">Đồng hồ</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-12">
              <Button variant="outline" className="text-gray-600" onClick={() => router.push("/seller")}>
                Hủy
              </Button>
              <Button className="bg-primary text-white" onClick={handleContinue}>
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


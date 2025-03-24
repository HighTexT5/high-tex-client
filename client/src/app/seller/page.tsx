"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, User, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CategoryProps {
  title: string
  items: string[]
}

const categories: CategoryProps[] = [
  {
    title: "Quản lý đơn hàng",
    items: ["Tất cả đơn hàng", "Giao hàng loạt", "Đơn hủy", "Trả hàng/ Hoàn tiền", "Cài đặt vận chuyển"],
  },
  {
    title: "Quản lý sản phẩm",
    items: ["Tất cả sản phẩm", "Thêm sản phẩm", "Sản phẩm vi phạm", "Cài đặt ản phẩm"],
  },
  {
    title: "Tài chính",
    items: ["Doanh thu", "Số dư TK HighTEx", "Tài khoản ngân hàng"],
  },
  {
    title: "Chăm sóc khách hàng",
    items: ["Hỏi-đáp"],
  },
  {
    title: "Quản lý phân phối",
    items: ["Hồ sơ", "Thiết lập", "Đánh giá"],
  },
]

function Category({ title, items }: CategoryProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="mb-2">
      <div
        className="flex justify-between items-center py-2 px-4 cursor-pointer hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{title}</span>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>
      {isOpen && (
        <div className="pl-8 py-1">
          {items.map((item, index) => (
            <Link key={index} href="#" className="block py-1.5 hover:text-primary">
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SellerPage() {
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
        <div className="w-64 bg-white border-r">
          {categories.map((category, index) => (
            <Category key={index} title={category.title} items={category.items} />
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4">Chào mừng đến với Kênh người bán</h2>
          <p className="text-gray-600">Quản lý cửa hàng, sản phẩm và đơn hàng của bạn tại đây.</p>
        </div>
      </div>
    </div>
  )
}


"use client"
import Link from "next/link"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import SellerSidebar from "@/components/seller-sidebar"

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
        <SellerSidebar activePage="dashboard" />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4">Chào mừng đến với Kênh người bán</h2>
          <p className="text-gray-600">Quản lý cửa hàng, sản phẩm và đơn hàng của bạn tại đây.</p>
        </div>
      </div>
    </div>
  )
}


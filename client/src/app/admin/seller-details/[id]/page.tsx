"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CategoryProps {
  title: string
  items: {
    name: string
    path: string
    highlighted?: boolean
  }[]
  isOpen: boolean
  onToggle: () => void
}

function Category({ title, items, isOpen, onToggle }: CategoryProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center py-2 px-4 cursor-pointer hover:bg-gray-200" onClick={onToggle}>
        <span className="font-medium">{title}</span>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>
      {isOpen && (
        <div className="pl-4">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={`block py-2 px-4 ${item.highlighted ? "bg-accent text-white" : "hover:bg-gray-100"}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SellerDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [openCategories, setOpenCategories] = useState({
    users: true,
    products: false,
    orders: false,
    security: false,
  })

  const toggleCategory = (category: keyof typeof openCategories) => {
    setOpenCategories({
      ...openCategories,
      [category]: !openCategories[category],
    })
  }

  // Mock seller data
  const sellerData = {
    id: params.id,
    username: "Nguyễn Văn A",
    storeName: "Cửa hàng của Văn A",
    email: "vana@example.com",
    phone: "0123456789",
    address: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
    businessType: "Cá nhân",
    taxCode: "0123456789",
    description: "Chuyên kinh doanh các sản phẩm điện tử, điện thoại, laptop chính hãng với giá cả cạnh tranh.",
    createdAt: "01/01/2023",
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-gray-200 p-4 flex items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-accent rounded-md flex items-center justify-center mr-2">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className="text-blue-700 text-2xl font-bold">HighTEx</span>
          <span className="text-gray-700 text-2xl ml-4">Admin</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-[calc(100vh-64px)]">
          <Category
            title="Quản lý người dùng"
            items={[
              { name: "Duyệt/Khóa tài khoản", path: "/admin/accounts" },
              { name: "Cấp quyền người bán", path: "/admin/seller-permissions", highlighted: true },
              { name: "Cấp quyền admin", path: "/admin/admin-permissions" },
              { name: "Reset tài khoản", path: "/admin/reset-accounts" },
            ]}
            isOpen={openCategories.users}
            onToggle={() => toggleCategory("users")}
          />

          <Category
            title="Quản lý sản phẩm"
            items={[
              { name: "Kiểm duyệt sản phẩm", path: "/admin/review-products" },
              { name: "Gỡ bỏ sản phẩm", path: "/admin/remove-products" },
            ]}
            isOpen={openCategories.products}
            onToggle={() => toggleCategory("products")}
          />

          <Category
            title="Quản lý đơn hàng, giao dịch"
            items={[
              { name: "Hủy đơn hàng", path: "/admin/cancel-orders" },
              { name: "Lịch sử giao dịch", path: "/admin/transaction-history" },
            ]}
            isOpen={openCategories.orders}
            onToggle={() => toggleCategory("orders")}
          />

          <Category
            title="Bảo mật và pháp lý"
            items={[
              { name: "xử lý tố cáo", path: "/admin/reports" },
              { name: "Thay đổi điều khoản dịch vụ(TOS) và chính sách bảo mật", path: "/admin/terms-privacy" },
            ]}
            isOpen={openCategories.security}
            onToggle={() => toggleCategory("security")}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-6">
              <button onClick={() => router.push("/admin")} className="mr-3">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold">Chi tiết người bán</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Thông tin cá nhân</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Tên người dùng:</span> {sellerData.username}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {sellerData.email}
                  </div>
                  <div>
                    <span className="font-medium">Số điện thoại:</span> {sellerData.phone}
                  </div>
                  <div>
                    <span className="font-medium">Địa chỉ:</span> {sellerData.address}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Thông tin cửa hàng</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Tên cửa hàng:</span> {sellerData.storeName}
                  </div>
                  <div>
                    <span className="font-medium">Loại hình kinh doanh:</span> {sellerData.businessType}
                  </div>
                  <div>
                    <span className="font-medium">Mã số thuế:</span> {sellerData.taxCode}
                  </div>
                  <div>
                    <span className="font-medium">Ngày đăng ký:</span> {sellerData.createdAt}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-2">Mô tả cửa hàng</h3>
                <p className="text-gray-700">{sellerData.description}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                Từ chối
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">Phê duyệt</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


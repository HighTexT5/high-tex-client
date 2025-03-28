"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, Users, ShoppingBag, CreditCard, Shield } from "lucide-react"

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

export default function AdminPage() {
  const [openCategories, setOpenCategories] = useState({
    users: true,
    products: true,
    orders: true,
    security: true,
  })

  const toggleCategory = (category: keyof typeof openCategories) => {
    setOpenCategories({
      ...openCategories,
      [category]: !openCategories[category],
    })
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
              { name: "Cấp quyền người bán", path: "/admin/seller_verification" },
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
            <h2 className="text-xl font-semibold mb-6">Bảng điều khiển</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <div className="bg-blue-500 p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Người dùng</p>
                    <p className="text-xl font-semibold">1,234</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <div className="bg-green-500 p-3 rounded-full mr-4">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sản phẩm</p>
                    <p className="text-xl font-semibold">5,678</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="flex items-center">
                  <div className="bg-yellow-500 p-3 rounded-full mr-4">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Đơn hàng</p>
                    <p className="text-xl font-semibold">912</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="flex items-center">
                  <div className="bg-red-500 p-3 rounded-full mr-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Báo cáo vi phạm</p>
                    <p className="text-xl font-semibold">23</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Hoạt động gần đây</h3>
                <ul className="space-y-3">
                  <li className="text-sm pb-2 border-b">
                    <p className="text-gray-800">Người dùng mới đăng ký</p>
                    <p className="text-gray-500 text-xs">2 phút trước</p>
                  </li>
                  <li className="text-sm pb-2 border-b">
                    <p className="text-gray-800">Đơn hàng mới #12345</p>
                    <p className="text-gray-500 text-xs">15 phút trước</p>
                  </li>
                  <li className="text-sm pb-2 border-b">
                    <p className="text-gray-800">Yêu cầu cấp quyền người bán mới</p>
                    <p className="text-gray-500 text-xs">1 giờ trước</p>
                  </li>
                  <li className="text-sm">
                    <p className="text-gray-800">Sản phẩm mới được đăng</p>
                    <p className="text-gray-500 text-xs">3 giờ trước</p>
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Thống kê hệ thống</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">CPU</span>
                      <span className="text-sm text-gray-500">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Bộ nhớ</span>
                      <span className="text-sm text-gray-500">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Lưu trữ</span>
                      <span className="text-sm text-gray-500">63%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "63%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Băng thông</span>
                      <span className="text-sm text-gray-500">28%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "28%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


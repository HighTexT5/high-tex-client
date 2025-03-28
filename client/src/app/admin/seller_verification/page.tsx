"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
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

export default function SellerVerificationPage() {
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

  // Add these state variables at the top with the other state declarations
  const [sellerRequests, setSellerRequests] = useState([
    {
      id: "1",
      username: "Nguyễn Văn A",
      storeName: "Cửa hàng của Văn A",
      details: "/admin/seller-details/1",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Add this useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchSellerRequests()
  }, [])

  // Add this function to fetch seller requests
  const fetchSellerRequests = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8080/api/admin/seller-requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch seller requests")
      }

      const data = await response.json()
      console.log("Fetched seller requests:", data) // Debug log

      // If data is available and is an array, update the state
      if (data && Array.isArray(data)) {
        // Map the API response to match our expected format
        const formattedData = data.map((item) => ({
          id: item.id || item._id || String(Math.random()),
          username: item.fullName || item.username || "Unknown",
          storeName: item.shopName || "Unknown",
          details: `/admin/seller-details/${item.id || item._id || Math.random()}`,
        }))

        // Keep the example if the array is empty
        if (formattedData.length === 0) {
          console.log("No seller requests found, keeping example data")
        } else {
          setSellerRequests(formattedData)
        }
      }
    } catch (err) {
      console.error("Error fetching seller requests:", err)
      setError("Không thể tải danh sách yêu cầu. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  // Replace the Main Content section with this updated version
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
              { name: "Cấp quyền người bán", path: "/admin/seller_verification", highlighted: true },
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Cấp quyền người bán</h2>
              <Button onClick={fetchSellerRequests} variant="outline" size="sm" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Đang tải...
                  </>
                ) : (
                  "Làm mới"
                )}
              </Button>
            </div>

            {error && <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm mb-4">{error}</div>}

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 border-b border-r text-left text-sm font-medium text-gray-500">
                      Tên người dùng
                    </th>
                    <th className="px-6 py-3 border-b border-r text-left text-sm font-medium text-gray-500">
                      Tên cửa hàng
                    </th>
                    <th className="px-6 py-3 border-b border-r text-center text-sm font-medium text-gray-500">
                      Thông tin chi tiết
                    </th>
                    <th className="px-6 py-3 border-b text-center text-sm font-medium text-gray-500">Kiểm duyệt</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        <div className="flex justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        </div>
                        <p className="mt-2">Đang tải dữ liệu...</p>
                      </td>
                    </tr>
                  ) : sellerRequests.length > 0 ? (
                    sellerRequests.map((request, index) => (
                      <tr key={request.id || index}>
                        <td className="px-6 py-4 border-r whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.username}
                        </td>
                        <td className="px-6 py-4 border-r whitespace-nowrap text-sm text-gray-500">
                          {request.storeName}
                        </td>
                        <td className="px-6 py-4 border-r text-center whitespace-nowrap text-sm text-blue-600">
                          <Link href={request.details} className="hover:underline">
                            Chi tiết
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Kiểm duyệt</Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Không có yêu cầu nào cần duyệt
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


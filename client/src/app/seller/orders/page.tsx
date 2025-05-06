"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, User, Search, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import SellerSidebar from "@/components/seller-sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Order {
  orderCode: string
  itemCode: string
  itemName: string
  quantity: number
  totalPrice: number
  status: string
}

export default function AllOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Bạn chưa đăng nhập")
      }

      const response = await fetch("http://localhost:8080/api/order/distributor/list-order-for-distributor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.status === 200 && data.message === "Success") {
        setOrders(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch orders")
      }
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError(err instanceof Error ? err.message : "Không thể tải danh sách đơn hàng")

      // Use example data if API fails
      setOrders([
        {
          orderCode: "ORDER_1743353607237",
          itemCode: "SM28841743270276718",
          itemName: "Smartphone XYZ2",
          quantity: 3,
          totalPrice: 2999997.0,
          status: "Pending",
        },
        {
          orderCode: "ORDER_1743353607238",
          itemCode: "SM28841743270276719",
          itemName: "iPhone 15 Pro Max",
          quantity: 1,
          totalPrice: 34990000.0,
          status: "Processing",
        },
        {
          orderCode: "ORDER_1743353607239",
          itemCode: "SM28841743270276720",
          itemName: "Samsung Galaxy S25 Ultra",
          quantity: 2,
          totalPrice: 52990000.0,
          status: "Shipped",
        },
        {
          orderCode: "ORDER_1743353607240",
          itemCode: "SM28841743270276721",
          itemName: "Xiaomi 14 Ultra",
          quantity: 1,
          totalPrice: 24990000.0,
          status: "Delivered",
        },
        {
          orderCode: "ORDER_1743353607241",
          itemCode: "SM28841743270276722",
          itemName: "Google Pixel 8 Pro",
          quantity: 1,
          totalPrice: 22990000.0,
          status: "Cancelled",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Format price to Vietnamese currency
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ"
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.itemName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
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
        <SellerSidebar activePage="orders" />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-blue-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Tất cả đơn hàng</h2>
              <Button onClick={fetchOrders} variant="outline" size="sm" disabled={isLoading}>
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
                  placeholder="Tìm kiếm theo mã đơn hàng, mã sản phẩm hoặc tên sản phẩm"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending">Đang chờ</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="shipped">Đã gửi hàng</SelectItem>
                    <SelectItem value="delivered">Đã giao hàng</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span className="ml-3">Đang tải dữ liệu...</span>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Mã đơn hàng</TableHead>
                      <TableHead>Mã sản phẩm</TableHead>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead className="text-center">Số lượng</TableHead>
                      <TableHead className="text-right">Tổng tiền</TableHead>
                      <TableHead className="text-center">Trạng thái</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.orderCode}>
                        <TableCell className="font-medium">{order.orderCode}</TableCell>
                        <TableCell>{order.itemCode}</TableCell>
                        <TableCell>{order.itemName}</TableCell>
                        <TableCell className="text-center">{order.quantity}</TableCell>
                        <TableCell className="text-right">{formatPrice(order.totalPrice)}</TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Mở menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => alert(`Xem chi tiết đơn hàng ${order.orderCode}`)}>
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {order.status === "Pending" && (
                                 <DropdownMenuItem
                                 onClick={async () => {
                                   try {
                                     const token = localStorage.getItem("token")
                                     if (!token) {
                                       alert("Bạn chưa đăng nhập")
                                       return
                                     }

                                     // Show loading notification
                                     alert("Đang xác nhận đơn hàng...")

                                     const response = await fetch("http://localhost:8080/api/order/distributor/accept-order", {
                                       method: "POST",
                                       headers: {
                                         "Content-Type": "application/json",
                                         Authorization: `Bearer ${token}`,
                                       },
                                       body: JSON.stringify({
                                         orderCode: order.orderCode,
                                       }),
                                     })

                                     const data = await response.text()

                                     // Show response from API as notification
                                     if (response.ok) {
                                       alert(`Thành công: ${data}`)
                                       // Refresh orders list
                                       fetchOrders()
                                     } else {
                                       alert(`Lỗi: "Không thể xác nhận đơn hàng"}`)
                                     }
                                   } catch (error) {
                                     console.error("Error confirming order:", error)
                                     alert(
                                       `Đã xảy ra lỗi: ${error instanceof Error ? error.message : "Không thể xác nhận đơn hàng"}`,
                                     )
                                   }
                                 }}
                               >
                                  Xác nhận đơn hàng
                                </DropdownMenuItem>
                              )}
                              {(order.status === "Pending" || order.status === "Processing") && (
                                <DropdownMenuItem
                                  onClick={() => alert(`Hủy đơn hàng ${order.orderCode}`)}
                                  className="text-red-600"
                                >
                                  Hủy đơn hàng
                                </DropdownMenuItem>
                              )}
                              {order.status === "Processing" && (
                                <DropdownMenuItem onClick={() => alert(`Gửi hàng cho đơn hàng ${order.orderCode}`)}>
                                  Gửi hàng
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-md border">
                <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

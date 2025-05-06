"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, User, Search, MoreHorizontal, X, Loader2 } from "lucide-react"
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
  userCode?: string // Add userCode to the Order interface
}

interface UserDetails {
  fullName: string
  phoneNumber: number
  address: string
}

export default function AllOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // State for order details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(false)
  const [userDetailsError, setUserDetailsError] = useState<string | null>(null)

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
          userCode: "USER123", 
        },
        {
          orderCode: "ORDER_1743353607238",
          itemCode: "SM28841743270276719",
          itemName: "iPhone 15 Pro Max",
          quantity: 1,
          totalPrice: 34990000.0,
          status: "Processing",
          userCode: "USER456",
        },
        {
          orderCode: "ORDER_1743353607239",
          itemCode: "SM28841743270276720",
          itemName: "Samsung Galaxy S25 Ultra",
          quantity: 2,
          totalPrice: 52990000.0,
          status: "Shipped",
          userCode: "USER789",
        },
        {
          orderCode: "ORDER_1743353607240",
          itemCode: "SM28841743270276721",
          itemName: "Xiaomi 14 Ultra",
          quantity: 1,
          totalPrice: 24990000.0,
          status: "Delivered",
          userCode: "USER101",
        },
        {
          orderCode: "ORDER_1743353607241",
          itemCode: "SM28841743270276722",
          itemName: "Google Pixel 8 Pro",
          quantity: 1,
          totalPrice: 22990000.0,
          status: "Cancelled",
          userCode: "USER202",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Function to fetch user details
  const fetchUserDetails = async (userCode: string) => {
    setIsLoadingUserDetails(true)
    setUserDetailsError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Bạn chưa đăng nhập")
      }

      const response = await fetch(`http://localhost:8080/api/au/user/get-by-code?userCode=${userCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.status === 200 && data.message === "Success" && data.data) {
        // Extract required fields from the response
        setUserDetails({
          fullName: data.data.fullName || "Không có thông tin",
          phoneNumber: data.data.phoneNumber || 0,
          address: data.data.address || "Không có địa chỉ",
        })
      } else {
        throw new Error(data.message || "Failed to fetch user details")
      }
    } catch (err) {
      console.error("Error fetching user details:", err)
      setUserDetailsError(err instanceof Error ? err.message : "Không thể tải thông tin người dùng")

      // Use example data if API fails
      setUserDetails({
        fullName: "Nguyễn Văn A",
        phoneNumber: 1234567890,
        address: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
      })
    } finally {
      setIsLoadingUserDetails(false)
    }
  }

  // Function to handle opening the details modal
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsModalOpen(true)

    // Fetch user details if userCode is available
    if (order.userCode) {
      fetchUserDetails(order.userCode)
    } else {
      setUserDetailsError("Không có mã người dùng")
      // Use example data
      setUserDetails({
        fullName: "Nguyễn Văn A",
        phoneNumber: 1234567890,
        address: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
      })
    }
  }

  // Function to close the details modal
  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedOrder(null)
    setUserDetails(null)
    setUserDetailsError(null)
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
                              <DropdownMenuItem onClick={() => handleViewDetails(order)}>Xem chi tiết</DropdownMenuItem>
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
    {/* Order Details Modal */}
    {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Chi tiết đơn hàng</h3>
                <button onClick={handleCloseDetailsModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Details Section */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Thông tin khách hàng</h4>

                  {isLoadingUserDetails ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span>Đang tải thông tin khách hàng...</span>
                    </div>
                  ) : userDetailsError ? (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                      {userDetailsError}
                      <p>Đang hiển thị dữ liệu mẫu</p>
                    </div>
                  ) : userDetails ? (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Họ và tên</p>
                          <p className="font-medium">{userDetails.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Số điện thoại</p>
                          <p className="font-medium">{userDetails.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-500">Địa chỉ</p>
                        <p className="font-medium">{userDetails.address}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Không có thông tin khách hàng</p>
                  )}
                </div>

                {/* Order Details Section */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Thông tin đơn hàng</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Mã đơn hàng</p>
                        <p className="font-medium">{selectedOrder.orderCode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Trạng thái</p>
                        <p className="font-medium">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Sản phẩm</p>
                      <div className="mt-2 border rounded-md">
                        <div className="grid grid-cols-12 bg-gray-100 p-2 text-sm font-medium">
                          <div className="col-span-6">Tên sản phẩm</div>
                          <div className="col-span-2 text-center">Mã sản phẩm</div>
                          <div className="col-span-2 text-center">Số lượng</div>
                          <div className="col-span-2 text-right">Thành tiền</div>
                        </div>
                        <div className="grid grid-cols-12 p-2 text-sm border-t">
                          <div className="col-span-6">{selectedOrder.itemName}</div>
                          <div className="col-span-2 text-center">{selectedOrder.itemCode}</div>
                          <div className="col-span-2 text-center">{selectedOrder.quantity}</div>
                          <div className="col-span-2 text-right">{formatPrice(selectedOrder.totalPrice)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center font-medium">
                      <span>Tổng tiền:</span>
                      <span className="text-lg">{formatPrice(selectedOrder.totalPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-4">
                  <Button variant="outline" onClick={handleCloseDetailsModal}>
                    Đóng
                  </Button>

                  {selectedOrder.status === "Pending" && (
                    <Button
                      className="bg-primary text-white"
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
                              orderCode: selectedOrder.orderCode,
                            }),
                          })

                          const data = await response.json()

                          // Show response from API as notification
                          if (response.ok && data.status === 200) {
                            alert(`Thành công: ${data.message}`)
                            // Close modal and refresh orders list
                            handleCloseDetailsModal()
                            fetchOrders()
                          } else {
                            alert(`Lỗi: ${data.message || "Không thể xác nhận đơn hàng"}`)
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
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

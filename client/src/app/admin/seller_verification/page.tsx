"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

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

interface SellerRequest {
  id: string
  username: string
  storeName: string
  details: string
}

interface SellerDetails {
  id: string
  fullName: string
  userCode: string
  shopName: string
  shopWarehouseAddress: string
  shopPhone: string
  shopEmail: string
  shopTaxCode: string
  description: string
  createdDate: string
  modifiedDate?: string
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

  // State for seller requests and loading
  const [sellerRequests, setSellerRequests] = useState<SellerRequest[]>([
    {
      id: "1",
      username: "Nguyễn Văn A",
      storeName: "Cửa hàng của Văn A",
      details: "/admin/seller-details/1",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State for modal and selected seller details
  const [showModal, setShowModal] = useState(false)
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null)
  const [sellerDetails, setSellerDetails] = useState<SellerDetails | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  // State for confirmation dialogs
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [reasonText, setReasonText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  // Fetch seller requests on component mount
  useEffect(() => {
    fetchSellerRequests()
  }, [])

  // Fetch seller details when a seller is selected
  useEffect(() => {
    if (selectedSellerId) {
      fetchSellerDetails(selectedSellerId)
    }
  }, [selectedSellerId])

  // Function to fetch seller requests
  const fetchSellerRequests = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8080/api/request/admin/get-list-be-a-distributor", {
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
      if (data && Array.isArray(data.data)) {
        // Map the API response to match our expected format
        const formattedData = data.data.map((item) => ({
          id: item.requestId || item._id || String(Math.random()),
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

  // Function to fetch seller details
  const fetchSellerDetails = async (sellerId: string) => {
    setIsLoadingDetails(true)
    setDetailsError(null)

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://localhost:8080/api/request/all/get-detail-be-a-distributor?requestId=${sellerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch seller details")
      }

      const data = await response.json()
      console.log("Fetched seller details:", data) // Debug log

      // If no data is returned, use example data
      if (!data) {
        setSellerDetails({
          id: sellerId,
          fullName: "Nguyen Van A",
          userCode: "UBfLcpJLsFyZIzLHvkqJ",
          shopName: "Cửa hàng của Văn A",
          shopWarehouseAddress: "Di Trach, Hoai Duc, Ha Noi",
          shopPhone: "0369251103",
          shopEmail: "shopvipvip12@gmail.com",
          shopTaxCode: "0033382173984102314",
          description: "shop nay ban acc",
          createdDate: new Date().toLocaleDateString("vi-VN"),
          modifiedDate: new Date().toLocaleDateString("vi-VN"),
        })
      } else {
        // Map the API response to match our expected format
        setSellerDetails({
          id: sellerId,
          fullName: data.fullName || "Unknown",
          userCode: data.userCode || "Unknown",
          shopName: data.shopName || "Unknown",
          shopWarehouseAddress: data.shopWarehouseAddress || "Unknown",
          shopPhone: data.shopPhone || "Unknown",
          shopEmail: data.shopEmail || "Unknown",
          shopTaxCode: data.shopTaxCode || "Unknown",
          description: data.description || "No description",
          createdDate: data.createdDate ? new Date(data.createdDate).toLocaleDateString("vi-VN") : "Unknown",
          modifiedDate: data.modifiedDate ? new Date(data.modifiedDate).toLocaleDateString("vi-VN") : undefined,
        })
      }
    } catch (err) {
      console.error("Error fetching seller details:", err)
      setDetailsError("Không thể tải thông tin chi tiết. Vui lòng thử lại sau.")

      // Use example data on error
      setSellerDetails({
        id: sellerId,
        fullName: "Nguyen Van A",
        userCode: "UBfLcpJLsFyZIzLHvkqJ",
        shopName: "Cửa hàng của Văn A",
        shopWarehouseAddress: "Di Trach, Hoai Duc, Ha Noi",
        shopPhone: "0369251103",
        shopEmail: "shopvipvip12@gmail.com",
        shopTaxCode: "0033382173984102314",
        description: "shop nay ban acc",
        createdDate: new Date().toLocaleDateString("vi-VN"),
        modifiedDate: new Date().toLocaleDateString("vi-VN"),
      })
    } finally {
      setIsLoadingDetails(false)
    }
  }

  // Function to handle opening the details modal
  const handleViewDetails = (sellerId: string) => {
    setSelectedSellerId(sellerId)
    setShowModal(true)
  }

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false)
    setSelectedSellerId(null)
    setSellerDetails(null)
    setShowRejectDialog(false)
    setShowApproveDialog(false)
    setReasonText("")
    setSubmitError(null)
    setSubmitSuccess(null)
  }

  // Function to handle rejection or approval submission
  const handleSubmitDecision = async (opinion: "approved" | "rejected") => {
    if (!selectedSellerId) return

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8080/api/request/admin/opinion-from-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          requestId: selectedSellerId,
          opinion: opinion,
          detail: reasonText,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${opinion === "approved" ? "approve" : "reject"} seller request`)
      }

      // Show success message
      setSubmitSuccess(
        opinion === "approved" ? "Yêu cầu đã được phê duyệt thành công!" : "Yêu cầu đã bị từ chối thành công!",
      )

      // Close dialogs but keep modal open to show success message
      setShowRejectDialog(false)
      setShowApproveDialog(false)

      // Refresh the seller requests list after a short delay
      setTimeout(() => {
        fetchSellerRequests()
        closeModal()
      }, 2000)
    } catch (err) {
      console.error(`Error ${opinion === "approved" ? "approving" : "rejecting"} seller:`, err)
      setSubmitError(
        err instanceof Error
          ? err.message
          : `Không thể ${opinion === "approved" ? "phê duyệt" : "từ chối"} yêu cầu. Vui lòng thử lại sau.`,
      )
    } finally {
      setIsSubmitting(false)
    }
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
                          <button
                            onClick={() => handleViewDetails(request.id)}
                            className="text-blue-600 hover:underline"
                          >
                            Chi tiết
                          </button>
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

      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Thông tin chi tiết người bán</h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {detailsError && (
                <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm mb-4">{detailsError}</div>
              )}

              {submitSuccess && (
                <div className="bg-green-100 text-green-600 p-3 rounded-md text-sm mb-4 flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  {submitSuccess}
                </div>
              )}

              {submitError && (
                <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm mb-4 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {submitError}
                </div>
              )}

              {isLoadingDetails ? (
                <div className="flex justify-center items-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="ml-3">Đang tải thông tin...</p>
                </div>
              ) : sellerDetails ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium mb-4">Thông tin cá nhân</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 border-b pb-2">
                          <span className="font-medium text-gray-600">Họ và tên:</span>
                          <span className="col-span-2">{sellerDetails.fullName}</span>
                        </div>
                        <div className="grid grid-cols-3 border-b pb-2">
                          <span className="font-medium text-gray-600">Mã người dùng:</span>
                          <span className="col-span-2">{sellerDetails.userCode}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-4">Thông tin cửa hàng</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 border-b pb-2">
                          <span className="font-medium text-gray-600">Tên cửa hàng:</span>
                          <span className="col-span-2">{sellerDetails.shopName}</span>
                        </div>
                        <div className="grid grid-cols-3 border-b pb-2">
                          <span className="font-medium text-gray-600">Số điện thoại:</span>
                          <span className="col-span-2">{sellerDetails.shopPhone}</span>
                        </div>
                        <div className="grid grid-cols-3 border-b pb-2">
                          <span className="font-medium text-gray-600">Email:</span>
                          <span className="col-span-2">{sellerDetails.shopEmail}</span>
                        </div>
                        <div className="grid grid-cols-3 border-b pb-2">
                          <span className="font-medium text-gray-600">Mã số thuế:</span>
                          <span className="col-span-2">{sellerDetails.shopTaxCode}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">Địa chỉ kho hàng</h4>
                    <p className="text-gray-700 p-3 bg-gray-50 rounded">{sellerDetails.shopWarehouseAddress}</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">Mô tả</h4>
                    <p className="text-gray-700 p-3 bg-gray-50 rounded">{sellerDetails.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-3 border-b pb-2">
                      <span className="font-medium text-gray-600">Ngày tạo:</span>
                      <span className="col-span-2">{sellerDetails.createdDate}</span>
                    </div>
                    {sellerDetails.modifiedDate && (
                      <div className="grid grid-cols-3 border-b pb-2">
                        <span className="font-medium text-gray-600">Ngày cập nhật:</span>
                        <span className="col-span-2">{sellerDetails.modifiedDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => setShowRejectDialog(true)}
                      disabled={isSubmitting || !!submitSuccess}
                    >
                      Từ chối
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setShowApproveDialog(true)}
                      disabled={isSubmitting || !!submitSuccess}
                    >
                      Phê duyệt
                    </Button>
                  </div>

                  {/* Reject Dialog */}
                  {showRejectDialog && (
                    <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                      <h4 className="text-lg font-medium mb-3 text-red-600">Từ chối yêu cầu</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Vui lòng nhập lý do từ chối yêu cầu cấp quyền người bán này:
                      </p>
                      <Textarea
                        placeholder="Nhập lý do từ chối..."
                        value={reasonText}
                        onChange={(e) => setReasonText(e.target.value)}
                        className="mb-4"
                        rows={4}
                      />
                      <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={isSubmitting}>
                          Hủy
                        </Button>
                        <Button
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleSubmitDecision("rejected")}
                          disabled={isSubmitting || !reasonText.trim()}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              Đang xử lý...
                            </>
                          ) : (
                            "Xác nhận từ chối"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Approve Dialog */}
                  {showApproveDialog && (
                    <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                      <h4 className="text-lg font-medium mb-3 text-green-600">Phê duyệt yêu cầu</h4>
                      <p className="text-sm text-gray-600 mb-3">Vui lòng nhập ghi chú phê duyệt (nếu có):</p>
                      <Textarea
                        placeholder="Nhập ghi chú phê duyệt (không bắt buộc)..."
                        value={reasonText}
                        onChange={(e) => setReasonText(e.target.value)}
                        className="mb-4"
                        rows={4}
                      />
                      <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={isSubmitting}>
                          Hủy
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleSubmitDecision("approved")}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              Đang xử lý...
                            </>
                          ) : (
                            "Xác nhận phê duyệt"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">Không tìm thấy thông tin chi tiết</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


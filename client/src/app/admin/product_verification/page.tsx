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

interface ProductRequest {
  id: string
  storeName: string
  productType: string
  productName: string
}

interface ProductDetails {
  id: string
  storeName: string
  productType: string
  productName: string
  description: string
  price: string
  stock: number
  specifications: Record<string, string>
  images: string[]
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

export default function ProductVerificationPage() {
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

  // State for product requests and loading
  const [productRequests, setProductRequests] = useState<ProductRequest[]>([
    {
      id: "1",
      storeName: "Cửa hàng của Văn A",
      productType: "Smartphone",
      productName: "iPhone 15 Pro Max 256GB",
    },
    {
      id: "2",
      storeName: "Cửa hàng của Văn A",
      productType: "Laptop",
      productName: "MacBook Pro 14-inch M3",
    },
    {
      id: "3",
      storeName: "Cửa hàng Điện Tử XYZ",
      productType: "Tablet",
      productName: "iPad Air 5 64GB Wifi",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State for modal and selected product details
  const [showModal, setShowModal] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  // State for confirmation dialogs
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [reasonText, setReasonText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  // Fetch product requests on component mount
  useEffect(() => {
    fetchProductRequests()
  }, [])

  // Fetch product details when a product is selected
  useEffect(() => {
    if (selectedProductId) {
      fetchProductDetails(selectedProductId)
    }
  }, [selectedProductId])

  // Function to fetch product requests
  const fetchProductRequests = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8080/api/request/admin/get-list-active-item", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch product requests")
      }

      const data = await response.json()
      console.log("Fetched product requests:", data) // Debug log

      // If data is available and is an array, update the state
      if (data && Array.isArray(data)) {
        // Map the API response to match our expected format
        const formattedData = data.map((item) => ({
          id: item.id || item._id || String(Math.random()),
          storeName: item.storeName || "Unknown Store",
          productType: item.productType || "Unknown Type",
          productName: item.productName || "Unknown Product",
        }))

        // Keep the example if the array is empty
        if (formattedData.length === 0) {
          console.log("No product requests found, keeping example data")
        } else {
          setProductRequests(formattedData)
        }
      }
    } catch (err) {
      console.error("Error fetching product requests:", err)
      setError("Không thể tải danh sách yêu cầu. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to fetch product details
  const fetchProductDetails = async (productId: string) => {
    setIsLoadingDetails(true)
    setDetailsError(null)

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://localhost:8080/api/admin/product-details/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch product details")
      }

      const data = await response.json()
      console.log("Fetched product details:", data) // Debug log

      // If no data is returned, use example data
      if (!data) {
        // Use example data based on the product ID
        const exampleProduct = productRequests.find((p) => p.id === productId)

        setProductDetails({
          id: productId,
          storeName: exampleProduct?.storeName || "Unknown Store",
          productType: exampleProduct?.productType || "Unknown Type",
          productName: exampleProduct?.productName || "Unknown Product",
          description: "Sản phẩm chính hãng, bảo hành 12 tháng toàn quốc. Thiết kế sang trọng, hiệu năng mạnh mẽ.",
          price: "29.990.000 đ",
          stock: 50,
          specifications: {
            "Màn hình": "6.7 inch, OLED, Super Retina XDR",
            CPU: "Apple A17 Pro",
            RAM: "8GB",
            "Bộ nhớ trong": "256GB",
            "Camera sau": "48MP + 12MP + 12MP",
            "Camera trước": "12MP",
            Pin: "4422 mAh",
          },
          images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
          createdDate: new Date().toLocaleDateString("vi-VN"),
        })
      } else {
        // Map the API response to match our expected format
        setProductDetails({
          id: productId,
          storeName: data.storeName || "Unknown Store",
          productType: data.productType || "Unknown Type",
          productName: data.productName || "Unknown Product",
          description: data.description || "No description",
          price: data.price || "0 đ",
          stock: data.stock || 0,
          specifications: data.specifications || {},
          images: data.images || [],
          createdDate: data.createdDate ? new Date(data.createdDate).toLocaleDateString("vi-VN") : "Unknown",
          modifiedDate: data.modifiedDate ? new Date(data.modifiedDate).toLocaleDateString("vi-VN") : undefined,
        })
      }
    } catch (err) {
      console.error("Error fetching product details:", err)
      setDetailsError("Không thể tải thông tin chi tiết. Vui lòng thử lại sau.")

      // Use example data on error
      const exampleProduct = productRequests.find((p) => p.id === productId)

      setProductDetails({
        id: productId,
        storeName: exampleProduct?.storeName || "Unknown Store",
        productType: exampleProduct?.productType || "Unknown Type",
        productName: exampleProduct?.productName || "Unknown Product",
        description: "Sản phẩm chính hãng, bảo hành 12 tháng toàn quốc. Thiết kế sang trọng, hiệu năng mạnh mẽ.",
        price: "29.990.000 đ",
        stock: 50,
        specifications: {
          "Màn hình": "6.7 inch, OLED, Super Retina XDR",
          CPU: "Apple A17 Pro",
          RAM: "8GB",
          "Bộ nhớ trong": "256GB",
          "Camera sau": "48MP + 12MP + 12MP",
          "Camera trước": "12MP",
          Pin: "4422 mAh",
        },
        images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
        createdDate: new Date().toLocaleDateString("vi-VN"),
      })
    } finally {
      setIsLoadingDetails(false)
    }
  }

  // Function to handle opening the details modal
  const handleViewDetails = (productId: string) => {
    setSelectedProductId(productId)
    setShowModal(true)
  }

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false)
    setSelectedProductId(null)
    setProductDetails(null)
    setShowRejectDialog(false)
    setShowApproveDialog(false)
    setReasonText("")
    setSubmitError(null)
    setSubmitSuccess(null)
  }

  // Function to handle rejection or approval submission
  const handleSubmitDecision = async (opinion: "approved" | "rejected") => {
    if (!selectedProductId) return

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8080/api/admin/product-decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          requestId: selectedProductId,
          opinion: opinion,
          detail: reasonText,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${opinion === "approved" ? "approve" : "reject"} product request`)
      }

      // Show success message
      setSubmitSuccess(
        opinion === "approved" ? "Sản phẩm đã được phê duyệt thành công!" : "Sản phẩm đã bị từ chối thành công!",
      )

      // Close dialogs but keep modal open to show success message
      setShowRejectDialog(false)
      setShowApproveDialog(false)

      // Refresh the product requests list after a short delay
      setTimeout(() => {
        fetchProductRequests()
        closeModal()
      }, 2000)
    } catch (err) {
      console.error(`Error ${opinion === "approved" ? "approving" : "rejecting"} product:`, err)
      setSubmitError(
        err instanceof Error
          ? err.message
          : `Không thể ${opinion === "approved" ? "phê duyệt" : "từ chối"} sản phẩm. Vui lòng thử lại sau.`,
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
              { name: "Kiểm duyệt sản phẩm", path: "/admin/product_verification", highlighted: true },
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
              <h2 className="text-xl font-semibold">Kiểm duyệt sản phẩm</h2>
              <Button onClick={fetchProductRequests} variant="outline" size="sm" disabled={isLoading}>
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
                      Tên cửa hàng
                    </th>
                    <th className="px-6 py-3 border-b border-r text-left text-sm font-medium text-gray-500">
                      Loại sản phẩm
                    </th>
                    <th className="px-6 py-3 border-b border-r text-left text-sm font-medium text-gray-500">
                      Tên sản phẩm
                    </th>
                    <th className="px-6 py-3 border-b text-center text-sm font-medium text-gray-500">
                      Thông tin chi tiết
                    </th>
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
                  ) : productRequests.length > 0 ? (
                    productRequests.map((product, index) => (
                      <tr key={product.id || index}>
                        <td className="px-6 py-4 border-r whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.storeName}
                        </td>
                        <td className="px-6 py-4 border-r whitespace-nowrap text-sm text-gray-500">
                          {product.productType}
                        </td>
                        <td className="px-6 py-4 border-r whitespace-nowrap text-sm text-gray-500">
                          {product.productName}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewDetails(product.id)}
                            className="text-blue-600 hover:underline"
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Không có sản phẩm nào cần duyệt
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
                <h3 className="text-xl font-semibold">Thông tin chi tiết sản phẩm</h3>
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
              ) : productDetails ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium mb-4">Thông tin cơ bản</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 border-b pb-2">
                          <span className="font-medium text-gray-600">Tên sản phẩm:</span>
                          <span className="col-span-2">{productDetails.productName}</span>
                        </div>
                        <div className="grid grid-cols-3 border-b pb-2">
                          <span className="font-medium text-gray-600">Loại sản phẩm:</span>
                          <span className="col-span-2">{productDetails.productType}</span>
                        </div>
                        <div className="grid grid-cols-3 border-b pb-2">
                          <span className="font-medium text-gray-600">Cửa hàng:</span>
                          <span className="col-span-2">{productDetails.storeName}</span>
                        </div>
                        <div className="grid grid-cols-3 border-b pb-2">
                          <span className="font-medium text-gray-600">Giá bán:</span>
                          <span className="col-span-2">{productDetails.price}</span>
                        </div>
                        <div className="grid grid-cols-3 border-b pb-2">
                          <span className="font-medium text-gray-600">Số lượng:</span>
                          <span className="col-span-2">{productDetails.stock}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-4">Hình ảnh sản phẩm</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {productDetails.images.map((image, index) => (
                          <div key={index} className="border rounded p-2">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`${productDetails.productName} - ${index + 1}`}
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">Mô tả sản phẩm</h4>
                    <p className="text-gray-700 p-3 bg-gray-50 rounded">{productDetails.description}</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">Thông số kỹ thuật</h4>
                    <div className="bg-gray-50 rounded p-3">
                      <table className="min-w-full">
                        <tbody>
                          {Object.entries(productDetails.specifications).map(([key, value], index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                              <td className="py-2 px-3 font-medium">{key}</td>
                              <td className="py-2 px-3">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-3 border-b pb-2">
                      <span className="font-medium text-gray-600">Ngày tạo:</span>
                      <span className="col-span-2">{productDetails.createdDate}</span>
                    </div>
                    {productDetails.modifiedDate && (
                      <div className="grid grid-cols-3 border-b pb-2">
                        <span className="font-medium text-gray-600">Ngày cập nhật:</span>
                        <span className="col-span-2">{productDetails.modifiedDate}</span>
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
                      <h4 className="text-lg font-medium mb-3 text-red-600">Từ chối sản phẩm</h4>
                      <p className="text-sm text-gray-600 mb-3">Vui lòng nhập lý do từ chối sản phẩm này:</p>
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
                      <h4 className="text-lg font-medium mb-3 text-green-600">Phê duyệt sản phẩm</h4>
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


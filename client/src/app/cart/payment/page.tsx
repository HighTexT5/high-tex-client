"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, Truck, Wallet, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ShippingInfo {
  recipientName: string
  recipientPhone: string
  province: string
  district: string
  ward: string
  address: string
  notes?: string
  totalAmount: number
  addressCode: string
}

export default function PaymentPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [isLoading, setIsLoading] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null)

  // States for order result
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderResponse, setOrderResponse] = useState<any>(null)

  useEffect(() => {
    // Get shipping info from localStorage
    const storedInfo = localStorage.getItem("shippingInfo")
    if (storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo)
        setShippingInfo(parsedInfo)
      } catch (error) {
        console.error("Error parsing shipping info:", error)
        router.push("/cart/payment-info")
      }
    } else {
      // No shipping info found, redirect back to shipping page
      router.push("/cart/payment-info")
    }
  }, [router])

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ"
  }

  const getFullAddress = () => {
    if (!shippingInfo) return ""

    const { address, ward, district, province } = shippingInfo
    return `${address}, ${ward}, ${district}, ${province}`
  }

  const handlePayment = async () => {
    if (!shippingInfo || !shippingInfo.addressCode) {
      setOrderError("Không tìm thấy thông tin địa chỉ giao hàng")
      return
    }

    setIsLoading(true)
    setOrderError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Vui lòng đăng nhập để tiếp tục")
      }

      // Call API to create order
      const response = await fetch("http://localhost:8080/api/order/all/create-order-from-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressCode: shippingInfo.addressCode,
          // paymentMethod: paymentMethod,
        }),
      })

      const data = await response.json()
      console.log("Order creation response:", data)

      if (!response.ok) {
        throw new Error(data.message || "Không thể tạo đơn hàng")
      }

      // Order created successfully
      setOrderResponse(data)
      setOrderSuccess(true)

      // Clear cart data
      localStorage.removeItem("cartData")
    } catch (error) {
      console.error("Error creating order:", error)
      setOrderError(error instanceof Error ? error.message : "Đã xảy ra lỗi khi tạo đơn hàng")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReturnHome = () => {
    // Clear shipping info
    localStorage.removeItem("shippingInfo")

    // Navigate to home page
    router.push("/")
  }

  if (!shippingInfo && !orderSuccess) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Đang tải...</span>
      </div>
    )
  }

  // Show order result screen if order process is complete
  if (orderSuccess || orderError) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          {orderSuccess ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Đặt hàng thành công!</h2>
              <p className="text-gray-600 mb-4">Cảm ơn bạn đã mua hàng tại HighTEx.</p>

              {orderResponse && (
                <div className="bg-gray-50 p-4 rounded-md text-left mb-6">
                  <p className="font-medium">Thông tin đơn hàng:</p>
                  <p className="text-sm mt-2">{orderResponse.message || "Đơn hàng của bạn đã được tạo thành công."}</p>
                  {orderResponse.data && orderResponse.data.orderCode && (
                    <p className="text-sm mt-1">
                      Mã đơn hàng: <span className="font-medium">{orderResponse.data.orderCode}</span>
                    </p>
                  )}
                </div>
              )}

              <Button className="bg-accent text-black border-accent w-full" onClick={handleReturnHome}>
                OK
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Đặt hàng thất bại</h2>
              <p className="text-red-600 mb-6">{orderError}</p>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setOrderError(null)
                    setOrderSuccess(false)
                  }}
                >
                  Thử lại
                </Button>
                <Button className="bg-accent text-black border-accent flex-1" onClick={handleReturnHome}>
                  Về trang chủ
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 pb-32">
      {/* Header */}
      <div className="py-4 border-b bg-white">
        <div className="container mx-auto flex items-center">
          <Link href="/cart/payment-info" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold text-center flex-1">Thanh toán</h1>
          <div className="w-5"></div> {/* For balance */}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-4">
        {/* Payment Methods */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h2 className="text-base font-semibold mb-3">Thông tin thanh toán</h2>

          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
            <div className="flex items-center space-x-2 border p-3 rounded-md">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex items-center cursor-pointer">
                <Truck className="h-5 w-5 mr-2 text-orange-500" />
                <div>
                  <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                  <div className="text-xs text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border p-3 rounded-md">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center cursor-pointer">
                <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
                <div>
                  <div className="font-medium">Thẻ tín dụng/ghi nợ</div>
                  <div className="text-xs text-gray-500">Visa, Mastercard, JCB</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border p-3 rounded-md">
              <RadioGroupItem value="ewallet" id="ewallet" />
              <Label htmlFor="ewallet" className="flex items-center cursor-pointer">
                <Wallet className="h-5 w-5 mr-2 text-green-500" />
                <div>
                  <div className="font-medium">Ví điện tử</div>
                  <div className="text-xs text-gray-500">MoMo, ZaloPay, VNPay</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Shipping Information (Read-only) */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h2 className="text-base font-semibold mb-3">Thông tin nhận hàng</h2>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm text-gray-500">Tên người nhận</div>
                <div className="font-medium">{shippingInfo?.recipientName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Số điện thoại</div>
                <div className="font-medium">{shippingInfo?.recipientPhone}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Địa chỉ nhận hàng</div>
              <div className="font-medium">{getFullAddress()}</div>
            </div>

            {shippingInfo?.notes && (
              <div>
                <div className="text-sm text-gray-500">Ghi chú</div>
                <div className="text-sm">{shippingInfo.notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Checkout Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md py-4 border-t">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">Tổng tiền</div>
            <div className="font-semibold">{formatPrice(shippingInfo?.totalAmount || 0)}</div>
          </div>
          <Button className="bg-accent text-black border-accent" onClick={handlePayment} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Đang xử lý...
              </>
            ) : (
              "Thanh toán"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}


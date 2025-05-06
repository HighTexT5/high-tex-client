"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PaymentInfoPage() {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string>("0123456789")
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [recipientName, setRecipientName] = useState("")
  const [recipientPhone, setRecipientPhone] = useState("")
  const [province, setProvince] = useState("")
  const [district, setDistrict] = useState("")
  const [ward, setWard] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")

  const [cartData, setCartData] = useState<{
    items: Array<{
      itemCode: string
      itemName: string
      quantity: number
      currentPrice: number
      thumbnailUrl: string
    }>
    totalPrice: number
  } | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)

      // In a real app, you would fetch the user's phone number from an API
      // For now, we'll use a placeholder

      // Get cart data from localStorage
      const cartDataString = localStorage.getItem("cartData")
      if (cartDataString) {
        try {
          const parsedCartData = JSON.parse(cartDataString)
          setCartData(parsedCartData)
        } catch (err) {
          console.error("Error parsing cart data from localStorage:", err)
          // Set default empty cart data
          setCartData({
            items: [],
            totalPrice: 0,
          })
        }
      } else {
        // No cart data found
        setCartData({
          items: [],
          totalPrice: 0,
        })
      }
    } else {
      // Redirect to login if not logged in
      router.push("/login")
    }
  }, [router])
  

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate form
    if (!recipientName || !recipientPhone || !province || !district || !ward || !address) {
      alert("Vui lòng điền đầy đủ thông tin nhận hàng")
      return
    }

      // Form is valid, the button click handler will handle navigation
  }

  return (
    <div className="min-h-screen bg-blue-50 pb-32">
      {/* Header */}
      <div className="py-4 border-b bg-white">
        <div className="container mx-auto flex items-center">
          <Link href="/cart" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold text-center flex-1">Thông tin thanh toán</h1>
          <div className="w-5"></div> {/* For balance */}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-4">
        <form onSubmit={handleSubmit}>
          {/* Customer Information - More compact */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h2 className="text-base font-semibold mb-2">Thông tin khách hàng</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="username" className="text-sm">
                  Tên đăng nhập
                </Label>
                <Input id="username" value={username || ""} readOnly className="bg-gray-100 h-9" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm">
                  Số điện thoại
                </Label>
                <Input id="phone" value={phoneNumber} readOnly className="bg-gray-100 h-9" />
              </div>
            </div>
          </div>

          {/* Shipping Information - More compact with 2x3 grid */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h2 className="text-base font-semibold mb-2">Thông tin nhận hàng</h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Row 1 */}
              <div>
                <Label htmlFor="recipientName" className="text-sm">
                  Tên người nhận
                </Label>
                <Input
                  id="recipientName"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="h-9"
                  required
                />
              </div>
              <div>
                <Label htmlFor="recipientPhone" className="text-sm">
                  SĐT người nhận
                </Label>
                <Input
                  id="recipientPhone"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="h-9"
                  required
                />
              </div>

              {/* Row 2 */}
              <div>
                <Label htmlFor="province" className="text-sm">
                  Tỉnh/Thành phố
                </Label>
                <Select value={province} onValueChange={setProvince} required>
                  <SelectTrigger id="province" className="h-9">
                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hanoi">Hà Nội</SelectItem>
                    <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                    <SelectItem value="danang">Đà Nẵng</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="district" className="text-sm">
                  Quận/Huyện
                </Label>
                <Select value={district} onValueChange={setDistrict} required>
                  <SelectTrigger id="district" className="h-9">
                    <SelectValue placeholder="Chọn quận/huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="district1">Quận 1</SelectItem>
                    <SelectItem value="district2">Quận 2</SelectItem>
                    <SelectItem value="district3">Quận 3</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Row 3 */}
              <div>
                <Label htmlFor="ward" className="text-sm">
                  Phường/Xã
                </Label>
                <Select value={ward} onValueChange={setWard} required>
                  <SelectTrigger id="ward" className="h-9">
                    <SelectValue placeholder="Chọn phường/xã" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ward1">Phường 1</SelectItem>
                    <SelectItem value="ward2">Phường 2</SelectItem>
                    <SelectItem value="ward3">Phường 3</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="address" className="text-sm">
                  Số nhà, tên đường
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-9"
                  required
                />
              </div>
            </div>

            {/* Notes - Full width */}
            <div className="mt-3">
              <Label htmlFor="notes" className="text-sm">
                Ghi chú khác
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                rows={2}
                className="text-sm"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Fixed Checkout Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md py-4 border-t">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">Tổng tiền</div>
            <div className="font-semibold">{cartData ? formatPrice(cartData.totalPrice) : "0đ"}</div>
          </div>
          <Button
            type="button"
            className="bg-accent text-black border-accent"
            onClick={async () => {
              try {
                setIsLoading(true)

                // Validate required fields
                if (!recipientName || !recipientPhone || !province || !district || !ward || !address) {
                  alert("Vui lòng điền đầy đủ thông tin nhận hàng")
                  setIsLoading(false)
                  return
                }

                // Fetch all user addresses
                const token = localStorage.getItem("token")
                if (!token) {
                  alert("Vui lòng đăng nhập để tiếp tục")
                  router.push("/login")
                  return
                }

                const response = await fetch("http://localhost:8080/api/receive-address/user-all-address", {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })

                if (!response.ok) {
                  throw new Error(`Failed to fetch addresses: ${response.statusText}`)
                }

                const addressesData = await response.json()
                console.log("User addresses:", addressesData)

                let addressCode = null
                let addressFound = false

                // Check if address exists in user's addresses
                if (addressesData && addressesData.data && Array.isArray(addressesData.data)) {
                  const addresses = addressesData.data

                  // Find matching address
                  const matchingAddress = addresses.find(
                    (addr) =>
                      addr.province === province &&
                      addr.district === district &&
                      addr.commune === ward &&
                      addr.detail === address &&
                      addr.phoneNumber === recipientPhone,
                  )

                  if (matchingAddress) {
                    addressCode = matchingAddress.addressCode
                    addressFound = true
                    console.log("Found matching address:", matchingAddress)
                  }
                }

                // If address not found, create new address
                if (!addressFound) {
                  console.log("Creating new address...")
                  const createResponse = await fetch("http://localhost:8080/api/receive-address/create-address", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      province,
                      district,
                      commune: ward,
                      detail: address,
                      phoneNumber: recipientPhone,
                      receiverName: recipientName,
                    }),
                  })

                  if (!createResponse.ok) {
                    throw new Error(`Failed to create address: ${createResponse.statusText}`)
                  }

                  const createData = await createResponse.json()
                  console.log("Created new address:", createData)

                  if (createData && createData.data && createData.data.addressCode) {
                    addressCode = createData.data.addressCode
                  } else {
                    throw new Error("Failed to get addressCode from created address")
                  }
                }

              // Save shipping info to localStorage
              const shippingInfo = {
                recipientName,
                recipientPhone,
                province,
                district,
                ward,
                address,
                notes,
                totalAmount: cartData ? cartData.totalPrice : 0,
                addressCode, // Include the addressCode
              }
              localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo))
              console.log("Saved shipping info with addressCode:", addressCode)

              // Navigate to payment page
              router.push("/cart/payment")
            } catch (error) {
              console.error("Error processing address:", error)
              alert(`Đã xảy ra lỗi: ${error instanceof Error ? error.message : "Không thể xử lý địa chỉ"}`)
            } finally {
              setIsLoading(false)
            }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Đang xử lý...
              </>
            ) : (
              "Tiếp tục"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}


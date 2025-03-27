"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, User, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import SellerSidebar from "@/components/seller-sidebar"

interface SmartphoneDetail {
  screenSize: string
  screenResolution: string
  os: string
  screenTechnology: string
  backCamera: string
  frontCamera: string
  nfc: boolean
  sim: string
  screenFeature: string
  compatible: string
  chipset: string
  cpu: string
  memory: string
  ram: string
  battery: string
}

interface ProductFormData {
  managerName: string
  itemName: string
  category: string
  brand: string
  productSource: string
  quantity: string
  price: string
  proof: string
  description: string
  detail: SmartphoneDetail
}

export default function AddSmartphonePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    managerName: "",
    itemName: "",
    category: "smartphone",
    brand: "",
    productSource: "",
    quantity: "",
    price: "",
    proof: "",
    description: "",
    detail: {
      screenSize: "",
      screenResolution: "",
      os: "",
      screenTechnology: "",
      backCamera: "",
      frontCamera: "",
      nfc: false,
      sim: "",
      screenFeature: "",
      compatible: "",
      chipset: "",
      cpu: "",
      memory: "",
      ram: "",
      battery: "",
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      detail: {
        ...prev.detail,
        [name]: value,
      },
    }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      detail: {
        ...prev.detail,
        [name]: checked,
      },
    }))
  }

  const handleBack = () => {
    router.push("/seller/add_product")
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Convert quantity and price to numbers for the API
      const dataToSubmit = {
        ...formData,
        quantity: Number.parseInt(formData.quantity),
        price: Number.parseFloat(formData.price),
      }

      console.log("Submitting data:", dataToSubmit)

      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8080/api/request/distributor/create-active-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(dataToSubmit),
      })

      if (!response.ok) {
        throw new Error("Failed to submit product")
      }

      const result = await response.json()
      alert("Sản phẩm đã được thêm thành công!")
      // Redirect back to product list or add product page
      router.push("/seller/products")
    } catch (error) {
      console.error("Error submitting product:", error)
      alert("Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại sau.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <SellerSidebar activePage="add_product" />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-blue-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-6">
              <button onClick={handleBack} className="mr-3">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold">Thêm sản phẩm: Smartphone</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <Label htmlFor="managerName">Tên người quản lý</Label>
                <Input
                  id="managerName"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="itemName">Tên sản phẩm</Label>
                <Input
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="brand">Thương hiệu</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="productSource">Nguồn gốc sản phẩm</Label>
                <Input
                  id="productSource"
                  name="productSource"
                  value={formData.productSource}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="quantity">Số lượng</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Giá (VNĐ)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="proof">Chứng từ</Label>
                <Input id="proof" name="proof" value={formData.proof} onChange={handleInputChange} className="mt-1" />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Mô tả sản phẩm</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-4">Thông số kỹ thuật</h3>
              </div>

              <div>
                <Label htmlFor="screenSize">Kích thước màn hình (inch)</Label>
                <Input
                  id="screenSize"
                  name="screenSize"
                  value={formData.detail.screenSize}
                  onChange={handleDetailChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="screenResolution">Độ phân giải màn hình</Label>
                <Input
                  id="screenResolution"
                  name="screenResolution"
                  value={formData.detail.screenResolution}
                  onChange={handleDetailChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="os">Hệ điều hành</Label>
                <Input id="os" name="os" value={formData.detail.os} onChange={handleDetailChange} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="screenTechnology">Công nghệ màn hình</Label>
                <Input
                  id="screenTechnology"
                  name="screenTechnology"
                  value={formData.detail.screenTechnology}
                  onChange={handleDetailChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="backCamera">Camera sau</Label>
                <Input
                  id="backCamera"
                  name="backCamera"
                  value={formData.detail.backCamera}
                  onChange={handleDetailChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="frontCamera">Camera trước</Label>
                <Input
                  id="frontCamera"
                  name="frontCamera"
                  value={formData.detail.frontCamera}
                  onChange={handleDetailChange}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="nfc"
                  checked={formData.detail.nfc}
                  onCheckedChange={(checked) => handleCheckboxChange("nfc", checked as boolean)}
                />
                <Label htmlFor="nfc">NFC</Label>
              </div>

              <div>
                <Label htmlFor="sim">SIM</Label>
                <Input id="sim" name="sim" value={formData.detail.sim} onChange={handleDetailChange} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="screenFeature">Tính năng màn hình</Label>
                <Input
                  id="screenFeature"
                  name="screenFeature"
                  value={formData.detail.screenFeature}
                  onChange={handleDetailChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="compatible">Kết nối</Label>
                <Input
                  id="compatible"
                  name="compatible"
                  value={formData.detail.compatible}
                  onChange={handleDetailChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="chipset">Chipset</Label>
                <Input
                  id="chipset"
                  name="chipset"
                  value={formData.detail.chipset}
                  onChange={handleDetailChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cpu">CPU</Label>
                <Input id="cpu" name="cpu" value={formData.detail.cpu} onChange={handleDetailChange} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="memory">Bộ nhớ trong</Label>
                <Input
                  id="memory"
                  name="memory"
                  value={formData.detail.memory}
                  onChange={handleDetailChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="ram">RAM</Label>
                <Input id="ram" name="ram" value={formData.detail.ram} onChange={handleDetailChange} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="battery">Pin</Label>
                <Input
                  id="battery"
                  name="battery"
                  value={formData.detail.battery}
                  onChange={handleDetailChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-between mt-12">
              <Button variant="outline" className="text-gray-600" onClick={handleBack}>
                Quay lại
              </Button>
              <Button className="bg-primary text-white" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Thêm sản phẩm"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"

interface CategoryProps {
  title: string
  items: {
    name: string
    path: string
  }[]
  isOpen?: boolean
  onToggle: () => void
  activePage: string
}

interface SellerSidebarProps {
  activePage: string
}

function Category({ title, items, isOpen = true, onToggle, activePage }: CategoryProps) {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center py-2 px-4 cursor-pointer hover:bg-gray-100" onClick={onToggle}>
        <span className="font-medium">{title}</span>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>
      {isOpen && (
        <div className="pl-8 py-1">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={`block py-1.5 ${activePage === item.path.split("/").pop() ? "text-primary bg-orange-100 px-2 rounded" : "hover:text-primary"}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SellerSidebar({ activePage }: SellerSidebarProps) {
  const router = useRouter()
  const [openCategories, setOpenCategories] = useState({
    orders: true,
    products: true,
    finance: true,
    customerService: true,
    distribution: true,
  })

  const toggleCategory = (category: keyof typeof openCategories) => {
    setOpenCategories({
      ...openCategories,
      [category]: !openCategories[category],
    })
  }

  const categories = [
    {
      id: "orders",
      title: "Quản lý đơn hàng",
      items: [
        { name: "Tất cả đơn hàng", path: "/seller/orders" },
        { name: "giao hàng loạt", path: "/seller/bulk_shipping" },
        { name: "đơn hủy", path: "/seller/canceled_orders" },
        { name: "trả hàng/ hoàn tiền", path: "/seller/returns" },
        { name: "cài đặt vận chuyển", path: "/seller/shipping_settings" },
      ],
    },
    {
      id: "products",
      title: "Quản lý sản phẩm",
      items: [
        { name: "Tất cả sản phẩm", path: "/seller/products" },
        { name: "thêm sản phẩm", path: "/seller/add_product" },
        { name: "sản phẩm vi phạm", path: "/seller/violated_products" },
        { name: "cài đặt sản phẩm", path: "/seller/product_settings" },
      ],
    },
    {
      id: "finance",
      title: "Tài chính",
      items: [
        { name: "Doanh thu", path: "/seller/revenue" },
        { name: "số dư TK HighTEx", path: "/seller/balance" },
        { name: "tài khoản ngân hàng", path: "/seller/bank_accounts" },
      ],
    },
    {
      id: "customerService",
      title: "Chăm sóc khách hàng",
      items: [{ name: "Hỏi-đáp", path: "/seller/qa" }],
    },
    {
      id: "distribution",
      title: "Quản lý phân phối",
      items: [
        { name: "Hồ sơ", path: "/seller/profile" },
        { name: "thiết lập", path: "/seller/settings" },
        { name: "đánh giá", path: "/seller/reviews" },
      ],
    },
  ]

  return (
    <div className="w-64 bg-white border-r">
      {categories.map((category) => (
        <Category
          key={category.id}
          title={category.title}
          items={category.items}
          isOpen={openCategories[category.id as keyof typeof openCategories]}
          onToggle={() => toggleCategory(category.id as keyof typeof openCategories)}
          activePage={activePage}
        />
      ))}
    </div>
  )
}


"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import NavDropdown from "./nav-dropdown"

// Sample data for dropdown menus
const navCategories = [
  {
    name: "Điện thoại",
    href: "#",
    items: [
      [
        { title: "Apple", href: "#", featured: true },
        { title: "iPhone 15 Pro Max", href: "#" },
        { title: "iPhone 15 Pro", href: "#" },
        { title: "iPhone 15", href: "#" },
        { title: "iPhone 14 Series", href: "#" },
      ],
      [
        { title: "Samsung", href: "#", featured: true },
        { title: "Galaxy S25 Ultra", href: "#" },
        { title: "Galaxy S25+", href: "#" },
        { title: "Galaxy S25", href: "#" },
        { title: "Galaxy Z Fold5", href: "#" },
      ],
      [
        { title: "Xiaomi", href: "#", featured: true },
        { title: "Xiaomi 14 Ultra", href: "#" },
        { title: "Xiaomi 14 Pro", href: "#" },
        { title: "Redmi Note 13", href: "#" },
      ],
      [
        { title: "Phụ kiện điện thoại", href: "#", featured: true },
        { title: "Ốp lưng", href: "#" },
        { title: "Sạc dự phòng", href: "#" },
        { title: "Cáp sạc", href: "#" },
      ],
    ],
  },
  {
    name: "Tablet",
    href: "#",
    items: [
      [
        { title: "iPad", href: "#", featured: true },
        { title: "iPad Pro", href: "#" },
        { title: "iPad Air", href: "#" },
        { title: "iPad mini", href: "#" },
      ],
      [
        { title: "Samsung", href: "#", featured: true },
        { title: "Galaxy Tab S9", href: "#" },
        { title: "Galaxy Tab A9", href: "#" },
      ],
      [
        { title: "Xiaomi", href: "#", featured: true },
        { title: "Xiaomi Pad 6", href: "#" },
        { title: "Redmi Pad", href: "#" },
      ],
      [
        { title: "Phụ kiện", href: "#", featured: true },
        { title: "Bao da, ốp lưng", href: "#" },
        { title: "Bút cảm ứng", href: "#" },
        { title: "Bàn phím", href: "#" },
      ],
    ],
  },
  {
    name: "PC",
    href: "#",
    items: [
      [
        { title: "PC Gaming", href: "#", featured: true },
        { title: "PC Văn phòng", href: "#" },
        { title: "PC Đồ họa", href: "#" },
      ],
      [
        { title: "Linh kiện", href: "#", featured: true },
        { title: "CPU", href: "#" },
        { title: "Mainboard", href: "#" },
        { title: "RAM", href: "#" },
        { title: "VGA", href: "#" },
      ],
      [
        { title: "Màn hình", href: "#", featured: true },
        { title: "Màn hình Gaming", href: "#" },
        { title: "Màn hình đồ họa", href: "#" },
      ],
      [
        { title: "Phụ kiện", href: "#", featured: true },
        { title: "Bàn phím", href: "#" },
        { title: "Chuột", href: "#" },
        { title: "Tai nghe", href: "#" },
      ],
    ],
  },
  {
    name: "Laptop",
    href: "#",
    items: [
      [
        { title: "HP", href: "#", featured: true },
        { title: "HP 245 G10", href: "#" },
        { title: "HP Pavilion", href: "#" },
        { title: "HP Envy", href: "#" },
        { title: "HP Spectre", href: "#" },
      ],
      [
        { title: "Dell", href: "#", featured: true },
        { title: "Dell XPS", href: "#" },
        { title: "Dell Inspiron", href: "#" },
        { title: "Dell Latitude", href: "#" },
      ],
      [
        { title: "Lenovo", href: "#", featured: true },
        { title: "ThinkPad", href: "#" },
        { title: "IdeaPad", href: "#" },
        { title: "Legion", href: "#" },
      ],
      [
        { title: "Phụ kiện laptop", href: "#", featured: true },
        { title: "Balo laptop", href: "#" },
        { title: "Chuột", href: "#" },
        { title: "Bàn phím", href: "#" },
      ],
    ],
  },
  {
    name: "Đồng hồ",
    href: "#",
    items: [
      [
        { title: "Đồng hồ thông minh", href: "#", featured: true },
        { title: "Apple Watch", href: "#" },
        { title: "Samsung Galaxy Watch", href: "#" },
        { title: "Garmin", href: "#" },
      ],
      [
        { title: "Đồng hồ nam", href: "#", featured: true },
        { title: "Casio", href: "#" },
        { title: "Citizen", href: "#" },
        { title: "Seiko", href: "#" },
      ],
      [
        { title: "Đồng hồ nữ", href: "#", featured: true },
        { title: "Casio", href: "#" },
        { title: "Citizen", href: "#" },
        { title: "Fossil", href: "#" },
      ],
      [
        { title: "Phụ kiện", href: "#", featured: true },
        { title: "Dây đồng hồ", href: "#" },
        { title: "Hộp đồng hồ", href: "#" },
      ],
    ],
  },
  {
    name: "Phụ kiện",
    href: "#",
    items: [
      [
        { title: "Tai nghe", href: "#", featured: true },
        { title: "Tai nghe không dây", href: "#" },
        { title: "Tai nghe có dây", href: "#" },
        { title: "Tai nghe gaming", href: "#" },
      ],
      [
        { title: "Loa", href: "#", featured: true },
        { title: "Loa bluetooth", href: "#" },
        { title: "Loa di động", href: "#" },
        { title: "Loa karaoke", href: "#" },
      ],
      [
        { title: "Thiết bị mạng", href: "#", featured: true },
        { title: "Router", href: "#" },
        { title: "Bộ kích sóng", href: "#" },
      ],
      [
        { title: "Phụ kiện khác", href: "#", featured: true },
        { title: "Bàn phím", href: "#" },
        { title: "Chuột", href: "#" },
        { title: "Webcam", href: "#" },
      ],
    ],
  },
  {
    name: "Tivi",
    href: "#",
    items: [
      [
        { title: "Samsung", href: "#", featured: true },
        { title: "QLED 4K", href: "#" },
        { title: "Crystal UHD", href: "#" },
      ],
      [
        { title: "LG", href: "#", featured: true },
        { title: "OLED", href: "#" },
        { title: "NanoCell", href: "#" },
      ],
      [
        { title: "Sony", href: "#", featured: true },
        { title: "Android TV", href: "#" },
        { title: "Google TV", href: "#" },
      ],
      [
        { title: "Phụ kiện", href: "#", featured: true },
        { title: "Giá treo tivi", href: "#" },
        { title: "Loa soundbar", href: "#" },
      ],
    ],
  },
  {
    name: "Khuyến mãi",
    href: "#",
    items: [
      [
        { title: "Flash Sale", href: "#", featured: true },
        { title: "Deal Sốc", href: "#" },
        { title: "Siêu Sale", href: "#" },
      ],
      [
        { title: "Khuyến mãi theo danh mục", href: "#", featured: true },
        { title: "Điện thoại", href: "#" },
        { title: "Laptop", href: "#" },
        { title: "Phụ kiện", href: "#" },
      ],
      [
        { title: "Ưu đãi thanh toán", href: "#", featured: true },
        { title: "Thẻ tín dụng", href: "#" },
        { title: "Ví điện tử", href: "#" },
      ],
      [
        { title: "Chương trình thành viên", href: "#", featured: true },
        { title: "Tích điểm", href: "#" },
        { title: "Đổi quà", href: "#" },
      ],
    ],
  },
  {
    name: "Dịch vụ khác",
    href: "#",
    items: [
      [
        { title: "Bảo hành", href: "#", featured: true },
        { title: "Chính sách bảo hành", href: "#" },
        { title: "Tra cứu bảo hành", href: "#" },
      ],
      [
        { title: "Sửa chữa", href: "#", featured: true },
        { title: "Điện thoại", href: "#" },
        { title: "Laptop", href: "#" },
      ],
      [
        { title: "Trả góp", href: "#", featured: true },
        { title: "Thủ tục trả góp", href: "#" },
        { title: "Đối tác trả góp", href: "#" },
      ],
      [
        { title: "Khác", href: "#", featured: true },
        { title: "Tư vấn mua hàng", href: "#" },
        { title: "Giao hàng", href: "#" },
      ],
    ],
  },
]

export default function Navbar() {
  const pathname = usePathname()

  // Don't render navbar on seller or admin pages
  if (pathname.startsWith("/seller") || pathname.startsWith("/admin")) {
    return null
  }

  return (
    <nav className="bg-secondary text-black relative z-10 w-full">
      <div className="flex w-full">
        {navCategories.map((category, index) => (
          <div key={index} className="group static">
            <Link
              href={category.href}
              className="block px-4 py-3 hover:text-[#2962FF] hover:underline transition-colors"
            >
              {category.name}
            </Link>
            {category.items && (
              <div className="absolute inset-x-0 left-0 w-full hidden group-hover:block">
                <NavDropdown items={category.items} />
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}


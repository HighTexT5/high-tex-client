import { Search, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProductCard from "@/components/product-card"
import PhoneCard from "@/components/phone-card"
import PaymentMethods from "@/components/payment-methods"

export default function Home() {
  const laptopProducts = Array(5).fill({
    name: "HP 245 G10 R5 7530U (A20TDPT)",
    originalPrice: "14.590.000đ",
    discountPrice: "12.890.000đ",
    discount: "11%",
    finalPrice: "Quà 2.540.000đ",
    rating: "4.9",
    sold: "3,5k",
    image: "/placeholder.svg?height=150&width=150",
  })

  const phoneProducts = Array(5).fill({
    name: "Samsung Galaxy S25 Ultra 12GB 1TB",
    price: "41.490.000 đ",
    rating: "5",
    image: "/placeholder.svg?height=150&width=150",
  })

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center mr-8">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mr-2">
              <span className="text-accent-yellow font-bold text-xl">?</span>
            </div>
            <span className="text-dark-blue text-2xl font-bold">HighTEx</span>
          </div>

          <Button variant="outline" className="mr-2 bg-white border-gray-300 text-black text-sm h-9">
            Kênh người bán
          </Button>
        </div>

        <div className="flex-1 max-w-md mx-4 relative">
          <Input placeholder="Value" className="pr-10 border-gray-300" />
          <div className="absolute right-0 top-0 h-full flex items-center pr-3">
            <span className="text-gray-400 cursor-pointer">×</span>
          </div>
          <Button className="absolute right-0 top-0 h-full bg-white border-l border-gray-300" variant="ghost">
            <Search className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        <div className="flex items-center">
          <Button variant="outline" className="mr-2 bg-accent text-black border-accent h-9">
            Tra cứu đơn hàng
          </Button>
          <Button variant="outline" className="mr-2 bg-accent text-black border-accent h-9 w-9 p-0">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="bg-accent text-black border-accent h-9">
            Đăng nhập
          </Button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-primary text-white p-3">
        <div className="container mx-auto flex space-x-8">
          <a href="#" className="hover:underline">
            Narbar
          </a>
          <a href="#" className="hover:underline">
            Phone
          </a>
          <a href="#" className="hover:underline">
            Laptop
          </a>
          <a href="#" className="hover:underline">
            Accessory
          </a>
          <a href="#" className="hover:underline">
            Smartwatch
          </a>
          <a href="#" className="hover:underline">
            Watch
          </a>
          <a href="#" className="hover:underline">
            Tablet
          </a>
        </div>
      </nav>

      {/* Advertisement */}
      <section className="bg-secondary py-10 px-4 my-4 mx-4 rounded-lg">
        <div className="text-center text-gray-600">Quảng cáo</div>
      </section>

      {/* Discount Products */}
      <section className="bg-secondary p-4 my-4 mx-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Discount</h2>
        <div className="relative">
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {laptopProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Phone Products */}
      <section className="bg-phone-bg p-4 my-4 mx-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Phone</h2>
        <div className="relative">
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {phoneProducts.map((product, index) => (
              <PhoneCard key={index} product={product} />
            ))}
          </div>
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Laptop Products */}
      <section className="bg-secondary p-4 my-4 mx-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Laptop</h2>
        <div className="relative">
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {laptopProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 p-6 mt-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-3">Dịch vụ khách hàng</h3>
            {/* Footer links would go here */}
          </div>
          <div>
            <h3 className="font-semibold mb-3">HighTex Việt Nam</h3>
            {/* Footer links would go here */}
          </div>
          <div>
            <h3 className="font-semibold mb-3">Thanh toán</h3>
            <PaymentMethods />
          </div>
          <div>
            <h3 className="font-semibold mb-3">Vận chuyển</h3>
            {/* Footer links would go here */}
          </div>
        </div>
      </footer>
    </main>
  )
}


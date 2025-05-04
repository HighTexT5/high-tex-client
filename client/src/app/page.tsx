import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"
import PaymentMethods from "@/components/payment-methods"
import PhoneProductsSection from "@/components/phone-products-section"

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
      {/* Advertisement */}
      {/* <section className="bg-secondary py-10 px-4 my-4 mx-4 rounded-lg">
        <div className="text-center text-gray-600">Quảng cáo</div>
      </section> */}

      {/* Discount Products */}
      <section className="bg-secondary p-4 my-4 mx-auto max-w-5xl rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Discount</h2>
        <div className="relative">
          <div className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-hide">
            {laptopProducts.map((product, index) => (
              <div
                key={index}
                className="min-w-[100%] sm:min-w-[50%] md:min-w-[33.333%] lg:min-w-[25%] xl:min-w-[20%] flex-shrink-0 snap-start px-1"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10">
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10">
            <ChevronRight className="h-6 w-6" />
          </button>

        </div>
      </section>

      {/* Phone Products */}
      <section className="bg-phone-bg p-4 my-4 mx-auto max-w-5xl rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Phone</h2>
        <div className="relative">
          <div className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-hide">
            <div className="flex w-full">
              {/* PhoneProductsSection will be modified to match this layout */}
              <PhoneProductsSection />
            </div>
          </div>
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Laptop Products */}
      <section className="bg-secondary p-4 my-4 mx-auto max-w-5xl rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Laptop</h2>
        <div className="relative">
          <div className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-hide">
            <div className="flex w-full">
              {laptopProducts.map((product, index) => (
                <div
                  key={index}
                  className="min-w-[100%] sm:min-w-[50%] md:min-w-[33.333%] lg:min-w-[25%] xl:min-w-[20%] flex-shrink-0 snap-start px-1"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
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


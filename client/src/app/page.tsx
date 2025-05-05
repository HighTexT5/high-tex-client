"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"
import PaymentMethods from "@/components/payment-methods"
import PhoneCard from "@/components/phone-card" // Import PhoneCard
import PhoneProductsSection from "@/components/phone-products-section"

// Add custom styles to hide scrollbars while maintaining scroll functionality
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

export default function Home() {
  const discountScrollRef = useRef<HTMLDivElement>(null)
  // const phoneScrollRef = useRef<HTMLDivElement>(null)
  const laptopScrollRef = useRef<HTMLDivElement>(null)

  const [discountScrollPosition, setDiscountScrollPosition] = useState(0)
  // const [phoneScrollPosition, setPhoneScrollPosition] = useState(0)
  const [laptopScrollPosition, setLaptopScrollPosition] = useState(0)

  const [discountMaxScroll, setDiscountMaxScroll] = useState(0)
  // const [phoneMaxScroll, setPhoneMaxScroll] = useState(0)
  const [laptopMaxScroll, setLaptopMaxScroll] = useState(0)

  const laptopProducts = [
    {
      name: "HP 245 G10 R5 7530U (A20TDPT)",
      originalPrice: "14.590.000đ",
      discountPrice: "12.890.000đ",
      discount: "11%",
      finalPrice: "Quà 2.540.000đ",
      rating: "4.9",
      sold: "3,5k",
      image: "/image/laptop/1.png",
    },
    {
      name: "Dell Inspiron 3520 i5 1235U",
      originalPrice: "16.990.000đ",
      discountPrice: "15.490.000đ",
      discount: "8%",
      finalPrice: "Quà 1.890.000đ",
      rating: "4.7",
      sold: "2,8k",
      image: "/image/laptop/2.png",
    },
    {
      name: "Lenovo IdeaPad Slim 3 i7 1255U",
      originalPrice: "19.290.000đ",
      discountPrice: "17.490.000đ",
      discount: "9%",
      finalPrice: "Quà 3.100.000đ",
      rating: "4.8",
      sold: "1,9k",
      image: "/image/laptop/3.png",
    },
    {
      name: "ASUS VivoBook 15 R5 5500U",
      originalPrice: "13.490.000đ",
      discountPrice: "11.990.000đ",
      discount: "11%",
      finalPrice: "Quà 1.750.000đ",
      rating: "4.6",
      sold: "4,2k",
      image: "/image/laptop/4.png",
    },
    {
      name: "Acer Aspire 3 i3 1215U",
      originalPrice: "12.290.000đ",
      discountPrice: "10.990.000đ",
      discount: "10%",
      finalPrice: "Quà 1.560.000đ",
      rating: "4.5",
      sold: "3,7k",
      image: "/image/laptop/5.png",
    },
    {
      name: "MacBook Air M2 13\"",
      originalPrice: "28.990.000đ",
      discountPrice: "26.490.000đ",
      discount: "8%",
      finalPrice: "Quà 4.200.000đ",
      rating: "4.9",
      sold: "1,2k",
      image: "/image/laptop/6.png",
    },
    {
      name: "MSI Modern 14 i5 1235U",
      originalPrice: "15.990.000đ",
      discountPrice: "14.290.000đ",
      discount: "10%",
      finalPrice: "Quà 2.100.000đ",
      rating: "4.7",
      sold: "950",
      image: "/image/laptop/7.png",
    },
    {
      name: "HP Pavilion 15 R7 5825U",
      originalPrice: "17.590.000đ",
      discountPrice: "15.990.000đ",
      discount: "9%",
      finalPrice: "Quà 2.750.000đ",
      rating: "4.8",
      sold: "1,8k",
      image: "/image/laptop/8.png",
    },
    {
      name: "Lenovo ThinkPad E14 i5 1240P",
      originalPrice: "21.290.000đ",
      discountPrice: "19.490.000đ",
      discount: "8%",
      finalPrice: "Quà 3.450.000đ",
      rating: "4.9",
      sold: "860",
      image: "/image/laptop/9.png",
    },
    {
      name: "Dell XPS 13 i7 1260P",
      originalPrice: "34.990.000đ",
      discountPrice: "31.990.000đ",
      discount: "8%",
      finalPrice: "Quà 5.200.000đ",
      rating: "5.0",
      sold: "420",
      image: "/image/laptop/10.png",
    }
  ];

  const phoneProducts = Array(10).fill({
    name: "Samsung Galaxy S25 Ultra 12GB 1TB",
    price: "41.490.000 đ",
    rating: "5",
    image: "/placeholder.svg?height=150&width=150",
  })

  // Calculate item width based on viewport - now returns fixed width
  const getItemWidth = () => {
    return 184 + 16 // Item width (184px) + spacing (16px)
  }

  // Scroll one item left or right
  const scrollOneItem = (
    direction: "left" | "right",
    scrollRef: React.RefObject<HTMLDivElement>,
    setScrollPosition: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    if (!scrollRef.current) return

    const containerWidth = scrollRef.current.clientWidth
    const itemWidth = getItemWidth()
    const scrollAmount = direction === "left" ? -itemWidth : itemWidth

    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  // Update scroll positions and max scroll values
  useEffect(() => {
    const updateScrollInfo = () => {
      if (discountScrollRef.current) {
        setDiscountScrollPosition(discountScrollRef.current.scrollLeft)
        setDiscountMaxScroll(discountScrollRef.current.scrollWidth - discountScrollRef.current.clientWidth)
      }

      // if (phoneScrollRef.current) {
      //   setPhoneScrollPosition(phoneScrollRef.current.scrollLeft)
      //   setPhoneMaxScroll(phoneScrollRef.current.scrollWidth - phoneScrollRef.current.clientWidth)
      // }

      if (laptopScrollRef.current) {
        setLaptopScrollPosition(laptopScrollRef.current.scrollLeft)
        setLaptopMaxScroll(laptopScrollRef.current.scrollWidth - laptopScrollRef.current.clientWidth)
      }
    }

    // Initial update
    updateScrollInfo()

    // Add scroll event listeners
    discountScrollRef.current?.addEventListener("scroll", updateScrollInfo)
    // phoneScrollRef.current?.addEventListener("scroll", updateScrollInfo)
    laptopScrollRef.current?.addEventListener("scroll", updateScrollInfo)

    // Add resize event listener
    window.addEventListener("resize", updateScrollInfo)

    return () => {
      // Clean up event listeners
      discountScrollRef.current?.removeEventListener("scroll", updateScrollInfo)
      // phoneScrollRef.current?.removeEventListener("scroll", updateScrollInfo)
      laptopScrollRef.current?.removeEventListener("scroll", updateScrollInfo)
      window.removeEventListener("resize", updateScrollInfo)
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <main className="min-h-screen">
        <div className="w-[1024px] mx-auto lg:ml-[calc(50%-512px)] lg:mr-auto">

          {/* Discount Products */}
          <section className="bg-secondary p-4 my-4 mx-auto w-[1024px] rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Chương trình ưu đãi</h2>
            <div className="relative">
              <div
                ref={discountScrollRef}
                className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-hide"
              >
                {laptopProducts.map((product, index) => (
                  <div key={index} className="min-w-[184px] w-[184px] flex-shrink-0 snap-start">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <button
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 ${discountScrollPosition <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                onClick={() => scrollOneItem("left", discountScrollRef, setDiscountScrollPosition)}
                disabled={discountScrollPosition <= 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 ${discountScrollPosition >= discountMaxScroll ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                onClick={() => scrollOneItem("right", discountScrollRef, setDiscountScrollPosition)}
                disabled={discountScrollPosition >= discountMaxScroll}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </section>

          {/* Phone Products */}
          <section className="bg-phone-bg p-4 my-4 mx-auto w-[1024px] rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Điện thoại</h2>
            <PhoneProductsSection />
            {/* <div className="relative">
              <div
                ref={phoneScrollRef}
                className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-hide"
              >
                {phoneProducts.map((product, index) => (
                  <div key={index} className="min-w-[184px] w-[184px] flex-shrink-0 snap-start">
                    <PhoneCard
                      product={{
                        name: product.name,
                        price: product.price,
                        rating: product.rating,
                        image: product.image,
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 ${phoneScrollPosition <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                onClick={() => scrollOneItem("left", phoneScrollRef, setPhoneScrollPosition)}
                disabled={phoneScrollPosition <= 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 ${phoneScrollPosition >= phoneMaxScroll ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                onClick={() => scrollOneItem("right", phoneScrollRef, setPhoneScrollPosition)}
                disabled={phoneScrollPosition >= phoneMaxScroll}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div> */}
          </section>

          {/* Laptop Products */}
          <section className="bg-secondary p-4 my-4 mx-auto w-[1024px] rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Laptop</h2>
            <div className="relative">
              <div
                ref={laptopScrollRef}
                className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-hide"
              >
                {laptopProducts.map((product, index) => (
                  <div key={index} className="min-w-[184px] w-[184px] flex-shrink-0 snap-start">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <button
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 ${laptopScrollPosition <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                onClick={() => scrollOneItem("left", laptopScrollRef, setLaptopScrollPosition)}
                disabled={laptopScrollPosition <= 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 ${laptopScrollPosition >= laptopMaxScroll ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                onClick={() => scrollOneItem("right", laptopScrollRef, setLaptopScrollPosition)}
                disabled={laptopScrollPosition >= laptopMaxScroll}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-200 p-6 mt-8 w-[1024px] mx-auto">
            <div className="grid grid-cols-4 gap-8">
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
        </div>
      </main>
    </>
  )
}

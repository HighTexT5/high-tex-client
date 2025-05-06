import Image from "next/image"

interface ProductProps {
  product: {
    name: string
    originalPrice: string
    discountPrice: string
    discount: string
    finalPrice: string
    rating: string
    sold: string
    image: string
  }
}

export default function ProductCard({ product }: ProductProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm w-[190px] h-[320px] overflow-hidden">
      <div className="p-4 ">
        <div className="flex justify-center mb-2">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        <div className="text-xs text-gray-500 mb-1">
          <div className="flex items-center justify-between">
            <span>1.36 kg</span>
            <span>Ryzen 5 7530U</span>
          </div>
          <div className="flex items-center justify-between">
            <span>8GB</span>
            <span>Radeon Graphics</span>
          </div>
        </div>

        <h3 className="text-sm font-medium line-clamp-2 h-10">{product.name}</h3>

        <div className="mt-2">
          <div className="text-sm font-semibold">{product.discountPrice}</div>
          <div className="flex items-center text-xs">
            <span className="line-through text-gray-500">{product.originalPrice}</span>
            <span className="ml-2 text-red-500">-{product.discount}</span>
          </div>
          <div className="text-xs text-blue-600 mt-1">{product.finalPrice}</div>

          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <span className="text-xs">{product.rating}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-yellow-400 fill-yellow-400 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex items-center ml-2 text-xs text-gray-500">• Đã bán {product.sold}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


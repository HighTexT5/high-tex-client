import Image from "next/image"

interface PhoneProps {
  product: {
    name: string
    price: string
    rating: string
    image: string
  }
}

export default function PhoneCard({ product }: PhoneProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm min-w-[220px] max-w-[220px] overflow-hidden">
      <div className="p-4">
        <div className="flex justify-center mb-4">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        <h3 className="text-sm font-medium line-clamp-2 h-10">{product.name}</h3>

        <div className="mt-2">
          <div className="text-sm font-semibold">{product.price}</div>

          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <span className="text-xs">{product.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


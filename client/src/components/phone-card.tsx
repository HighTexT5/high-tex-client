"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

interface PhoneProps {
  product: {
    name: string
    price: string
    rating: string
    image: string
    id?: number | string
  }
}

export default function PhoneCard({ product }: PhoneProps) {
  const router = useRouter()

  // Function to handle click on the phone card
  const handlePhoneClick = () => {
    // Create a URL-friendly version of the product name
    const nameSlug = product.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")

    // Navigate to the product detail page
    // If product has an ID, use it as a query parameter
    if (product.id) {
      router.push(`/smartphone/${nameSlug}?id=${product.id}`)
    } else {
      router.push(`/smartphone/${nameSlug}`)
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm min-w-[220px] max-w-[220px] overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handlePhoneClick}
    >
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


import Image from "next/image"

export default function PaymentMethods() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-white p-2 rounded border flex items-center justify-center">
        <Image src="/placeholder.svg?height=30&width=50" alt="Visa" width={50} height={30} className="object-contain" />
      </div>
      <div className="bg-white p-2 rounded border flex items-center justify-center">
        <Image
          src="/placeholder.svg?height=30&width=50"
          alt="Mastercard"
          width={50}
          height={30}
          className="object-contain"
        />
      </div>
      <div className="bg-white p-2 rounded border flex items-center justify-center">
        <Image src="/placeholder.svg?height=30&width=50" alt="JCB" width={50} height={30} className="object-contain" />
      </div>
      <div className="bg-white p-2 rounded border flex items-center justify-center">
        <Image
          src="/placeholder.svg?height=30&width=50"
          alt="Cash on Delivery"
          width={50}
          height={30}
          className="object-contain"
        />
      </div>
      <div className="bg-white p-2 rounded border flex items-center justify-center">
        <Image
          src="/placeholder.svg?height=30&width=50"
          alt="Napas"
          width={50}
          height={30}
          className="object-contain"
        />
      </div>
      <div className="bg-white p-2 rounded border flex items-center justify-center">
        <Image src="/placeholder.svg?height=30&width=50" alt="MoMo" width={50} height={30} className="object-contain" />
      </div>
    </div>
  )
}


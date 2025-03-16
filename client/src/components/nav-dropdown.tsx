import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavDropdownProps {
  items: {
    title: string
    href: string
    featured?: boolean
  }[][]
  className?: string
}

export default function NavDropdown({ items, className }: NavDropdownProps) {
  return (
    <div className={cn("absolute left-0 top-full z-50 hidden w-full bg-white shadow-lg group-hover:block", className)}>
      <div className="container mx-auto grid grid-cols-4 gap-6 p-6">
        {items.map((column, colIndex) => (
          <div key={colIndex} className="space-y-3">
            {column.map((item, itemIndex) => (
              <Link
                key={itemIndex}
                href={item.href}
                className={cn(
                  "block text-sm hover:text-primary transition-colors",
                  item.featured && "font-semibold text-primary",
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}


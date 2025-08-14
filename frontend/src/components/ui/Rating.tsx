"use client"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  readonly?: boolean
  onChange?: (rating: number) => void
  className?: string
}

export const Rating = ({ value, max = 5, size = "md", readonly = true, onChange, className }: RatingProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating)
    }
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= value
        const isHalfFilled = starValue - 0.5 <= value && starValue > value

        return (
          <button
            key={index}
            type="button"
            className={cn(
              "focus:outline-none",
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform",
            )}
            onClick={() => handleClick(starValue)}
            disabled={readonly}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled || isHalfFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200 hover:fill-yellow-200 hover:text-yellow-200",
              )}
            />
          </button>
        )
      })}
      <span className="text-sm text-gray-600 ml-2">({value.toFixed(1)})</span>
    </div>
  )
}

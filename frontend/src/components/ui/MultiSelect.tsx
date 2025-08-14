"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, X } from "lucide-react"

interface Option {
  value: string
  label: string
  disabled?: boolean
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  label?: string
  error?: string
  className?: string
  maxHeight?: string
}

export const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  label,
  error,
  className,
  maxHeight = "200px",
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectedOptions = options.filter((option) => value.includes(option.value))

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue]
    onChange(newValue)
  }

  const removeOption = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue))
  }

  const clearAll = () => {
    onChange([])
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        <div
          className={cn(
            "flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            error && "border-destructive",
            "cursor-pointer",
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-xs"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeOption(option.value)
                    }}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedOptions.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  clearAll()
                }}
                className="hover:bg-muted rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="max-h-60 overflow-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-accent",
                      option.disabled && "cursor-not-allowed opacity-50",
                      value.includes(option.value) && "bg-accent",
                    )}
                    onClick={() => !option.disabled && toggleOption(option.value)}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border",
                        value.includes(option.value)
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-input",
                      )}
                    >
                      {value.includes(option.value) && <Check className="h-3 w-3" />}
                    </div>
                    <span>{option.label}</span>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">No options found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

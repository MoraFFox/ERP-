"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { cn } from "@/lib/utils"
import { Upload, X, File, ImageIcon } from "lucide-react"
import { Button } from "./Button"

interface FileUploadProps {
  label?: string
  error?: string
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in MB
  onFilesChange: (files: File[]) => void
  className?: string
}

export const FileUpload = ({
  label,
  error,
  accept = "image/*,video/*",
  multiple = true,
  maxFiles = 5,
  maxSize = 10,
  onFilesChange,
  className,
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return

      const fileArray = Array.from(newFiles)
      const validFiles = fileArray.filter((file) => {
        if (file.size > maxSize * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
          return false
        }
        return true
      })

      const totalFiles = multiple ? [...files, ...validFiles].slice(0, maxFiles) : validFiles.slice(0, 1)
      setFiles(totalFiles)
      onFilesChange(totalFiles)
    },
    [files, multiple, maxFiles, maxSize, onFilesChange],
  )

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesChange(newFiles)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const isImage = (file: File) => file.type.startsWith("image/")

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400",
          error && "border-destructive",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept.includes("image") && "Images"} {accept.includes("video") && "& Videos"} up to {maxSize}MB each
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-2">
                {isImage(file) ? (
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                ) : (
                  <File className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

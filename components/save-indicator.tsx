"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Save, Clock, Check, Loader2, Minimize2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface SaveIndicatorProps {
  onSave: () => Promise<void>
  hasUnsavedChanges: boolean
}

export function SaveIndicator({ onSave, hasUnsavedChanges }: SaveIndicatorProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const indicatorRef = useRef<HTMLDivElement>(null)

  // Load saved position and minimized state
  useEffect(() => {
    const savedPosition = localStorage.getItem("save-indicator-position")
    const savedMinimized = localStorage.getItem("save-indicator-minimized")

    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition))
      } catch (error) {
        console.error("Error loading saved position:", error)
      }
    }

    if (savedMinimized) {
      setIsMinimized(savedMinimized === "true")
    }
  }, [])

  // Save position when it changes
  useEffect(() => {
    localStorage.setItem("save-indicator-position", JSON.stringify(position))
  }, [position])

  // Save minimized state when it changes
  useEffect(() => {
    localStorage.setItem("save-indicator-minimized", isMinimized.toString())
  }, [isMinimized])

  // Auto-save countdown
  useEffect(() => {
    if (!hasUnsavedChanges) {
      setCountdown(30)
      return
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleSave()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [hasUnsavedChanges])

  const handleSave = async () => {
    if (isSaving) return

    setIsSaving(true)
    try {
      await onSave()
      setLastSaved(new Date())
      setCountdown(30)
    } catch (error) {
      console.error("Error saving:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!indicatorRef.current) return

    const rect = indicatorRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y

    // Keep within viewport bounds
    const maxX = window.innerWidth - (isMinimized ? 60 : 280)
    const maxY = window.innerHeight - (isMinimized ? 60 : 120)

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  const getStatusColor = () => {
    if (isSaving) return "border-yellow-400 bg-yellow-50"
    if (hasUnsavedChanges) return "border-orange-400 bg-orange-50"
    return "border-green-400 bg-green-50"
  }

  const getStatusIcon = () => {
    if (isSaving) return <Loader2 className="w-4 h-4 text-yellow-600 animate-spin" />
    if (hasUnsavedChanges) return <Clock className="w-4 h-4 text-orange-600" />
    return <Check className="w-4 h-4 text-green-600" />
  }

  const getStatusText = () => {
    if (isSaving) return "Salvando..."
    if (hasUnsavedChanges) return `Auto-save em ${countdown}s`
    return "Tudo sincronizado"
  }

  if (isMinimized) {
    return (
      <div
        ref={indicatorRef}
        className={cn(
          "fixed z-50 w-14 h-14 rounded-full shadow-lg border-2 cursor-move",
          getStatusColor(),
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleMouseDown}
      >
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-full rounded-full p-0 hover:bg-transparent"
          onClick={() => setIsMinimized(false)}
        >
          <div className="relative">
            {getStatusIcon()}
            {hasUnsavedChanges && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                {countdown}
              </div>
            )}
          </div>
        </Button>
      </div>
    )
  }

  return (
    <div
      ref={indicatorRef}
      className={cn(
        "fixed z-50 w-70 bg-white rounded-lg shadow-lg border-2 overflow-hidden",
        getStatusColor(),
        isDragging ? "cursor-grabbing" : "",
      )}
      style={{ left: position.x, top: position.y }}
    >
      {/* Drag Handle */}
      <div
        className="flex items-center justify-between p-2 bg-gray-50 border-b cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-600">Save Status</span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsMinimized(true)}>
          <Minimize2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-center space-x-2 mb-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
        </div>

        {hasUnsavedChanges && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Auto-save progress</span>
              <span>{countdown}s</span>
            </div>
            <Progress value={((30 - countdown) / 30) * 100} className="h-1" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {lastSaved ? `Salvo: ${lastSaved.toLocaleTimeString()}` : "Não salvo"}
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-3 h-3 mr-1" />
            Salvar Agora
          </Button>
        </div>
      </div>
    </div>
  )
}

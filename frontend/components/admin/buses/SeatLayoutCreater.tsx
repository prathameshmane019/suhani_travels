"use client" 
import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Save, Eye } from "lucide-react"
import type { SeatLayout, SeatPosition } from "@/types"
import { toast } from "sonner"

interface SeatLayoutCreatorProps {
  onSave: (layout: SeatLayout) => void
  initialLayout?: SeatLayout
  className?: string
}

export function SeatLayoutCreator({ onSave, initialLayout, className }: SeatLayoutCreatorProps) {
  const [layoutName, setLayoutName] = useState(initialLayout?.name || "")
  const [rows, setRows] = useState(initialLayout?.rows || 10)
  const [columns, setColumns] = useState(initialLayout?.columns || 4)
  const [seats, setSeats] = useState<SeatPosition[]>(initialLayout?.seats || [])
  const [selectedTool, setSelectedTool] = useState<"regular" | "premium" | "disabled" | "empty" | "eraser">("regular")
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const handleCellClick = useCallback(
    (row: number, column: number, event: React.MouseEvent) => {
      event.stopPropagation()

      if (isPreviewMode) return

      const existingSeatIndex = seats.findIndex((seat) => seat.row === row && seat.column === column)

      if (selectedTool === "eraser") {
        if (existingSeatIndex !== -1) {
          setSeats((prev) => prev.filter((_, index) => index !== existingSeatIndex))
        }
        return
      }

      // Determine the next sequential seat ID
      let nextSeatId: string;
      if (existingSeatIndex === -1) { // Only generate new ID if adding a new seat
        const maxSeatNumber = seats.reduce((max, seat) => {
          const seatNum = parseInt(seat.id);
          return !isNaN(seatNum) ? Math.max(max, seatNum) : max;
        }, 0);
        nextSeatId = (maxSeatNumber + 1).toString();
      } else {
        nextSeatId = seats[existingSeatIndex].id; // Keep existing ID if editing
      }

      const newSeat: SeatPosition = {
        id: nextSeatId,
        row,
        column,
        type: selectedTool,
      }

      if (existingSeatIndex !== -1) {
        setSeats((prev) => prev.map((seat, index) => (index === existingSeatIndex ? newSeat : seat)))
      } else {
        setSeats((prev) => [...prev, newSeat])
      }
    },
    [selectedTool, seats, isPreviewMode],
  )

  const getSeatAtPosition = (row: number, column: number): SeatPosition | null => {
    return seats.find((seat) => seat.row === row && seat.column === column) || null
  }

  const getSeatColor = (seatType: string) => {
    switch (seatType) {
      case "regular":
        return "bg-green-500 hover:bg-green-600 text-white"
      case "premium":
        return "bg-blue-500 hover:bg-blue-600 text-white"
      case "disabled":
        return "bg-gray-400 text-gray-700 cursor-not-allowed"
      case "empty":
        return "bg-transparent border-2 border-dashed border-gray-300"
      default:
        return "bg-gray-200 hover:bg-gray-300"
    }
  }

  const clearLayout = (event: React.MouseEvent) => {
    event.stopPropagation()
    setSeats([])
    toast.success("Layout cleared")
  }

  const generateStandardLayout = (event: React.MouseEvent) => {
    event.stopPropagation()
    const newSeats: SeatPosition[] = []
    let currentSeatNumber = 1

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        // Skip middle columns for aisle in 2+2 layout
        if (columns === 4 && (col === 1 || col === 2)) {
          if (col === 1) {
            newSeats.push({
              id: `Aisle-${row}-${col}`,
              row,
              column: col,
              type: "empty",
            })
          }
          continue
        }

        newSeats.push({
          id: currentSeatNumber.toString(),
          row,
          column: col,
          type: "regular", 
        })
        currentSeatNumber++
      }
    }

    setSeats(newSeats)
    toast.success("Standard layout generated")
  }

  const handleSave = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (!layoutName.trim()) {
      toast.error("Please enter a layout name")
      return
    }

    const regularSeats = seats.filter((seat) => seat.type !== "empty")

    const layout: SeatLayout = {
      id: initialLayout?.id || `layout-${Date.now()}`,
      name: layoutName,
      rows,
      columns,
      seats,
      totalSeats: regularSeats.length,
    }

    onSave(layout)
    toast.success("Layout saved successfully")
  }

  const togglePreviewMode = (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsPreviewMode(!isPreviewMode)
  }

  const handleToolSelect = (tool: "regular" | "premium" | "disabled" | "empty" | "eraser", event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedTool(tool)
  }

  const totalSeats = seats.filter((seat) => seat.type !== "empty").length

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Seat Layout Creator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="layoutName">Layout Name</Label>
              <Input
                id="layoutName"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                placeholder="e.g., Volvo 2+2 Sleeper"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rows">Rows</Label>
              <Input
                id="rows"
                type="number"
                min={1}
                max={20}
                value={rows}
                onChange={(e) => setRows(Number.parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="columns">Columns</Label>
              <Input
                id="columns"
                type="number"
                min={1}
                max={8}
                value={columns}
                onChange={(e) => setColumns(Number.parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={generateStandardLayout}>
              Generate 2+2 Layout
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={clearLayout}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={togglePreviewMode}>
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewMode ? "Edit Mode" : "Preview Mode"}
            </Button>
            <Button type="button" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Layout
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">Total Seats: {totalSeats}</Badge>
            <Badge variant="outline">Regular: {seats.filter((s) => s.type === "regular").length}</Badge>
            <Badge variant="outline">Premium: {seats.filter((s) => s.type === "premium").length}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tool Palette */}
      {!isPreviewMode && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                { tool: "regular", label: "Regular Seat", color: "bg-green-500" },
                { tool: "premium", label: "Premium Seat", color: "bg-blue-500" },
                { tool: "disabled", label: "Disabled Seat", color: "bg-gray-400" },
                { tool: "empty", label: "Empty Space", color: "bg-transparent border-2 border-dashed border-gray-300" },
                { tool: "eraser", label: "Eraser", color: "bg-red-500" },
              ].map(({ tool, label, color }) => (
                <Button
                  key={tool}
                  type="button" // Added type="button" to prevent form submission
                  variant={selectedTool === tool ? "default" : "outline"}
                  size="sm"
                  onClick={(event) => handleToolSelect(tool as "regular" | "premium" | "disabled" | "empty" | "eraser", event)}
                  className="flex items-center gap-2"
                >
                  <div className={`w-4 h-4 rounded ${color}`}></div>
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Layout Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{isPreviewMode ? "Layout Preview" : "Click to Place Seats"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="space-y-4">
              {/* Driver indicator */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-8 bg-gray-300 rounded-t-lg flex items-center justify-center text-xs font-medium">
                  Driver
                </div>
              </div>

              {/* Seat grid */}
              <div className="grid gap-2" style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}>
                {Array.from({ length: rows }, (_, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2 justify-center">
                    {Array.from({ length: columns }, (_, colIndex) => {
                      const seat = getSeatAtPosition(rowIndex, colIndex)
                      const isEmpty = !seat
                      const isAisle = seat?.type === "empty"

                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`
                            w-12 h-12 rounded-md flex items-center justify-center text-xs font-medium
                            transition-colors cursor-pointer
                            ${isEmpty ? "bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300" : ""}
                            ${seat ? getSeatColor(seat.type) : ""}
                            ${isPreviewMode ? "cursor-default" : ""}
                          `}
                          onClick={(event) => handleCellClick(rowIndex, colIndex, event)}
                          title={
                            isEmpty ? "Click to add seat" : isAisle ? "Aisle space" : `${seat.type} seat: ${seat.id}`
                          }
                        >
                          {seat && seat.type !== "empty" ? seat.id : ""}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Legend:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Regular</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Premium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span>Disabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-transparent border-2 border-dashed border-gray-300 rounded"></div>
                    <span>Aisle/Empty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

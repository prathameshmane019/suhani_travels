"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SeatLayout, SeatPosition } from "@/types"
import { toast } from "sonner"

interface SeatSelectionProps {
  seatLayout: SeatLayout
  bookedSeats: string[]
  onSeatSelect: (selectedSeats: string[]) => void
  selectedSeats: string[]
}

export function SeatSelection({ seatLayout, bookedSeats, onSeatSelect, selectedSeats }: SeatSelectionProps) {
  const [currentSelectedSeats, setCurrentSelectedSeats] = useState<string[]>(selectedSeats)

  console.log(seatLayout);
  useEffect(() => {
    setCurrentSelectedSeats(selectedSeats)
  }, [selectedSeats])

  const isBooked = (seatId: string) => {
    return bookedSeats.includes(seatId)
  }

  const isSelected = (seatId: string) => {
    return currentSelectedSeats.includes(seatId)
  }

  const handleSeatToggle = (seat: SeatPosition, event: React.MouseEvent) => {
    event.stopPropagation()

    if (seat.type === "disabled" || seat.type === "empty") return

    if (isBooked(seat.id)) {
      toast.info("This seat is already booked.")
      return
    }

    const newSelectedSeats = isSelected(seat.id)
      ? currentSelectedSeats.filter((id) => id !== seat.id)
      : [...currentSelectedSeats, seat.id]

    setCurrentSelectedSeats(newSelectedSeats)
    onSeatSelect(newSelectedSeats)
  }

  const getSeatColor = (seat: SeatPosition) => {
    if (seat.type === "empty") return "bg-transparent"
    if (seat.type === "disabled") return "bg-gray-300 text-gray-500 cursor-not-allowed"
    if (isBooked(seat.id)) return "bg-red-500 text-white cursor-not-allowed"
    if (isSelected(seat.id)) return "bg-blue-600 text-white hover:bg-blue-700"

    return "bg-green-500 text-white hover:bg-green-600"
  }

  const renderSeatGrid = () => {
    const grid: (SeatPosition | null)[][] = Array.from({ length: seatLayout.rows }, () =>
      Array.from({ length: seatLayout.columns }, () => null),
    )

    // Place seats in grid
    seatLayout.seats.forEach((seat) => {
      if (seat.row < seatLayout.rows && seat.column < seatLayout.columns) {
        grid[seat.row][seat.column] = seat
      }
    })

    return grid.map((row, rowIndex) => (
      <div key={rowIndex} className="flex gap-2 justify-center">
        {row.map((seat, colIndex) => {
          if (!seat) {
            return <div key={`${rowIndex}-${colIndex}`} className="w-12 h-12"></div>
          }

          if (seat.type === "empty") {
            return <div key={seat.id} className="w-12 h-12"></div>
          }

          return (
            <Button
              key={seat.id}
              variant="outline"
              className={`
                w-12 h-12 rounded-md text-xs font-medium p-0
                transition-colors
                ${getSeatColor(seat)}
              `}
              onClick={(event) => handleSeatToggle(seat, event)}
              disabled={seat.type === "disabled" || isBooked(seat.id)}
             
            >
              {seat.id}
            </Button>
          )
        })}
      </div>
    ))
  }

  const selectedSeatLabels = currentSelectedSeats
    .map((seatId) => {
      const seat = seatLayout.seats.find((s) => s.id === seatId)
      return seat?.id
    })
    .filter(Boolean)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{seatLayout.name} - Seat Selection</CardTitle>
          <div className="flex justify-center gap-4">
            <Badge variant="outline">Total Seats: {seatLayout.totalSeats}</Badge>
            <Badge variant="outline">Available: {seatLayout.totalSeats - bookedSeats.length}</Badge>
            <Badge variant="outline">Selected: {currentSelectedSeats.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Driver indicator */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-8 bg-gray-300 rounded-t-lg flex items-center justify-center text-xs font-medium">
                Driver
              </div>
            </div>

            {/* Seat grid */}
            <div className="flex flex-col items-center space-y-2">{renderSeatGrid()}</div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Legend:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span>Disabled</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentSelectedSeats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedSeatLabels.map((label) => (
                <Badge key={label} variant="secondary" className="text-sm">
                  {label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

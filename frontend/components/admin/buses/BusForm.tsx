"use client"

import type React from "react"

import type { BusFormData, BusStatus, SeatLayout } from "@/types"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { SeatLayoutCreator } from "./SeatLayoutCreater"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

interface BusFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: BusFormData) => void
  initialData?: Partial<BusFormData>
  mode: "create" | "edit"
  existingImageUrl?: string
}

const defaultFormData: BusFormData = {
  model: "", 
  registrationNumber: "",
  type: "ac-sleeper",
  seats: 40,
  amenities: [],
  image: null,
  status: "active",
  seatLayout: undefined,
  agentPassword: "",
}

const amenitiesList = ["AC", "WiFi", "USB", "Water", "Blanket", "Charging Point"]

export function BusForm({ open, onClose, onSubmit, initialData, mode, existingImageUrl }: BusFormProps) {
  const [formData, setFormData] = useState<BusFormData>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    if (open) {
      setFormData(initialData ? { ...defaultFormData, ...initialData } : defaultFormData)
    }
  }, [open, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const handleModalClose = () => {
    onClose()
  }

  const handleSeatLayoutSave = (layout: SeatLayout) => {
    setFormData((prev) => ({
      ...prev,
      seatLayout: layout,
      seats: layout.totalSeats,
    }))
    setActiveTab("details")
  }

  const removeSeatLayout = () => {
    setFormData((prev) => ({
      ...prev,
      seatLayout: undefined,
      seats: 40,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] p-0 flex flex-col">
        <div className="flex-none p-6 border-b">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl">{mode === "create" ? "Add New Bus" : "Edit Bus"}</DialogTitle>
            <p className="text-muted-foreground text-sm">
              Fill in the information below to {mode === "create" ? "add a new" : "update the"} bus.
            </p>
          </DialogHeader>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setIsSubmitting(true)
            try {
              await handleSubmit(e)
            } finally {
              setIsSubmitting(false)
            }
          }}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="flex-none px-6 pt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Bus Details</TabsTrigger>
                  <TabsTrigger value="layout">Seat Layout</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="details" className="flex-1 px-6 py-4 mt-0">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="model" className="text-base">
                          Bus Model
                        </Label>
                        <Input
                          id="model"
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                          placeholder="e.g., Volvo 9400"
                          className="h-11"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registrationNumber" className="text-base">
                          Registration Number
                        </Label>
                        <Input
                          id="registrationNumber"
                          value={formData.registrationNumber}
                          onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                          placeholder="e.g., KA 01 AB 1234"
                          className="h-11"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="type" className="text-base">
                            Bus Type
                          </Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value as BusFormData["type"] })}
                          >
                            <SelectTrigger id="type" className="h-11">
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ac-sleeper">AC Sleeper</SelectItem>
                              <SelectItem value="non-ac-sleeper">Non-AC Sleeper</SelectItem>
                              <SelectItem value="ac-seater">AC Seater</SelectItem>
                              <SelectItem value="non-ac-seater">Non-AC Seater</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="status" className="text-base">
                            Status
                          </Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value as BusStatus })}
                          >
                            <SelectTrigger id="status" className="h-11">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="seats" className="text-base">
                              Total Seats
                            </Label>
                            <Input
                              id="seats"
                              type="number"
                              value={formData.seats || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  seats: e.target.value ? Number.parseInt(e.target.value) : 0,
                                })
                              }
                              min={1}
                              className="h-11"
                              required
                              disabled={!!formData.seatLayout}
                            />
                            {formData.seatLayout && (
                              <p className="text-xs text-muted-foreground">Automatically set from seat layout</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-base">Seat Layout</Label>
                          {formData.seatLayout ? (
                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Custom Layout
                                </Badge>
                                <div>
                                  <p className="font-medium">{formData.seatLayout.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formData.seatLayout.rows}×{formData.seatLayout.columns} grid,{" "}
                                    {formData.seatLayout.totalSeats} seats
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setActiveTab("layout")}
                                >
                                  Edit Layout
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={removeSeatLayout}>
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <div>
                                <p className="font-medium">Standard Layout</p>
                                <p className="text-sm text-muted-foreground">Using default seat arrangement</p>
                              </div>
                              <Button type="button" variant="outline" size="sm" onClick={() => setActiveTab("layout")}>
                                Create Custom Layout
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base">Amenities</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted/50 p-4 rounded-lg">
                          {amenitiesList.map((amenity) => (
                            <div key={amenity} className="flex items-center space-x-2">
                              <Checkbox
                                id={`amenity-${amenity}`}
                                checked={formData.amenities.includes(amenity)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFormData({
                                      ...formData,
                                      amenities: [...formData.amenities, amenity],
                                    })
                                  } else {
                                    setFormData({
                                      ...formData,
                                      amenities: formData.amenities.filter((a) => a !== amenity),
                                    })
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`amenity-${amenity}`}
                                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {amenity}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="agentPassword">Agent Password</Label>
                        <Input
                          id="agentPassword"
                          type="password"
                          value={formData.agentPassword}
                          onChange={(e) => setFormData({ ...formData, agentPassword: e.target.value })}
                          placeholder="Enter a password for the agent"
                          className="h-11"
                          required={mode === 'create'}
                        />
                      </div>

                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Bus Image</Label>
                      <div className="h-[300px] relative">
                        <ImageUpload
                          label="Upload bus image"
                          onChange={(file) => setFormData({ ...formData, image: file })}
                          value={existingImageUrl}
                          className="h-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="layout" className="flex-1 px-6 py-4 mt-0">
                <SeatLayoutCreator onSave={handleSeatLayoutSave} initialLayout={formData.seatLayout} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex-none p-6 border-t bg-background">
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleModalClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="mr-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </span>
                ) : null}
                {mode === "create" ? "Add Bus" : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
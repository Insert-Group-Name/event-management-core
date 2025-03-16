"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, CheckCircle } from "lucide-react"

interface CheckinSlideProps {
  location: string
  onCheckin: () => void
}

export default function CheckinSlide({ location, onCheckin }: CheckinSlideProps) {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckin = () => {
    setIsLoading(true)

    // Simulate a delay
    setTimeout(() => {
      setIsCheckedIn(true)
      setIsLoading(false)
      onCheckin()
    }, 1500)
  }

  return (
    <div className="w-full max-w-md px-4 py-8 text-white relative">
      <div className="space-y-6 flex flex-col items-center text-center relative z-10">
        <div className="bg-primary/20 rounded-full p-6">
          <MapPin size={48} className="text-primary" />
        </div>

        <h2 className="text-xl font-bold">{location}</h2>

        {!isCheckedIn ? (
          <div className="space-y-4 w-full">
            <p className="text-white/70">Check in to this location to earn points and connect with others here!</p>

            <Button className="w-full" onClick={handleCheckin} disabled={isLoading}>
              {isLoading ? "Checking in..." : "Check in now"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-green-900/20 rounded-full p-4 border border-green-500/30">
              <CheckCircle size={36} className="text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium">You're checked in!</h3>
              <p className="text-white/70">
                You've joined {Math.floor(Math.random() * 100) + 50} others at this location
              </p>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square">
                  <img
                    src={`/placeholder.svg?height=50&width=50`}
                    alt="Attendee"
                    className="w-full h-full object-cover rounded-full border border-white/20"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Add colorful background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-700 opacity-90 -z-10" />
    </div>
  )
}


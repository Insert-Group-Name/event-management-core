import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Download, Repeat, Share2 } from "lucide-react"

interface SelfieSlideProps {
  prompt: string
  onCapture: (image: string) => void
}

export default function SelfieSlide({ prompt, onCapture }: SelfieSlideProps) {
  const [permission, setPermission] = useState<boolean | null>(null)
  const [photoTaken, setPhotoTaken] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // For demo purposes, we'll use a placeholder image instead of actual camera
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const requestCameraPermission = async () => {
    setPermission(true)

    // In a real implementation:
    // try {
    //   const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    //   if (videoRef.current) {
    //     videoRef.current.srcObject = stream
    //   }
    //   setPermission(true)
    // } catch (err) {
    //   console.error("Error accessing camera:", err)
    //   setPermission(false)
    // }
  }

  const takePhoto = () => {
    // For demo, we'll use a placeholder
    setPhotoUrl("/placeholder.svg?height=400&width=300")
    setPhotoTaken(true)
    onCapture("/placeholder.svg?height=400&width=300")

    // In a real implementation:
    // const video = videoRef.current
    // const canvas = canvasRef.current
    // if (video && canvas) {
    //   const context = canvas.getContext('2d')
    //   if (context) {
    //     canvas.width = video.videoWidth
    //     canvas.height = video.videoHeight
    //     context.drawImage(video, 0, 0)
    //     const dataUrl = canvas.toDataURL('image/png')
    //     setPhotoUrl(dataUrl)
    //     setPhotoTaken(true)
    //     onCapture(dataUrl)
    //   }
    // }
  }

  const retakePhoto = () => {
    setPhotoTaken(false)
    setPhotoUrl(null)
  }

  return (
    <div className="w-full max-w-md px-4 py-8 text-white relative">
      <div className="space-y-6 relative z-10">
        <h2 className="text-xl font-bold text-center mb-4">{prompt}</h2>

        {permission === null ? (
          <div className="space-y-4 text-center">
            <div className="bg-black/40 rounded-lg p-12 flex items-center justify-center">
              <Camera size={64} className="text-white/60" />
            </div>
            <p className="text-white/70">
              We need camera access to take a selfie. Your photo will only be shared with the event organizers.
            </p>
            <Button onClick={requestCameraPermission} className="w-full">
              Allow Camera Access
            </Button>
          </div>
        ) : permission === false ? (
          <div className="text-center p-6 rounded-lg bg-red-900/20 border border-red-500/30">
            <p>Camera access denied. Please enable camera access in your browser settings.</p>
          </div>
        ) : !photoTaken ? (
          <div className="space-y-4">
            <div className="bg-black/40 rounded-lg overflow-hidden relative aspect-[3/4]">
              {/* We would normally show the camera here */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera size={48} className="text-white/40" />
              </div>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover hidden" />
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <Button onClick={takePhoto} className="w-full">
              Take Photo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden relative aspect-[3/4]">
              {photoUrl && (
                <img src={photoUrl || "/placeholder.svg"} alt="Your selfie" className="w-full h-full object-cover" />
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" onClick={retakePhoto} className="flex items-center gap-2">
                <Repeat size={16} />
                Retake
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 size={16} />
                Share
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Add colorful background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-700 opacity-90 -z-10" />
    </div>
  )
}


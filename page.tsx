"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Balloon from "../components/Balloon"
import MicrophonePermission from "../components/MicrophonePermission"

export default function Home() {
  const [balloonPosition, setBalloonPosition] = useState(0)
  const [isBlowing, setIsBlowing] = useState(false)
  const [hasMicPermission, setHasMicPermission] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  useEffect(() => {
    if (hasMicPermission) {
      setupAudioContext()
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [hasMicPermission])

  const setupAudioContext = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 256
      detectBlowing()
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const detectBlowing = () => {
    if (!analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const updateBalloonPosition = () => {
      analyserRef.current!.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength

      if (average > 50) {
        // Adjust this threshold as needed
        setIsBlowing(true)
        setBalloonPosition((prev) => Math.min(prev + 2, 100))
      } else {
        setIsBlowing(false)
        setBalloonPosition((prev) => Math.max(prev - 0.5, 0))
      }

      requestAnimationFrame(updateBalloonPosition)
    }

    updateBalloonPosition()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-sky-100">
      {!hasMicPermission ? (
        <MicrophonePermission onPermissionGranted={() => setHasMicPermission(true)} />
      ) : (
        <div className="w-full max-w-md aspect-[9/16] bg-white rounded-3xl shadow-xl overflow-hidden relative">
          <motion.div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            animate={{ y: `${-balloonPosition}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
          >
            <Balloon isBlowing={isBlowing} />
          </motion.div>
          <div className="absolute bottom-4 left-0 right-0 text-center text-gray-600">对着麦克风吹气,让气球飞起来!</div>
        </div>
      )}
    </main>
  )
}


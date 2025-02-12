import { motion } from "framer-motion"

interface BalloonProps {
  isBlowing: boolean
}

export default function Balloon({ isBlowing }: BalloonProps) {
  return (
    <motion.svg
      width="100"
      height="120"
      viewBox="0 0 100 120"
      animate={{
        scale: isBlowing ? [1, 1.1, 1] : 1,
      }}
      transition={{
        duration: 0.3,
        repeat: isBlowing ? Number.POSITIVE_INFINITY : 0,
      }}
    >
      <motion.path
        d="M50 10 C20 10 10 40 10 60 C10 80 30 100 50 100 C70 100 90 80 90 60 C90 40 80 10 50 10"
        fill="#FF6B6B"
        stroke="#FF4757"
        strokeWidth="2"
      />
      <path d="M50 100 L50 120" stroke="#FF4757" strokeWidth="2" />
    </motion.svg>
  )
}


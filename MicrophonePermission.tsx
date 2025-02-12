interface MicrophonePermissionProps {
  onPermissionGranted: () => void
}

export default function MicrophonePermission({ onPermissionGranted }: MicrophonePermissionProps) {
  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      onPermissionGranted()
    } catch (error) {
      console.error("Error requesting microphone permission:", error)
      alert("无法访问麦克风。请检查您的浏览器设置并允许访问麦克风。")
    }
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">欢迎来到气球吹吹乐!</h1>
      <p className="mb-4">我们需要访问您的麦克风来检测吹气。</p>
      <button
        onClick={requestPermission}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        允许访问麦克风
      </button>
    </div>
  )
}


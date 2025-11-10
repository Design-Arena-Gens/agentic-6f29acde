import dynamic from 'next/dynamic'

const ImageOCR = dynamic(() => import('../components/ImageOCR'), { ssr: false })

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Extract text from an image</h2>
        <p className="text-gray-600">
          Drop an image or pick a file. All processing happens in your browser.
        </p>
      </div>
      <ImageOCR />
    </div>
  )
}

"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Tesseract from 'tesseract.js'

type OcrProgress = {
  status: string
  progress: number
}

export default function ImageOCR(): React.ReactElement {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [text, setText] = useState<string>("")
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [progress, setProgress] = useState<OcrProgress | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    setText("")
  }, [])

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    onFiles(e.dataTransfer.files)
  }, [onFiles])

  const onPick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const recognize = useCallback(async () => {
    if (!imageUrl) return
    setIsRunning(true)
    setProgress({ status: 'initializing', progress: 0 })

    try {
      const result = await Tesseract.recognize(imageUrl, 'eng', {
        logger: (m) => {
          if (typeof (m as any).progress === 'number') setProgress({ status: (m as any).status, progress: (m as any).progress })
        },
      })
      setText(result.data.text)
    } finally {
      setIsRunning(false)
    }
  }, [imageUrl])

  useEffect(() => {
    // Cleanup object URL on change/unmount
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  const canRun = useMemo(() => Boolean(imageUrl) && !isRunning, [imageUrl, isRunning])

  return (
    <div className="space-y-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-brand-400 transition-colors"
      >
        {imageUrl ? (
          <div className="space-y-4">
            <img
              src={imageUrl}
              alt="Selected"
              className="mx-auto max-h-80 rounded-md object-contain"
            />
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={recognize}
                disabled={!canRun}
                className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-white disabled:opacity-50"
              >
                {isRunning ? 'Processing?' : 'Extract text'}
              </button>
              <button
                onClick={() => { setImageUrl(null); setText('') }}
                className="inline-flex items-center justify-center rounded-md border px-4 py-2"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">Drag & drop an image here</p>
            <p className="text-gray-500 text-sm">or</p>
            <button onClick={onPick} className="rounded-md border px-3 py-1.5 text-sm">Choose file</button>
          </div>
        )}
      </div>

      {isRunning && (
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded bg-gray-100">
            <div
              className="h-full bg-brand-500 transition-all"
              style={{ width: `${Math.round((progress?.progress ?? 0) * 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{progress?.status ?? 'Working?'}</p>
        </div>
      )}

      {text && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Extracted text</h3>
          <textarea
            className="w-full min-h-[12rem] rounded-md border p-3 font-mono text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      )}

      <div className="text-xs text-gray-500">
        Processing happens client-side using Tesseract.js. Images are not uploaded to a server.
      </div>
    </div>
  )
}

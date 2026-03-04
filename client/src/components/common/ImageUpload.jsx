import { useState, useRef } from 'react'
import { FaCloudUploadAlt, FaTimes, FaImage } from 'react-icons/fa'

export default function ImageUpload({ onChange, maxFiles = 8 }) {
  const [previews, setPreviews] = useState([])
  const [files, setFiles] = useState([])
  const inputRef = useRef()

  const handleFiles = (selected) => {
    const newFiles = Array.from(selected).slice(0, maxFiles - files.length)
    const newPreviews = newFiles.map(f => URL.createObjectURL(f))
    const updated = [...files, ...newFiles]
    const updatedPreviews = [...previews, ...newPreviews]
    setFiles(updated)
    setPreviews(updatedPreviews)
    onChange(updated)
  }

  const remove = (idx) => {
    const updated = files.filter((_, i) => i !== idx)
    const updatedPreviews = previews.filter((_, i) => i !== idx)
    setFiles(updated)
    setPreviews(updatedPreviews)
    onChange(updated)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <FaCloudUploadAlt className="mx-auto text-gray-400 mb-2" size={36}/>
        <p className="text-gray-600 font-medium">Click or drag & drop images here</p>
        <p className="text-gray-400 text-sm mt-1">JPG, PNG, WebP up to 5MB each (max {maxFiles} images)</p>
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)}/>
      </div>
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {previews.map((src, i) => (
            <div key={i} className="relative group aspect-square">
              <img src={src} alt="" className="w-full h-full object-cover rounded-xl"/>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); remove(i) }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTimes size={10}/>
              </button>
              {i === 0 && <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Cover</span>}
            </div>
          ))}
          {previews.length < maxFiles && (
            <div onClick={() => inputRef.current.click()} className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-400">
              <FaImage className="text-gray-400" size={24}/>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

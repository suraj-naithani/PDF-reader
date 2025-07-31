"use client"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileText, X, CheckCircle } from "lucide-react"

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile)
            const url = URL.createObjectURL(selectedFile)
            setPdfUrl(url)

            // Original API upload logic
            const formData = new FormData()
            formData.append('pdf', selectedFile)
            try {
                await fetch('http://localhost:8000/upload/pdf', {
                    method: 'POST',
                    body: formData,
                })
                console.log('File uploaded')
            } catch (error) {
                console.error('Upload failed:', error)
            }
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && droppedFile.type === "application/pdf") {
            setFile(droppedFile)
            const url = URL.createObjectURL(droppedFile)
            setPdfUrl(url)

            // Original API upload logic
            const formData = new FormData()
            formData.append('pdf', droppedFile)
            try {
                await fetch('http://localhost:8000/upload/pdf', {
                    method: 'POST',
                    body: formData,
                })
                console.log('File uploaded')
            } catch (error) {
                console.error('Upload failed:', error)
            }
        }
    }

    const handleRemoveFile = () => {
        setFile(null)
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl)
        }
        setPdfUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="p-6 h-full w-full flex flex-col">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
            />

            {!file ? (
                <Card
                    className={`flex-1 border-2 border-dashed transition-all duration-300 cursor-pointer group hover:shadow-lg ${isDragOver
                        ? "border-indigo-400 bg-indigo-50/50 shadow-lg scale-[1.02]"
                        : "border-slate-300 hover:border-indigo-300 hover:bg-slate-50/50"
                        }`}
                    onClick={handleUploadClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                        <div
                            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${isDragOver
                                ? "bg-indigo-100 text-indigo-600 scale-110"
                                : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"
                                }`}
                        >
                            <Upload className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Upload PDF Document</h3>
                        <p className="text-slate-500 mb-6 max-w-sm">
                            Drag and drop your PDF file here, or click to browse and select from your device
                        </p>
                        <Button
                            variant="outline"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 hover:from-indigo-700 hover:to-purple-700 px-8 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Choose File
                        </Button>
                        <p className="text-xs text-slate-400 mt-4">Supports PDF files up to 10MB</p>
                    </div>
                </Card>
            ) : (
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold text-slate-800">{file.name}</p>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                </div>
                                <p className="text-sm text-slate-600">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveFile}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-2"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {pdfUrl && (
                        <div className="flex-1 border-2 border-slate-200 rounded-xl overflow-hidden shadow-inner bg-white relative">
                            <iframe
                                src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                                className="w-full h-full"
                                title="PDF Preview"
                                style={{ minHeight: "500px" }}
                                onError={() => {
                                    console.error("Failed to load PDF preview")
                                }}
                            />
                            <div className="absolute bottom-4 right-4">
                                <a
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-slate-500 hover:text-slate-700 underline bg-white/80 px-2 py-1 rounded"
                                >
                                    Open in new tab
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default FileUpload
"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Bot, User, FileText, Sparkles } from "lucide-react"

interface Doc {
    pageContent?: string;
    metadata?: {
        loc?: {
            pageNumber?: number;
        };
        source?: string;
    };
}

interface IMessage {
    role: 'assistant' | 'user';
    content?: string;
    documents?: Doc[];
}

const ChatComponent: React.FC = () => {
    const [message, setMessage] = useState<string>("")
    const [messages, setMessages] = useState<IMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendChatMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return

        setIsLoading(true)
        const newMessage: IMessage = { role: 'user', content: message }
        setMessages((prev) => [...prev, newMessage])
        setMessage("")

        try {
            const res = await fetch(`http://localhost:8000/chat?message=${encodeURIComponent(message)}`)
            const data = await res.json()
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: data?.message,
                    documents: data?.docs,
                },
            ])
        } catch (error) {
            console.error('Chat request failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[91.8vh] flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center max-w-md flex flex-col items-center h-full">
                            <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">Start a conversation</h3>
                            <p className="text-slate-500">
                                Type your message below to begin chatting
                            </p>
                        </div>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div key={index} className="flex gap-4">
                        <div
                            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${message.role === "user"
                                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                                : "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600"
                                }`}
                        >
                            {message.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>

                        <div className="flex-1 space-y-2">
                            <Card
                                className={`p-4 shadow-sm border-0 ${message.role === "user"
                                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 ml-4"
                                    : "bg-gradient-to-r from-slate-50 to-slate-100/50 mr-4"
                                    }`}
                            >
                                <div className="prose prose-h3:text-lg prose-h3:font-bold prose-h3:mb-2 prose-p:mb-4">
                                    {message.content && (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: message.content
                                                    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
                                                    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
                                                    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
                                                    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                                                    .replace(/\*(.+?)\*/g, "<em>$1</em>")
                                                    .replace(/\n/g, "<br />"),
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Display documents with source and page number */}
                                {message.documents?.map((doc, docIndex) => (
                                    <div
                                        key={docIndex}
                                        className="mt-3 flex items-center gap-2 p-2 bg-white/50 rounded-lg text-xs text-slate-600"
                                    >
                                        <FileText className="w-4 h-4 text-indigo-500" />
                                        <span className="font-medium">
                                            {doc.metadata?.source
                                                ? `${doc.metadata.source} (Page ${doc.metadata?.loc?.pageNumber || "N/A"})`
                                                : "Document (Page N/A)"}
                                        </span>
                                    </div>
                                ))}
                            </Card>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center shadow-sm">
                            <Bot className="w-5 h-5" />
                        </div>
                        <Card className="flex-1 p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 mr-4 shadow-sm border-0">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}
                                    ></div>
                                </div>
                                <span className="font-medium">AI is responding...</span>
                            </div>
                        </Card>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200/50 p-6 bg-gradient-to-r from-white/50 to-slate-50/50 backdrop-blur-sm">
                <form onSubmit={handleSendChatMessage} className="flex gap-3">
                    <div className="flex-1 relative">
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="pr-12 py-3 rounded-xl border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 bg-white/80 backdrop-blur-sm"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={!message.trim() || isLoading}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ChatComponent
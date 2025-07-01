"use client"

import * as React from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { sendChatMessage } from "@/app/actions"

export default function AnalysisChat() {
  const { chat, setChatInput, addChatMessage } = useDashboardStore()
  const [isSending, setIsSending] = React.useState(false)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [chat.messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chat.inputValue.trim() || isSending) return

    const userMessage = chat.inputValue
    addChatMessage({ sender: "user", text: userMessage })
    setChatInput("")
    setIsSending(true)

    const result = await sendChatMessage(userMessage)
    if (result.success) {
      addChatMessage({ sender: "ai", text: result.response })
    }
    setIsSending(false)
  }

  return (
    <div className="flex flex-col h-[500px]">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {chat.messages.map((message: Message) => (
            <div key={message.id} className={cn("flex items-start gap-3", message.sender === "user" && "justify-end")}>
              {message.sender === "ai" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?width=32&height=32" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-xs rounded-lg p-3 text-sm",
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                {message.text}
              </div>
              {message.sender === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?width=32&height=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={chat.inputValue}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isSending}
          />
          <Button type="submit" size="icon" disabled={!chat.inputValue.trim() || isSending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

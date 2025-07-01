"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useDashboardStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { submitAnnouncement } from "@/app/actions"

export default function AnnouncementsForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { announcement, setAnnouncement, resetAnnouncement } = useDashboardStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const result = await submitAnnouncement(announcement)
    setIsSubmitting(false)
    toast({
      title: result.success ? "Success" : "Error",
      description: result.message,
    })
    if (result.success) {
      resetAnnouncement()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={announcement.title}
          onChange={(e) => setAnnouncement("title", e.target.value)}
          placeholder="Enter announcement title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          value={announcement.body}
          onChange={(e) => setAnnouncement("body", e.target.value)}
          placeholder="Enter announcement body"
          rows={5}
        />
      </div>
      <div className="space-y-2">
        <Label>Publish Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !announcement.publishDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {announcement.publishDate ? format(announcement.publishDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={announcement.publishDate}
              onSelect={(date) => setAnnouncement("publishDate", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Publishing..." : "Publish Announcement"}
      </Button>
    </form>
  )
}

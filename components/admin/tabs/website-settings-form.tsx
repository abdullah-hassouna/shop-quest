"use client"

import type React from "react"

import { useDashboardStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function WebsiteSettingsForm() {
  const { settings, setSetting } = useDashboardStore()

  const handleFileChange = (field: "favicon" | "logo") => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSetting(field, e.target.files[0])
    }
  }

  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="siteName">Site Name</Label>
        <Input id="siteName" value={settings.siteName} onChange={(e) => setSetting("siteName", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="favicon">Favicon</Label>
        <Input id="favicon" type="file" onChange={handleFileChange("favicon")} />
        {settings.favicon && <p className="text-sm text-muted-foreground">Selected: {settings.favicon.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="logo">Logo</Label>
        <Input id="logo" type="file" onChange={handleFileChange("logo")} />
        {settings.logo && <p className="text-sm text-muted-foreground">Selected: {settings.logo.name}</p>}
      </div>
      <Button>Save Settings</Button>
    </form>
  )
}

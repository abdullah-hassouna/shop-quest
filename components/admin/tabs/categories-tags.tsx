"use client"

import * as React from "react"
import { useDashboardStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Edit, Plus } from "lucide-react"

export default function CategoriesTags() {
  const { taxonomy, addCategory, deleteCategory, addTag, deleteTag } = useDashboardStore()
  const [newCategory, setNewCategory] = React.useState({ name: "", color: "#000000", icon: "" })
  const [newTag, setNewTag] = React.useState("")

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCategory.name) {
      addCategory(newCategory)
      setNewCategory({ name: "", color: "#000000", icon: "" })
    }
  }

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTag) {
      addTag({ name: newTag })
      setNewTag("")
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddCategory} className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory((c) => ({ ...c, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cat-color">Color</Label>
              <Input
                id="cat-color"
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory((c) => ({ ...c, color: e.target.value }))}
                className="p-1"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cat-icon">Icon</Label>
              <Input
                id="cat-icon"
                value={newCategory.icon}
                onChange={(e) => setNewCategory((c) => ({ ...c, icon: e.target.value }))}
                className="w-16"
              />
            </div>
            <Button type="submit" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </form>
          <div className="space-y-2">
            {taxonomy.categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-2 rounded-md border">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <span style={{ color: cat.color }} className="font-medium">
                    {cat.name}
                  </span>
                </div>
                <div className="space-x-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteCategory(cat.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddTag} className="flex items-center gap-2">
            <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="New tag name" />
            <Button type="submit">Add Tag</Button>
          </form>
          <div className="flex flex-wrap gap-2">
            {taxonomy.tags.map((tag) => (
              <div key={tag.id} className="flex items-center gap-1 bg-muted rounded-full px-3 py-1 text-sm">
                <span>{tag.name}</span>
                <button onClick={() => deleteTag(tag.id)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

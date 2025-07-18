import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Formik, Form } from 'formik'
import { Product } from "../dialogs/EditProductData"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronsUpDown, ImagePlus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { MultiSelect } from "@/components/ui/multi-select"

// Predefined tags for suggestions
const SUGGESTED_TAGS = [
    "New Arrival", "Best Seller", "Sale", "Limited Edition", "Premium",
    "Eco-Friendly", "Handmade", "Organic", "Vegan", "Sustainable",
    "Featured", "Top Rated", "Trending", "Popular", "Exclusive"
];

export function EditProductForm({ product, validationSchema }: { product: Product, validationSchema: any }) {
    const [openTags, setOpenTags] = useState(false)

    return (
        <Formik
            initialValues={product}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                console.log(values)
            }}
        >
            {({ values, setFieldValue, errors, touched, handleBlur, handleChange }) => (
                <Form className="space-y-4">
                    {/* Name Field */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <div className="col-span-3">
                            <Input
                                value={values.name}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                id="name"
                                name="name"
                                className="w-full"
                            />
                            {touched.name && errors.name && (
                                <div className="text-destructive text-sm mt-1">{errors.name}</div>
                            )}
                        </div>
                    </div>

                    {/* Description Field */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <div className="col-span-3">
                            <Input
                                value={values.description}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                id="description"
                                name="description"
                                className="w-full"
                            />
                            {touched.description && errors.description && (
                                <div className="text-destructive text-sm mt-1">{errors.description}</div>
                            )}
                        </div>
                    </div>

                    {/* Price Field */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price
                        </Label>
                        <div className="col-span-3">
                            <Input
                                value={values.price}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                id="price"
                                name="price"
                                type="number"
                                className="w-full"
                            />
                            {touched.price && errors.price && (
                                <div className="text-destructive text-sm mt-1">{errors.price}</div>
                            )}
                        </div>
                    </div>

                    {/* Category Field */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category
                        </Label>
                        <div className="col-span-3">
                            <Select
                                value={values.category}
                                onValueChange={(value) => setFieldValue('category', value)}
                                defaultValue="electronics"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="electronics">Electronics</SelectItem>
                                    <SelectItem value="clothing">Clothing</SelectItem>
                                    <SelectItem value="books">Books</SelectItem>
                                </SelectContent>
                            </Select>
                            {touched.category && errors.category && (
                                <div className="text-destructive text-sm mt-1">{errors.category}</div>
                            )}
                        </div>
                    </div>
                    {/* Images Section */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="images" className="text-right pt-2">
                            Images
                        </Label>
                        <div className="col-span-3">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {values.images?.map((image, index) => (
                                    <div key={index} className="relative group aspect-square">
                                        <img
                                            src={image.url}
                                            alt={image.alt}
                                            className="w-full h-full object-cover rounded-lg border-2 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newImages = values.images.filter((_, i) => i !== index);
                                                setFieldValue('images', newImages);
                                            }}
                                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground 
                                                     rounded-full p-1 w-6 h-6 opacity-0 group-hover:opacity-100 
                                                     transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <label className="border-2 border-dashed border-muted hover:border-primary 
                                                rounded-lg aspect-square flex flex-col items-center 
                                                justify-center cursor-pointer transition-all hover:bg-accent">
                                    <div className="w-full h-full flex justify-around items-center">
                                        <ImagePlus className="h-6 w-6 text-muted-foreground mb-2" />
                                        <span className="text-sm text-muted-foreground">Add Image</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFieldValue('images', [
                                                        ...(values.images || []),
                                                        { url: reader.result, alt: file.name }
                                                    ]);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            {/* {touched.images && errors.images && (
                                <div className="text-destructive text-sm mt-2">{errors.images}</div>
                            )} */}
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="tags" className="text-right pt-2">
                            Tags
                        </Label>
                        <div className="col-span-3 space-y-3">
                            <MultiSelect
                                options={values.tags.map(({ name }) => ({ label: name, value: name }))}
                                onValueChange={(value) => {
                                    setFieldValue('tags', value);
                                }}
                                placeholder="Select Product Tags"
                                variant="inverted"
                                animation={0.5}
                                maxCount={3}
                            />
                            <div className="flex flex-wrap gap-2">
                                {values.tags?.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="flex items-center gap-1 py-1 px-3"
                                    >
                                        {tag.name}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newTags = values.tags.filter((_, i) => i !== index);
                                                setFieldValue('tags', newTags);
                                            }}
                                            className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>

                            <Popover open={openTags} onOpenChange={setOpenTags}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openTags}
                                        className="w-full justify-between"
                                    >
                                        Select or type to add tags...
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder="Search tags..." />
                                        <CommandEmpty>No tag found.</CommandEmpty>
                                        <CommandGroup>
                                            <ScrollArea className="h-64">
                                                {SUGGESTED_TAGS.map((tag) => (
                                                    <CommandItem
                                                        key={tag}
                                                        onSelect={() => {
                                                            const tagObj = { name: tag };
                                                            if (!values.tags?.some(t => t.name === tag)) {
                                                                setFieldValue('tags', [...(values.tags || []), tagObj]);
                                                            }
                                                            setOpenTags(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                values.tags?.some(t => t.name === tag)
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {tag}
                                                    </CommandItem>
                                                ))}
                                            </ScrollArea>
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <Input
                                placeholder="Type a custom tag and press Enter..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const input = e.target as HTMLInputElement;
                                        const tagName = input.value.trim();
                                        if (tagName && !values.tags?.some(t => t.name === tagName)) {
                                            setFieldValue('tags', [
                                                ...(values.tags || []),
                                                { name: tagName }
                                            ]);
                                            input.value = '';
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </Form>
            )}
        </Formik>
    )
}
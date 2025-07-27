import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Formik, Form, Field } from 'formik'
import { Product } from "../dialogs/EditProductData"
import { Input } from "@/components/ui/input"
import { ImagePlus, X } from "lucide-react"
import { useEffect, useState } from "react"
import { MultiSelect } from "@/components/ui/multi-select"
import { getAllTagsData } from "@/actions/tags/get-all-tags"
import { toast } from 'sonner';
import { getAllCategoriesData } from "@/actions/categories/get-all-categories"
import { Textarea } from "@/components/ui/textarea"

export function EditProductForm({ product, validationSchema }: { product: Product, validationSchema: any }) {
    const [tagsOptions, setTagsOptions] = useState<{ label: string, value: string }[]>([]);
    const [categoriesOptions, setCategoriesOptions] = useState<{ label: string, value: string, icon: string, color: string, slug: string }[]>([]);

    useEffect(() => {

        async function fetchTags() {
            try {
                const { tagsData } = await getAllTagsData();
                setTagsOptions(() => tagsData!.map(tag => ({ label: tag.name, value: tag.id })));
            } catch (error) {
                console.error("Error fetching tags:", error);
                toast.error("Failed to fetch tags data.");
            }
        }

        async function fetchCategories() {
            try {
                const { categoriesData } = await getAllCategoriesData();
                setCategoriesOptions(() => categoriesData!.map(cate => ({
                    label: cate.name,
                    value: cate.id,
                    icon: cate.icon || "",
                    color: cate.color || "#000",
                    slug: cate.slug
                })))
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to fetch categories data.");
            }
        }

        fetchCategories();
        fetchTags();
    }, []);

    return (
        <Formik
            initialValues={{
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                stock: '',
                category: product.category?.slug || '',
                tags: product.tags?.map(tag => tag.id) || [],
                images: product.images || []
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {

                const addedImgs = values.images.filter(oldImg => (typeof oldImg.id === "undefined"))
                const removedImgs = product.images.filter(oldImg => !values.images.find(newimg => newimg.id === oldImg.id))

                console.log(values.tags)

                // toast()
            }}
            enableReinitialize={true}
        >
            {({ values, setFieldValue, errors, touched, isSubmitting, }) => (
                <Form className="grid grid-cols-2 w-full space-x-2 space-y-2">

                    <div>
                        <Label htmlFor="name" className="text-right mb-2">
                            Name
                        </Label>
                        <Field name="name">
                            {({ field }: any) => (
                                <Textarea
                                    {...field}
                                    id="name"
                                    className="w-full"
                                />
                            )}
                        </Field>
                        {touched.name && errors.name && (
                            <div className="text-destructive text-sm mt-1">{errors.name}</div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-right mb-2">
                            Description
                        </Label>
                        <Field name="description">
                            {({ field }: any) => (
                                <Textarea
                                    {...field}
                                    id="description"
                                    className="w-full"
                                />
                            )}
                        </Field>
                        {touched.description && errors.description && (
                            <div className="text-destructive text-sm mt-1">{errors.description}</div>
                        )}
                    </div>

                    <div className="col-span-1 space-x-3 space-y-3">
                        <div>
                            <Label htmlFor="price" className="text-right mb-2">
                                Price
                            </Label>
                            <Field name="price">
                                {({ field }: any) => (
                                    <Input
                                        {...field}
                                        id="price"
                                        type="number"
                                        className="w-full"
                                    />
                                )}
                            </Field>
                            {touched.price && errors.price && (
                                <div className="text-destructive text-sm mt-1">{errors.price}</div>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="stock" className="text-right mb-2">
                                Stock
                            </Label>
                            <Field name="stock">
                                {({ field }: any) => (
                                    <Input
                                        {...field}
                                        id="stock"
                                        type="number"
                                        className="w-full"
                                    />
                                )}
                            </Field>
                            {touched.stock && errors.stock && (
                                <div className="text-destructive text-sm mt-1">{errors.stock}</div>
                            )}
                        </div>

                        <div className="flex flex-col items-start space-y-6 mb-10">
                            <Label htmlFor="tags" className="text-right pt-2">
                                Tags
                            </Label>
                            <MultiSelect
                                defaultValue={values.tags}
                                options={tagsOptions}
                                onValueChange={(value) => {
                                    setFieldValue('tags', value);
                                }}
                                placeholder="Select Product Tags"
                                variant="inverted"
                                animation={0.5}
                                maxCount={3}
                            />
                        </div>

                        <div className="flex flex-col items-start space-y-6">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <Select
                                value={values.category}
                                onValueChange={(value) => setFieldValue('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoriesOptions.map(cate => (
                                        <SelectItem
                                            key={cate.slug}
                                            className="my-3"
                                            style={{ background: cate.color }}
                                            value={cate.slug}
                                        >
                                            {cate.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {/* {touched.category && errors.category && (
                                <div className="text-destructive text-sm mt-1">{errors.category}</div>
                            )} */}
                        </div>
                    </div>

                    <div className="col-span-1">
                        <div className="flex flex-col items-start space-y-6">
                            <Label htmlFor="images" className="text-right pt-2">
                                Images
                            </Label>
                            <div className="col-span-3">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {values.images?.map((image: any, index: number) => (
                                        <div key={index} className="relative group aspect-square">
                                            <img
                                                src={image.url}
                                                alt={image.alt || `Image ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg border-2 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newImages = values.images.filter((_: any, i: number) => i !== index);
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
                    </div>


                    <DialogFooter className="col-span-2 w-full mt-5">
                        <Button
                            className="mx-auto"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </Form>
            )}
        </Formik>
    )
}
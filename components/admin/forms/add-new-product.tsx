import { addNewProductAction } from '@/actions/admin/products/add-new-product';
import { getAllCategoriesData } from '@/actions/categories/get-all-categories';
import { getAllTagsData } from '@/actions/tags/get-all-tags';
import { ImageUploadComponent, UploadedFile } from '@/components/ImageUploadComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { newProductValidation } from '@/validation/product-validation';
import { Formik } from 'formik';
import { Loader2, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';


function AddNewProductForm() {

    const [tagsOptions, setTagsOptions] = useState<{ label: string, value: string }[]>([]);
    const [categoriesOptions, setCategoriesOptions] = useState<{ label: string, value: string, icon: string, color: string }[]>([]);

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
                setCategoriesOptions(() => categoriesData!.map(cate => ({ label: cate.name, value: cate.id, icon: cate.icon || "", color: cate.color || "#000" })))
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to fetch categories data.");
            }
        }

        fetchCategories();
        fetchTags();
    }, []);

    function handleAddToTags(setValues: Function, values: any, tagsValues: string[]): void {
        setValues({ ...values, tags: tagsValues })
    }

    return (
        <Formik
            initialValues={{ name: '', price: 0, description: "", category: "", tags: [], images: [] }}
            validationSchema={newProductValidation}
            onSubmit={async (values, { setSubmitting }) => {

                if (!values.images || values.images.length === 0) {
                    throw new Error('No files provided');
                }

                const files = values.images as UploadedFile[]

                const formData = new FormData();

                files.forEach((img) => {
                    formData.append('files', img.file);
                });

                try {
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();

                    if (!result.success) {
                        throw new Error(result.details || 'Upload failed');
                    }
                    setSubmitting(false)
                    return result;
                } catch (error) {
                    console.error('Error uploading images:', error);
                    setSubmitting(false)
                    throw error;
                }
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setValues
            }) => (
                <form className='space-y-4 sm:space-y-6' onSubmit={handleSubmit}>
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <Input
                                placeholder='Product Name'
                                type="text"
                                name="name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                className='text-base sm:text-lg p-4 sm:p-6'
                            />
                            <small className='font-bold text-red-700'>
                                {errors.name && touched.name && errors.name}
                            </small>
                        </div>
                        <div>
                            <Input
                                max={200}
                                min={5}
                                placeholder='Product Price'
                                type="number"
                                name="price"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.price}
                                className='text-base sm:text-lg p-4 sm:p-6'
                            />
                            <small className='font-bold text-red-700'>
                                {errors.price && touched.price && errors.price}
                            </small>
                        </div>
                    </div>
                    <div>
                        <ImageUploadComponent setImagesValue={setValues} imagesValue={values.images} imagesCountLimit={5} />
                        <small className='mt-5 font-bold text-red-700'>{errors.images && touched.images && errors.images}</small>
                    </div>
                    <div>
                        <Textarea
                            placeholder='Product Description'
                            name="description"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.description}
                            className='text-base sm:text-lg '
                        />
                        <small className='font-bold text-red-700'>
                            {errors.description && touched.description && errors.description}
                        </small>
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <Select
                                onValueChange={(value) => setValues({ ...values, category: value })}
                                value={values.category}
                            >
                                <SelectTrigger className='w-full p-4 sm:p-6'>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoriesOptions.map(cate =>
                                        <SelectItem className='p-2' key={cate.value} value={cate.value}>
                                            <div style={{ background: cate.color }} className='flex space-x-5 items-center justify-start px-4 py-1 rounded-md'>
                                                <span className='capitalize' >{cate.label}</span>
                                                <img src={cate.icon} className='w-5 h-5' />
                                            </div>
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <small className='font-bold text-red-700'>
                                {errors.category && touched.category && errors.category}
                            </small>
                        </div>

                        <div>
                            <MultiSelect
                                options={tagsOptions}
                                onValueChange={(value) => handleAddToTags(setValues, values, value)}
                                placeholder="Select Product Tags"
                                variant="inverted"
                                animation={0.5}
                                maxCount={3}
                            />
                            <small className='font-bold text-red-700'>
                                {errors.tags && touched.tags && errors.tags}
                            </small>
                        </div>
                    </div>
                    <Button
                        type='submit'
                        variant={"link"}
                        className='w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white text-base sm:text-xl font-bold p-4 sm:p-6 rounded-md shadow-xl transition-colors duration-300 ease-in-out cursor-pointer'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className='h-5 w-5 sm:h-6 sm:w-6 animate-spin' />
                        ) : 'Confirm'
                        }
                    </Button>
                </form>
            )}
        </Formik>
    )
}

export default AddNewProductForm
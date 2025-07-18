import { ColorPicker } from '@/components/ColorPicker';
import { ImageUploadComponent } from '@/components/ImageUploadComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { newCategoryValidation } from '@/validation/category-validation';
import { Formik } from 'formik';
import { Loader2 } from 'lucide-react';
import React from 'react'

function AddNewCategoryForm() {
    return (
        <Formik
            initialValues={{ name: "", description: "", icon: [], color: "#000000", slug: "" }}
            validationSchema={newCategoryValidation}
            onSubmit={async (values, { setSubmitting }) => {

                // if (!values.images || values.images.length === 0) {
                //     throw new Error('No files provided');
                // }

                // const files = values.images as UploadedFile[]

                // const formData = new FormData();

                // files.forEach((img) => {
                //     formData.append('files', img.file);
                // });

                // try {
                //     const response = await fetch('/api/upload', {
                //         method: 'POST',
                //         body: formData,
                //     });

                //     if (!response.ok) {
                //         const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                //         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                //     }

                //     const result = await response.json();

                //     if (!result.success) {
                //         throw new Error(result.details || 'Upload failed');
                //     }

                //     return result;

                // } catch (error) {
                //     console.error('Error uploading images:', error);
                //     throw error;
                // }
                // setSubmitting(false)
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
                                placeholder='Category Name'
                                type="text"
                                name="name"
                                onChange={(e) => {
                                    setValues(prev => ({
                                        ...prev,
                                        name: e.target.value,
                                        slug: e.target.value
                                            .toLowerCase()
                                            .replace(/[^a-z0-9]+/g, '-')
                                            .replace(/^-+|-+$/g, '')
                                    }))
                                }}
                                onBlur={handleBlur}
                                value={values?.name}
                                className='text-base sm:text-lg p-4 sm:p-6'
                            />
                            <small className='font-bold text-red-700'>
                                {errors.name && touched.name && errors.name}
                            </small>
                        </div>
                        <div>
                            <Input
                                placeholder='Category Slug'
                                type="text"
                                name="slug"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled
                                value={values?.slug}
                                className='text-base sm:text-lg p-4 sm:p-6'
                            />
                            <small className='font-bold text-red-700'>
                                {errors.slug && touched.slug && errors.slug}
                            </small>
                        </div>
                    </div>
                    <div>
                        <ColorPicker
                            color={values?.color}
                            onChange={(color) => {
                                setValues(prev => ({
                                    ...prev,
                                    color
                                }))
                            }}
                            error={errors.color}
                        />
                    </div>
                    <div>
                        <ImageUploadComponent imageKeyName='icon' setImagesValue={setValues} imagesValue={values?.icon} imagesCountLimit={1} />
                        <small className='mt-5 font-bold text-red-700'>{errors.icon && touched.icon && errors.icon}</small>
                    </div>
                    <div>
                        <Textarea
                            placeholder='Product Description'
                            name="description"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values?.description}
                            className='text-base sm:text-lg '
                        />
                        <small className='font-bold text-red-700'>
                            {errors.description && touched.description && errors.description}
                        </small>
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

export default AddNewCategoryForm
import React, { useState } from 'react';
import { Formik } from 'formik';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import clsx from 'clsx';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import useUserDataStore, { UserState } from '@/store/user-store';
import { uploadNewprofileImg } from '@/actions/cloudinary/upload-image';
import { UserDataInterface } from '@/types/user-data-type';


const ChangeProfileImageForm = ({ user }: { user: UserDataInterface }) => {
    const { user: userData, changeImg } = useUserDataStore((state: UserState) => state);
    const [previewImg, setPreviewImg] = useState<File | undefined>()
    const [isUploading, setIsUploading] = useState(false);


    return (<div>
        <Formik
            initialValues={{ newImageUrl: '' }}
            onSubmit={async () => {
                if (previewImg) {
                    setIsUploading(true)
                    const newProfileImage = await uploadNewprofileImg(previewImg, userData.id)
                    if (newProfileImage) {
                        changeImg(newProfileImage);
                    } else {
                        console.error('Failed to upload image');
                    }
                    setIsUploading(false)
                };
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
            }) => (<form className=' flex flex-col space-y-4 sm:space-y-6' onSubmit={handleSubmit}>
                <div className='w-full flex justify-center md:justify-start'>
                    <Avatar className='h-24 w-24 text-6xl text-purple-500'>
                        {previewImg && <AvatarImage src={URL.createObjectURL(previewImg!)} alt={user.name!} />}
                        <AvatarFallback className='bg-purple-500 text-gray-100'>
                            {user.name!.split(" ")[0].charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <Label htmlFor="fullname"
                        className={clsx('text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block', { "text-red-700": errors.newImageUrl })}>
                        New Profile Image
                    </Label>
                    <Input
                        type="file"
                        name="newImageUrl"
                        onChange={(e) => {
                            setPreviewImg(_ => {
                                console.log(e.target.files![0])
                                return e.target.files![0]
                            })
                            handleChange(e)
                        }}
                        onBlur={handleBlur}
                        value={values.newImageUrl}
                    />
                    <small className='font-bold text-red-700'>
                        {errors.newImageUrl && touched.newImageUrl && errors.newImageUrl}
                    </small>
                </div>

                {isUploading ? <p>Uploading...</p> :
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                    >Save
                    </Button>}
            </form>
            )}
        </Formik >
    </div >)
}
    ;

export default ChangeProfileImageForm;
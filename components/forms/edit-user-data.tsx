import React from 'react';
import { Formik } from 'formik';
import { editUserDataValidationSchema } from '@/validation/auth-validation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import clsx from 'clsx';
import ConfirmUserDialog from '../dialogs/confirm-user';
import { UserDataInterface } from '@/types/user-data-type';
import { UserNewDataProps } from '@/actions/user/confirm-user-data-update';

const EditUserDataForm = (initialValues: UserDataInterface) => (
    <div>
        <Formik
            initialValues={{ fullname: initialValues.name, email: initialValues.email, password: '', confirmPassword: '' }}
            validationSchema={editUserDataValidationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(false)
                // redirect('')
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
            }) => (<form className='space-y-4 sm:space-y-6' onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="fullname"
                        className={clsx('text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block', { "text-red-700": errors.fullname })}>
                        Full Name
                    </Label>
                    <Input
                        type="text"
                        name="fullname"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.fullname as string}
                        className='text-base sm:text-lg p-4 sm:p-6'
                    />
                    <small className='font-bold text-red-700'>
                        {errors.fullname && touched.fullname && errors.fullname}
                    </small>
                </div>
                <div>
                    <Label htmlFor="email"
                        className={clsx('text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block', { "text-red-700": errors.email })}>
                        Email
                    </Label>
                    <Input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email as string}
                        className='text-base sm:text-lg p-4 sm:p-6'
                    />
                    <small className='font-bold text-red-700'>
                        {errors.email && touched.email && errors.email}
                    </small>
                </div>
                <div>
                    <Label htmlFor="password"
                        className={clsx('text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block', { "text-red-700": errors.password })}>
                        Password
                    </Label>
                    <Input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        className='text-base sm:text-lg p-4 sm:p-6'
                    />
                    <small className='font-bold text-red-700'>
                        {errors.password && touched.password && errors.password}
                    </small>
                </div>
                <div>
                    <Label htmlFor="confirmPassword"
                        className={clsx('text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block', { "text-red-700": errors.confirmPassword })}>
                        Confirm Password
                    </Label>
                    <Input
                        type="password"
                        name="confirmPassword"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirmPassword}
                        className='text-base sm:text-lg p-4 sm:p-6'
                    />
                    <small className='font-bold text-red-700'>
                        {errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}
                    </small>
                </div>
                <ConfirmUserDialog disabled={(errors.password || errors.confirmPassword || errors.email || errors.fullname) ? true : false} newUserData={values as UserNewDataProps} oldUserData={initialValues} className='w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white text-base sm:text-xl font-bold p-4 sm:p-6 rounded-md shadow-xl transition-colors duration-300 ease-in-out cursor-pointer'>
                    Save
                </ConfirmUserDialog>
                <Button
                    className='hidden'
                    type='submit'
                    disabled={isSubmitting}
                >'Save'
                </Button>
            </form>
            )}
        </Formik >
    </div >
);

export default EditUserDataForm;
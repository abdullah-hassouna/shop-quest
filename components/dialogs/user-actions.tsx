import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { GetUserDataResponse } from '@/types/get-user-data-response'
import { updateUserData } from '@/actions/admin/users/update-user-data'
import { Formik } from 'formik'
import { Label } from '../ui/label'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { editUserDataValidationSchema } from '@/validation/auth-validation'


const UserActionDialog = ({ children, className, disabled, user }: { children: React.ReactNode, className?: string, disabled?: boolean, user: GetUserDataResponse },) => {


    return (
        <Dialog>
            <DialogTrigger disabled={disabled} className={className}>{children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update User Data</DialogTitle>
                    <div>
                        <Formik
                            initialValues={{ ...user, password: "", confirmPassword: "" }}
                            validationSchema={editUserDataValidationSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                setSubmitting(false)
                                const newUserData = await updateUserData({
                                    id: user.id as string,
                                    email: values.email,
                                    emailVerified: values.emailVerified,
                                    image: values.image || "",
                                    name: values.name,
                                    password: values.password,
                                    role: values.role as "ADMIN" | "BUYER",
                                })
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
                                    <Label htmlFor="name"
                                        className={cn('text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block', { "text-red-700": errors.name })}>
                                        Full Name
                                    </Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.name as string}
                                        className='text-base sm:text-lg p-4 sm:p-6'
                                    />
                                    <small className='font-bold text-red-700'>
                                        {errors.name && touched.name && errors.name}
                                    </small>
                                </div>
                                <div>
                                    <Label htmlFor="email"
                                        className={cn('text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block', { "text-red-700": errors.email })}>
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
                                    <Label htmlFor="emailVerified"
                                        className={cn('text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block', { "text-red-700": errors.emailVerified })}>
                                        Email Verified
                                    </Label>
                                    <Input
                                        type="date"
                                        name="emailVerified"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        // value={values.emailVerified?.toISOString()}
                                        className='text-base sm:text-lg p-4 sm:p-6'
                                    />
                                    <small className='font-bold text-red-700'>
                                        {errors.emailVerified && touched.emailVerified && errors.emailVerified}
                                    </small>
                                </div>
                                <div>
                                    <Label htmlFor="role"
                                        className={cn('text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block', { "text-red-700": errors.role })}>
                                        Role
                                    </Label>
                                    <Input
                                        type="string"
                                        name="role"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.role}
                                        className='text-base sm:text-lg p-4 sm:p-6'
                                    />
                                    <small className='font-bold text-red-700'>
                                        {errors.role && touched.role && errors.role}
                                    </small>
                                </div>
                                <div>
                                    <Label htmlFor="password"
                                        className={cn('text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block', { "text-red-700": errors.password })}>
                                        New Password
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
                                        className={cn('text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block', { "text-red-700": errors.confirmPassword })}>
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
                            </form>
                            )}
                        </Formik >
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default UserActionDialog
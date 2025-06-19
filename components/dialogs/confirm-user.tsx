import React from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { Formik } from 'formik'
import { Label } from '../ui/label'
import clsx from 'clsx'
import { Input } from '../ui/input'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmUserValidationSchema } from '@/validation/auth-validation'
import { confirmUaserDataUpdate, UserNewDataProps } from '@/actions/user/confirm-user-data-update'
import useUserDataStore, { UserData, UserState } from '@/store/user-store'
import { redirect as NextRedirect } from 'next/navigation'


const ConfirmUserDialog = ({ children, newUserData, oldUserData, className, disabled }: { children: React.ReactNode, newUserData: UserNewDataProps, oldUserData: UserData, className?: string, disabled: boolean },) => {

    const { user, changeEmail, changeName, } = useUserDataStore((state: UserState) => state);
    return (
        <Dialog>
            <DialogTrigger disabled={disabled} className={className}>{children}</DialogTrigger>
            {(oldUserData.email === newUserData.email && oldUserData.name === newUserData.fullname && newUserData.password === "") ?
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>No Changes</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile before saving.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
                :
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm your request with Password</DialogTitle>
                        <p className='text-sm text-red-400 font-semibold mt-1 mb-3'>You need to enter your passwod to confirm th edits you attend to make in the account. The new email will be asked for verification again using link.</p>
                        <Formik
                            initialValues={{ password: '' }}
                            validationSchema={ConfirmUserValidationSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                setSubmitting(true)
                                toast("submited")
                                const { success, error, newData, redirect } = await confirmUaserDataUpdate(user.id, values.password, newUserData);
                                if (success && newData && redirect) {
                                    changeEmail(newData.email || user.email)
                                    changeName(newData.fullname || user.name)
                                    toast('Confirming Success', {
                                        duration: 5000,
                                    });
                                    setTimeout(() => NextRedirect(redirect), 5000)
                                } else {
                                    toast('Confirming Failed', {
                                        description: error,
                                        duration: 5000,
                                    });
                                }
                                setSubmitting(false)
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
                            }) => (
                                <form className='space-y-4 sm:space-y-6' onSubmit={handleSubmit}>
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
                    </DialogHeader>
                </DialogContent>}
        </Dialog>
    )
}

export default ConfirmUserDialog
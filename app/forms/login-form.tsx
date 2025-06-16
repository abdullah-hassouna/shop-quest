import React, { MouseEventHandler } from 'react';
import { Formik } from 'formik';
import { Loader2 } from 'lucide-react';
import { logInValidationSchema, } from '@/validation/auth-validation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import clsx from 'clsx';
import { login } from '@/actions/auth/regisreation/login-action';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const LogInForm = ({ isSignUp, toggleForm, routerHook }: { isSignUp: boolean, toggleForm: MouseEventHandler<HTMLButtonElement>, routerHook: AppRouterInstance }) => (
    <div>
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={logInValidationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true)
                const { success, error, redirect } = await login(values);
                alert(success || error);
                if (redirect) {
                    routerHook.push(redirect);
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
                        <Label htmlFor="email"
                            className={clsx('text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block', { "text-red-700": errors.email })}>
                            Email
                        </Label>
                        <Input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
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
                    <Button
                        type='submit'
                        variant={"link"}
                        className='w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white text-base sm:text-xl font-bold p-4 sm:p-6 rounded-md shadow-xl transition-colors duration-300 ease-in-out cursor-pointer'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className='h-5 w-5 sm:h-6 sm:w-6 animate-spin' />
                        ) : 'Sign Up'
                        }
                    </Button>

                    <div className=' mt-4 sm:mt-5 flex items-center justify-center'>
                        <p className='text-base sm:text-lg lg:text-xl text-gray-600'>
                            {isSignUp ? 'Already a member?' : "Don't have an account?"}
                        </p>
                        <span
                            // variant='link'
                            className='text-base sm:text-lg lg:text-xl mx-2 text-gray-500 cursor-pointer'
                            onClick={toggleForm}
                        >
                            {isSignUp ? 'Sign in' : 'Sign up'}
                        </span>
                    </div>
                </form>
            )}
        </Formik>
    </div >
);

export default LogInForm;
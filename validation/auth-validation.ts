import * as Yup from 'yup';

export const logInValidationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Required'),
});


export const signUpValidationSchema = Yup.object({
    fullname: Yup.string()
        .min(2, 'Full name must be at least 2 characters')
        .required('Full name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'Passwords must match')
        .required('Confirm password is required'),
});


export const editUserDataValidationSchema = Yup.object({
    fullname: Yup.string()
        .min(2, 'Full name must be at least 2 characters'),
    email: Yup.string()
        .email('Invalid email address'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'Passwords must match')

});


export const ConfirmUserValidationSchema = Yup.object({
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Required'),
});
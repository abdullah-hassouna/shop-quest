import * as Yup from 'yup';

export const newCategoryValidation = Yup.object({
    name: Yup.string().required().max(25).min(5),
    description: Yup.string().required().max(250).min(50),
    icon: Yup.string(),
    color: Yup.string(),
    slug: Yup.string()
})
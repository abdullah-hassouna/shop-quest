import * as Yup from 'yup';

export const newCategoryValidation = Yup.object({
    name: Yup.string().required().max(25).min(5),
    description: Yup.string().required().max(250).min(50),
    icon: Yup.array()
        .of(
            Yup.object({
                id: Yup.number().required(),
                file: Yup.mixed<File>().required(),
                name: Yup.string().required(),
                size: Yup.number().required(),
                url: Yup.string().required(),
            }).required()
        ),
    color: Yup.string(),
    slug: Yup.string()
})
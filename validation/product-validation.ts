import * as Yup from 'yup';

export const newProductValidation = Yup.object({
    name: Yup.string().required().max(150).min(10),
    price: Yup.number().max(200).min(5),
    description: Yup.string().required().max(250).min(50),
    category: Yup.string().required(),
    tags: Yup.array()
        .of(Yup.string().required())
        .min(3, 'At least 3 tags are required')
        .max(10, 'No more than 10 tags are allowed')
        .required(),
    images: Yup.array()
        .of(
            Yup.object({
                id: Yup.number().required(),
                file: Yup.mixed<File>().required(),
                name: Yup.string().required(),
                size: Yup.number().required(),
                url: Yup.string().required(),
            }).required()
        )
        .min(3, 'At least 3 images are required')
        .max(10, 'No more than 10 images are allowed')
        .required(),
})
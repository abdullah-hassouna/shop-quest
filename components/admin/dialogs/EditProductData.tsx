"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { ReactNode } from "react"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { EditProductForm } from "../data-form/edit-product-form"

export interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    images: Array<{ id: string, url: string, alt: string }>
    tags: Array<{ id: string, name: string, alt: string }>
}

interface EditProductDataProps {
    product: Product | null
    className?: string
    children: ReactNode
}

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number()
        .required('Price is required')
        .positive('Price must be positive'),
    category: Yup.string().required('Category is required'),
    stock: Yup.number()
        .required('Stock is required')
        .integer('Stock must be an integer')
        .min(0, 'Stock cannot be negative'),
})

export function EditProductData({
    product,
    children,
    className
}: EditProductDataProps) {
    if (!product) return null

    return (
        <Dialog>
            <DialogTrigger className={className}>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{product.name}</DialogTitle>
                </DialogHeader>
                <EditProductForm product={product} validationSchema={validationSchema} />
            </DialogContent>
        </Dialog>
    )
}
"use client"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React, { ReactNode } from 'react'
import AddNewProductForm from '../forms/add-new-product'

interface AddNewProductProps {
    children: ReactNode
    disabled?: boolean
    className?: string
}

function AddNewProductDialog({ children, disabled, className }: AddNewProductProps) {
    return (
        <Dialog>
            <DialogTrigger disabled={disabled} className={className}>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader className='mb-6'>
                    <DialogTitle className='text-2xl'>Add New Product Info</DialogTitle>
                </DialogHeader>
                <AddNewProductForm />
            </DialogContent>
        </Dialog>
    )
}

export default AddNewProductDialog

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React, { ReactNode } from 'react'
import AddNewCategoryForm from '../forms/add-new-category'

interface AddNewCategoryProps {
    children: ReactNode
    disabled?: boolean
    className?: string
}

function AddNewCategoryDialog({ children, disabled, className }: AddNewCategoryProps) {
    return (
        <Dialog>
            <DialogTrigger disabled={disabled} className={className}>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader className='mb-6'>
                    <DialogTitle className='text-2xl'>Add New Category Info</DialogTitle>
                </DialogHeader>
                <AddNewCategoryForm />
            </DialogContent>
        </Dialog>
    )
}

export default AddNewCategoryDialog

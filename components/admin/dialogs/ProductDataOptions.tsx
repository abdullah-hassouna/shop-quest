import UserActionDialog from '@/components/dialogs/user-actions'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Edit2Icon, Eye, MoreVertical, Ungroup, X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { EditProductData, Product } from './EditProductData'

function ProductDataOptions({ row }: { row: any }) {

    const product: Product = {
        id: row.getValue("id"),
        name: row.getValue("name"),
        description: row.getValue("description"),
        price: row.getValue("price"),
        category: row.getValue("category").name,
        images: row.getValue("imagesId"),
        tags:  row.getValue("tags")
    }

    return (
        <div className='text-black/50 w-fit rounded-md flex px-1.5 items-center justify-evenly'>
            <Link href={`products/${row.getValue("id")}`} className='transition-all hover:bg-black hover:text-white rounded-md p-1'>
                <Eye className='w-5 h-5' />
            </Link>
            <span className='px-0.5 text-xl pb-1.5'>|</span>
            <Popover>
                <PopoverTrigger className='transition-all hover:bg-black hover:text-white rounded-md p-1' ><MoreVertical className='w-5 h-5' /></PopoverTrigger>
                <PopoverContent className='max-w-40 p-0'>
                    <div className='px-1 py-2 justify-between items-start flex flex-col gap-2'>
                        <EditProductData product={product} className='flex justify-start items-center gap-2 h-full py-0 w-full px-1.5 group hover:bg-black rounded-md'>
                            <Ungroup className='group-hover:font-bold group-hover:text-white text-gray-800 w-4 h-4' /> <span className='group-hover:font-bold group-hover:text-white text-gray-800'>Edit</span>
                        </EditProductData>
                        <Button variant={"ghost"} className='flex justify-start items-center gap-2 w-full px-1.5 group hover:bg-red-600 rounded-md'>
                            <X className='group-hover:font-bold group-hover:text-white text-red-600 w-4 h-4' /> <span className='group-hover:font-bold group-hover:text-white text-red-600'>Delete</span>
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default ProductDataOptions
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import ChangeProfileImageForm from '../forms/change-profile-image'
import useUserDataStore, { UserState } from '@/store/user-store';


const ChangeProfileImgDialog = ({ children, className, disabled }: { children: React.ReactNode, className?: string, disabled?: boolean },) => {
    const { user } = useUserDataStore((state: UserState) => state);

    return (
        <Dialog>
            <DialogTrigger disabled={disabled} className={className}>{children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Your new Profile Image</DialogTitle>
                    <p className='text-sm mt-1 mb-3'>Upload Image with  <span className='font-semibold'>(500 X 500)px</span> Image with <span className='font-semibold'>(.png, .jpeg, .jpg) format</span>.</p>
                    <ChangeProfileImageForm user={user} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default ChangeProfileImgDialog
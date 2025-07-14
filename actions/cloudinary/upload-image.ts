"use server"
import prisma from '@/lib/prisma';

export async function uploadNewProfileImg(imageFile: File, userId: string) {
    if (!imageFile) return;

    const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();

    if (CLOUD_NAME && UPLOAD_PRESET) {
        formData.append('file', imageFile);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.secure_url) {
                const userImageUploaded = await prisma.user.update({
                    where: { id: userId },
                    data: { image: data.secure_url }
                })

                console.log(userImageUploaded)
                return (data.secure_url);
            } else {
                console.error('Upload failed:', data);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }
};
export async function uploadNewProductImage(imageFiles: File[]) {


    if (!imageFiles || imageFiles.length === 0) {
        throw new Error('No files provided');
    }

    const formData = new FormData();

    imageFiles.forEach((file) => {
        formData.append('files', file);
    });

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.details || 'Upload failed');
        }

        return result;

    } catch (error) {
        console.error('Error uploading images:', error);
        throw error;
    }
}
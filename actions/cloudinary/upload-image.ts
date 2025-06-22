"use server"
import prisma from '@/lib/prisma';

export async function uploadNewprofileImg(imageFile: File, userId: string) {
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
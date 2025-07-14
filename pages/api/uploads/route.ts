import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        console.log("api reached")
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
        const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

        if (!CLOUD_NAME || !UPLOAD_PRESET) {
            return NextResponse.json({ error: 'Missing Cloudinary configuration' }, { status: 500 });
        }

        const uploadPromises = files.map(async (file) => {
            const fileFormData = new FormData();
            fileFormData.append('file', file);
            fileFormData.append('upload_preset', UPLOAD_PRESET);

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
                    method: 'POST',
                    body: fileFormData,
                });

                if (!response.ok) {
                    throw new Error(`Cloudinary error: ${response.status}`);
                }

                const data = await response.json();

                if (data.secure_url) {
                    return {
                        success: true,
                        url: data.secure_url,
                        publicId: data.public_id,
                        fileName: file.name
                    };
                } else {
                    throw new Error('No secure_url in response');
                }
            } catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    fileName: file.name
                };
            }
        });

        const results = await Promise.all(uploadPromises);

        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        return NextResponse.json({
            success: true,
            successful,
            failed,
            totalUploaded: successful.length,
            totalFailed: failed.length
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Upload failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
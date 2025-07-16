"use client"

import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Upload, X } from "lucide-react";

export interface UploadedFile {
    id: number;
    file: File;
    name: string;
    size: number;
    url: string;
}

export const ImageUploadComponent = ({ setImagesValue, imagesValue, imagesCountLimit }: { setImagesValue: any, imagesValue: UploadedFile[], imagesCountLimit: number }) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (files: FileList): void => {
        const fileArray = Array.from(files);
        const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

        const newFiles: UploadedFile[] = imageFiles.map(file => ({
            id: Date.now() + Math.random(),
            file,
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file)
        }));
        setImagesValue((prev: { images: UploadedFile[] }) => {
            console.log({ ...prev, ...newFiles })
            if (prev.images) {
                if (prev.images.length === 0) return { ...prev, images: newFiles }
                if (imagesCountLimit === prev.images.length) return prev
                return { ...prev, images: [...(prev.images), ...newFiles] }
            }
        });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        handleFileSelect(files);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = e.target.files;
        if (files) {
            handleFileSelect(files);
        }
    };

    const removeFile = (e: any, fileId: number): void => {
        e.stopPropagation()
        setImagesValue((prev: any) => ({
            ...prev,
            images: imagesValue.filter(f => f.id !== fileId)
        }))
    };

    const openFileDialog = (): void => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="relative">
                <div className="p-0">
                    <div
                        className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragging
                                ? 'border-primary bg-primary/10'
                                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                            }
            `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={openFileDialog}
                    >
                        {imagesValue.length > 0 ? (

                            <div className="gap-3 flex flex-wrap items-center justify-start">
                                {imagesValue.slice(0, 5).map((file) => (
                                    <div className="relative w-fit group"
                                        key={file.id}>
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className="h-36 w-3h-36 object-cover rounded border"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => removeFile(e, file.id)}
                                            className="absolute items-center justify-center top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] h-8 w-8 text-destructive hidden group-hover:flex"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : <>
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    PNG, JPG, GIF up to 10MB each
                                </p>
                            </div>
                            <Button variant="outline" className="mt-4" type="button" onClick={() => console.log()}>
                                Browse Files
                            </Button>
                        </>}

                    </div>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
            />
        </div>
    );
};
import React, { useState, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    className?: string;
    error?: string;
}

export function ColorPicker({
    color,
    onChange,
    className,
    error
}: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const presetColors = [
        "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff",
        "#ffff00", "#00ffff", "#ff00ff", "#808080", "#800000",
        "#808000", "#008000", "#800080", "#008080", "#000080"
    ];

    const handleClickOutside = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <div className={cn("relative", className)}>

            <div className="relative inline-block w-full">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full px-3 py-2 text-left border rounded-md shadow-sm",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                        "flex items-center justify-between",
                        error ? "border-red-500" : "border-gray-300"
                    )}
                >
                    <div className="flex items-center space-x-2">
                        <div
                            className="w-52 h-6 rounded-md border border-gray-200"
                            style={{ backgroundColor: color }}
                        />
                        <span className="text-sm font-bold">{color}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-20"
                            onClick={handleClickOutside}
                        />
                        <div className={cn(
                            "absolute z-30 mt-1 w-[280px]",
                            "bg-white rounded-md shadow-lg",
                            "border border-gray-200 p-3",
                        )}>
                            <HexColorPicker
                                color={color}
                                onChange={onChange}
                                className="mb-3"
                            />

                            <div className="grid grid-cols-5 gap-2 mt-3">
                                {presetColors.map((presetColor) => (
                                    <Button
                                        key={presetColor}
                                        className={cn(
                                            "w-full h-6 rounded-md",
                                            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                                            "transition-transform hover:scale-110",
                                            "relative"
                                        )}
                                        style={{ backgroundColor: presetColor }}
                                        onClick={() => {
                                            onChange(presetColor);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {color === presetColor && (
                                            <Check className="absolute inset-0 m-auto w-4 h-4 text-white mix-blend-difference" />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {error && (
                <span className="mt-1 text-sm text-red-600">
                    {error}
                </span>
            )}
        </div>
    );
}
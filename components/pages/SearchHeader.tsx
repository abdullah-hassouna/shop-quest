import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SortByProps } from "@/types/props-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ArrowUp, Grid, List } from "lucide-react";
import { Dispatch, memo, SetStateAction } from "react";

export const SearchHeader = memo(({ categorySlug, searchQuery, setSearchQuery, handleSearch, showFilters, setShowFilters, sortBy, setSortBy, viewMode, setViewMode }: {
    categorySlug?: string;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    handleSearch: () => void;
    showFilters: boolean;
    setShowFilters: (val: boolean) => void;
    sortBy: SortByProps | undefined;
    setSortBy: Dispatch<SetStateAction<SortByProps>>;
    viewMode: 'grid' | 'list';
    setViewMode: (val: 'grid' | 'list') => void;
}) => {


    function changeOrderProps(value: string): void {
        setSortBy({ way: sortBy?.way ? sortBy?.way : 'asc', orderProp: value })
    }

    function changeOrderWay(): void {
        setSortBy({ way: sortBy?.way === "asc" ? "desc" : "asc", orderProp: sortBy?.orderProp ? sortBy?.orderProp : 'name' })
    }

    return <div className="mb-8">
        {categorySlug && <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
            {categorySlug.replace("-", "").charAt(0).toUpperCase() + categorySlug.slice(1)} Products
        </h1>}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center lg:justify-between w-full">
            <div className="flex-1 flex max-w-md max-lg:w-full">
                <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-r-none border-r-0"
                />
                <Button onClick={handleSearch} className="rounded-l-none border-l-0">
                    <Search className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex gap-4 items-center">
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                >
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
                <Select value={sortBy?.orderProp} defaultValue='name' onValueChange={changeOrderProps}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Name A-Z</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex border rounded-md">
                    <Button
                        variant={sortBy?.way === 'desc' ? 'ghost' : 'default'}
                        size="sm"
                        onClick={changeOrderWay}
                    >
                        <ArrowUp className={cn("h-4 w-4", {
                            "rotate-180": sortBy?.way === "desc"
                        })} />
                    </Button>
                </div>
                <div className="flex border rounded-md">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
}
);
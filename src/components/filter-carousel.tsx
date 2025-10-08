"use client"

import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface FilterCarouselProps {
    value?: string | null;
    isLoading?: boolean;
    onSelect: (value: string | null) => void;
    data: {
        label: string;
        value: string;
    }[];
}


export default function FilterCarousel({ value, isLoading, onSelect, data }: FilterCarouselProps) {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!api) return

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        })
    }, [api])
    return (
        <div className="relative w-full">
            <div className={cn("absolute left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none",
                current === 1 && "hidden"
            )} />
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    dragFree: true,

                }}
                className="w-full px-12"
            >
                <CarouselContent className="-ml-3">
                    {!isLoading &&
                        <CarouselItem
                            onClick={() => onSelect(null)}
                            className="pe-2 basis-auto">
                            <Badge
                                variant={!value ? "default" : "secondary"}
                                className="rounded-md px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
                            >
                                <span className="select-none">All</span>
                            </Badge>
                        </CarouselItem>
                    }
                    {isLoading &&
                        Array.from({ length: 14 }).map((_, index) => (
                            <CarouselItem key={index} className="px-2 basis-auto">
                                <Skeleton className="rounded-md px-3 py-1 h-8 w-[100px]" />
                            </CarouselItem>
                        ))
                    }
                    {!isLoading && data.map((item) => (
                        <CarouselItem key={item.value} className="px-2 basis-auto" onClick={() => onSelect(item.value)}>
                            <Badge
                                variant={value === item.value ? "default" : "secondary"}
                                className="rounded-md px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
                            >
                                <span className="select-none">{item.label}</span>
                            </Badge>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="start-0 z-20" />
                <CarouselNext className="end-0 z-20" />
            </Carousel>
            <div className={cn("absolute right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none",
                current === count && "hidden"
            )} />
        </div>
    )
}

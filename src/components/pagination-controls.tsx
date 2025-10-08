'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationControlsProps = {
    currentPage: number
    totalPages: number
    hasMore: boolean
}

export function PaginationControls({
    currentPage,
    totalPages,
    hasMore
}: PaginationControlsProps) {
    const pathName = usePathname()
    const searchParams = useSearchParams()
    const { replace } = useRouter()

    function goToPage(page: number) {
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        replace(`${pathName}?${params.toString()}`)
    }

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button
                variant='outline'
                size='sm'
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                <ChevronLeft className="h-4 w-4 mr-1"/>
                Previous
            </Button>
            <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className="w-10"
                    >
                        {page}
                    </Button>
                ))}
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={!hasMore}
            >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
    )
}
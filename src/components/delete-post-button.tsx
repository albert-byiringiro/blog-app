'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Trash } from "lucide-react"
import { DialogTitle } from "@radix-ui/react-dialog"

type DeletePostButtonProps = {
    postId: string
    postTitle: string
}

export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete() {
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
            })

            const result = await response.json()

            if (!response.ok) {
                toast.error(result.error || 'Failed to delete post!')
                return;
            }

            toast.success('Post deleted successfully!')
            setIsOpen(false)

            router.push('/blog')
            router.refresh()
        } catch (error) {
            console.error('Error deleting post', error);
            toast.error('Something went wrong. Please try again.')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant='destructive' size='sm' className="cursor-pointer">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Post
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This will permanently delete post "{postTitle}".
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={() => setIsOpen(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='destructive'
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
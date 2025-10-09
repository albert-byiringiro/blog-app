import { PostsTabsClient } from "@/components/posts-tabs-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUserPosts } from "@/lib/posts";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Clock, FileText, TrendingUp } from "lucide-react";

export default async function MyPostsPage() {
    const { published, drafts, views, posts } = await getCurrentUserPosts()

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight mb-2">My Posts</h1>
                <p className="text-muted-foreground text-lg">Manage your blog posts and drafts</p>
            </div>

            {/* stats cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{posts?.length}</div>
                        <p className="text-xs text-muted-foreground">
                        All your content
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                        <Clock className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{drafts?.length}</div>
                        <p className="text-xs text-muted-foreground">
                        Work in progress
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{views?.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                        Coming soon
                        </p>
                    </CardContent>
                </Card>
            </div>
            
            <Separator className="mb-8" />
            
            {/* Client side tabs and search */}
            <PostsTabsClient posts={posts ?? []} />
        </div>
    )
}
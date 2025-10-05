import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      <h1 className="text-4xl font-bold">Next.js Blog Setup complete</h1>

      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Setup status</CardTitle>
          <CardDescription>
            Your Development is ready
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="space-y-2">
            <p className="text-sm">✅ Next.js 15 with App Router</p>
            <p className="text-sm">✅ TypeScript configured</p>
            <p className="text-sm">✅ Tailwind CSS installed</p>
            <p className="text-sm">✅ Shadcn UI components ready</p>
            <p className="text-sm">✅ Prisma configured for MongoDB</p>
          </div>
        </CardContent>

        <Button className="w-full">
          Ready for Part 2: Database Schema
        </Button>
      </Card>
    </main>
  );
}

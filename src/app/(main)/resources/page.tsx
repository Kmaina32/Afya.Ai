import Image from "next/image"
import Link from "next/link"
import { resourcesData } from "@/lib/resources-data"


export default function ResourcesPage() {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <header>
        <h1 className="text-3xl font-bold">Health Resource Library</h1>
        <p className="text-muted-foreground mt-1">
          Information on common health topics in Kenya and preventative care.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {resourcesData.map((resource) => (
          <Link href={`/resources/${resource.id}`} key={resource.id} className="block rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-lg">
            <div className="relative h-48 w-full">
              <Image 
                src={resource.image} 
                alt={resource.title}
                fill
                className="object-cover" 
                data-ai-hint={resource.hint}
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold">{resource.title}</h2>
              <p className="text-muted-foreground mt-2">{resource.content}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { resourcesData } from "@/lib/resources-data";

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  const resource = resourcesData.find((r) => r.id === params.id);

  if (!resource) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6">
       <Button asChild variant="ghost" className="mb-4">
         <Link href="/resources">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
         </Link>
       </Button>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{resource.title}</h1>
        <div className="relative h-96 w-full mb-6 rounded-lg overflow-hidden">
          <Image
            src={resource.image}
            alt={resource.title}
            fill
            className="object-cover"
            data-ai-hint={resource.hint}
          />
        </div>
        <div className="prose prose-lg max-w-none text-foreground/90">
             {resource.details.map((section, index) => (
                <div key={index} className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2 text-primary">{section.heading}</h2>
                    <p className="text-base leading-relaxed">{section.text}</p>
                </div>
             ))}
        </div>
      </div>
    </div>
  );
}

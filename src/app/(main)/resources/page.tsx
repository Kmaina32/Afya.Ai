import Image from "next/image"
import Link from "next/link"

const resources = [
  {
    id: "maternal-health",
    title: "Maternal and Child Health",
    image: "https://placehold.co/600x400.png",
    hint: "mother child",
    content: "Improving maternal and child health is a priority in Kenya. Access to skilled birth attendants, antenatal care, and postnatal care is crucial for reducing mortality rates.",
  },
  {
    id: "hiv-aids",
    title: "HIV/AIDS Prevention and Management",
    image: "https://placehold.co/600x400.png",
    hint: "red ribbon",
    content: "Kenya has made significant progress in the fight against HIV/AIDS. Key prevention strategies include consistent condom use, VMMC, and PrEP. Free ART is available at public health facilities.",
  },
  {
    id: "tb",
    title: "Tuberculosis (TB) Awareness",
    image: "https://placehold.co/600x400.png",
    hint: "lungs xray",
    content: "Tuberculosis remains a major public health concern. Symptoms include a persistent cough, fever, night sweats, and weight loss. Early diagnosis and treatment are vital.",
  },
  {
    id: "ncds",
    title: "Non-Communicable Diseases (NCDs)",
    image: "https://placehold.co/600x400.png",
    hint: "blood pressure",
    content: "Diseases like diabetes, hypertension, and cancer are on the rise. Healthy lifestyle choices and regular check-ups are key to prevention and early detection.",
  },
];


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
        {resources.map((resource) => (
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

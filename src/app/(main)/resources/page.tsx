import Image from "next/image"

const resources = [
  {
    id: "maternal-health",
    title: "Maternal and Child Health",
    image: "https://placehold.co/600x400.png",
    hint: "mother child",
    content: "Improving maternal and child health is a priority in Kenya. Access to skilled birth attendants, antenatal care (at least 4 visits), and postnatal care is crucial. The Linda Mama programme provides free maternity services in public hospitals.",
  },
  {
    id: "hiv-aids",
    title: "HIV/AIDS Prevention and Management",
    image: "https://placehold.co/600x400.png",
    hint: "red ribbon",
    content: "Kenya has made significant progress in the fight against HIV/AIDS. Consistent condom use, voluntary medical male circumcision (VMMC), and pre-exposure prophylaxis (PrEP) are key prevention strategies. Free antiretroviral therapy (ART) is available at public health facilities.",
  },
  {
    id: "tb",
    title: "Tuberculosis (TB) Awareness",
    image: "https://placehold.co/600x400.png",
    hint: "lungs xray",
    content: "Tuberculosis remains a major public health concern. Symptoms include a persistent cough (sometimes with blood), fever, night sweats, and weight loss. Diagnosis and treatment for TB are free in all public health facilities across Kenya.",
  },
  {
    id: "ncds",
    title: "Non-Communicable Diseases (NCDs)",
    image: "https://placehold.co/600x400.png",
    hint: "blood pressure",
    content: "Diseases like diabetes, hypertension, and cancer are on the rise. Healthy lifestyle choices, including a balanced diet, regular physical activity, and avoiding tobacco and excessive alcohol, can significantly reduce your risk. Regular check-ups are vital for early detection.",
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
          <div key={resource.id} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
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
          </div>
        ))}
      </div>
    </div>
  );
}

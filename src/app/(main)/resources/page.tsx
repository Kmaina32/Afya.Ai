import Image from "next/image"

const resources = [
  {
    id: "malaria",
    title: "Malaria Prevention and Treatment",
    image: "https://placehold.co/600x400.png",
    hint: "mosquito net",
    content: "Malaria is a life-threatening disease caused by parasites that are transmitted to people through the bites of infected female Anopheles mosquitoes. It is preventable and curable. Key prevention methods include using insecticide-treated mosquito nets and indoor residual spraying.",
  },
  {
    id: "nutrition",
    title: "Balanced Diet and Nutrition",
    image: "https://placehold.co/600x400.png",
    hint: "healthy food",
    content: "A balanced diet is crucial for good health. In Kenya, this means including a variety of local foods like ugali, sukuma wiki, githeri, and fresh fruits. Ensure your meals have a mix of carbohydrates, proteins, and vitamins to boost your immune system.",
  },
  {
    id: "hygiene",
    title: "Water, Sanitation, and Hygiene (WASH)",
    image: "https://placehold.co/600x400.png",
    hint: "clean water",
    content: "Access to clean water and practicing good hygiene are essential to prevent diseases like cholera and typhoid. Always wash your hands with soap and clean water, especially before eating and after using the toilet. Drink boiled or treated water to avoid waterborne illnesses.",
  },
  {
    id: "vaccination",
    title: "Childhood Immunization",
    image: "https://placehold.co/600x400.png",
    hint: "child vaccine",
    content: "Vaccination is a safe and effective way to protect children from serious diseases. The Kenyan Ministry of Health provides a schedule of recommended vaccines for children, including those for polio, measles, and tetanus. Ensure your child completes their full immunization schedule.",
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

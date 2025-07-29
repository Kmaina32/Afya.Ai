
export type EmergencyService = {
  category: string;
  services: {
    name: string;
    description: string;
    phone: string[];
    website?: string;
  }[];
};

export const emergencyServicesData: EmergencyService[] = [
  {
    category: "Medical Emergencies & Ambulance",
    services: [
      {
        name: "St John Ambulance",
        description: "Provides ambulance services, first aid training, and disaster response.",
        phone: ["0721225285", "999"],
        website: "https://stjohnkenya.org/",
      },
      {
        name: "Kenya Red Cross",
        description: "Offers emergency medical services, ambulance services, and humanitarian aid.",
        phone: ["1199", "0703037000"],
        website: "https://www.redcross.or.ke/",
      },
      {
        name: "AAR Healthcare",
        description: "Private ambulance services and emergency medical response.",
        phone: ["0703063000", "0730633000"],
        website: "https://www.aarhealthcare.com/ke/",
      },
    ],
  },
  {
    category: "Mental Health & Suicide Prevention",
    services: [
      {
        name: "Befrienders Kenya",
        description: "Provides emotional support to those in distress or feeling suicidal.",
        phone: ["0722178177"],
        website: "https://www.befrienderskenya.org/",
      },
      {
        name: "Niskize",
        description: "A 24/7 toll-free mental health helpline for support and counseling.",
        phone: ["1190"],
      },
       {
        name: "Mental Health Hotline (Kenya)",
        description: "A 24-hour toll-free helpline for mental health emergencies and support.",
        phone: ["1199 (Option 5)"],
      },
    ],
  },
  {
    category: "Gender-Based Violence (GBV) Support",
    services: [
      {
        name: "National GBV Hotline",
        description: "A 24/7 toll-free hotline (Policare) for reporting and getting help for gender-based violence.",
        phone: ["1195"],
      },
      {
        name: "FIDA Kenya",
        description: "Provides free legal aid to women and children who are victims of violence and abuse.",
        phone: ["0722509760"],
        website: "https://www.fidakenya.org/",
      },
       {
        name: "Wangu Kanja Foundation",
        description: "Offers support and safe houses for survivors of sexual violence.",
        phone: ["0722703388"],
        website: "https://wangukanjafoundation.org/",
      },
    ],
  },
  {
    category: "Child Protection & Helplines",
    services: [
      {
        name: "Childline Kenya",
        description: "A national 24-hour toll-free helpline for children in any kind of distress.",
        phone: ["116"],
        website: "https://www.childlinekenya.co.ke/",
      },
      {
        name: "Department of Children's Services",
        description: "Government body responsible for the protection, welfare, and rights of children.",
        phone: ["+254-20-2228558"],
      },
    ],
  },
];


export type Vaccine = {
  name: string;
  dose: string;
  ageInWeeks: number;
  description: string;
};

export const kenyanVaccinationSchedule: Vaccine[] = [
  {
    name: "BCG",
    dose: "1st Dose",
    ageInWeeks: 0,
    description: "Protects against Tuberculosis (TB). Given at birth.",
  },
  {
    name: "Oral Polio Vaccine (OPV)",
    dose: "Birth Dose (OPV-0)",
    ageInWeeks: 0,
    description: "Protects against Polio. Given at birth.",
  },
  {
    name: "Oral Polio Vaccine (OPV)",
    dose: "1st Dose",
    ageInWeeks: 6,
    description: "Protects against Polio.",
  },
  {
    name: "DPT-HepB-Hib (Pentavalent)",
    dose: "1st Dose",
    ageInWeeks: 6,
    description: "Protects against Diphtheria, Tetanus, Pertussis, Hepatitis B, and Haemophilus influenzae type b.",
  },
  {
    name: "Pneumococcal Vaccine (PCV)",
    dose: "1st Dose",
    ageInWeeks: 6,
    description: "Protects against diseases caused by pneumococcal bacteria like pneumonia and meningitis.",
  },
  {
    name: "Rotavirus Vaccine",
    dose: "1st Dose",
    ageInWeeks: 6,
    description: "Protects against rotavirus, a common cause of severe diarrhea in children.",
  },
  {
    name: "Oral Polio Vaccine (OPV)",
    dose: "2nd Dose",
    ageInWeeks: 10,
    description: "Protects against Polio.",
  },
  {
    name: "DPT-HepB-Hib (Pentavalent)",
    dose: "2nd Dose",
    ageInWeeks: 10,
    description: "Protects against Diphtheria, Tetanus, Pertussis, Hepatitis B, and Haemophilus influenzae type b.",
  },
  {
    name: "Pneumococcal Vaccine (PCV)",
    dose: "2nd Dose",
    ageInWeeks: 10,
    description: "Protects against diseases caused by pneumococcal bacteria.",
  },
  {
    name: "Rotavirus Vaccine",
    dose: "2nd Dose",
    ageInWeeks: 10,
    description: "Protects against rotavirus.",
  },
  {
    name: "Oral Polio Vaccine (OPV)",
    dose: "3rd Dose",
    ageInWeeks: 14,
    description: "Protects against Polio.",
  },
  {
    name: "DPT-HepB-Hib (Pentavalent)",
    dose: "3rd Dose",
    ageInWeeks: 14,
    description: "Protects against Diphtheria, Tetanus, Pertussis, Hepatitis B, and Haemophilus influenzae type b.",
  },
  {
    name: "Pneumococcal Vaccine (PCV)",
    dose: "3rd Dose",
    ageInWeeks: 14,
    description: "Protects against diseases caused by pneumococcal bacteria.",
  },
  {
    name: "Inactivated Polio Vaccine (IPV)",
    dose: "1st Dose",
    ageInWeeks: 14,
    description: "Provides additional protection against Polio.",
  },
  {
    name: "Measles-Rubella",
    dose: "1st Dose",
    ageInWeeks: 39, // 9 months
    description: "Protects against Measles and Rubella.",
  },
  {
    name: "Yellow Fever",
    dose: "1st Dose",
    ageInWeeks: 39, // 9 months
    description: "Protects against Yellow Fever (given in high-risk areas).",
  },
  {
    name: "Measles-Rubella",
    dose: "2nd Dose",
    ageInWeeks: 78, // 18 months
    description: "Booster dose to ensure full protection against Measles and Rubella.",
  },
];

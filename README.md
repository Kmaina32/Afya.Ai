# Afya.Ai: AI-Powered Health Guidance for Kenya

**Author:** George Kairu Maina  
**Repository:** [https://github.com/Kmaina32/Afya.Ai](https://github.com/Kmaina32/Afya.Ai)

---

## 1. Introduction: The Mission of Afya.Ai

**Afya.Ai** is a revolutionary, AI-powered mobile-first web application designed to democratize access to essential health information and services for every Kenyan. Our mission is to bridge the gap in healthcare accessibility by providing a reliable, intuitive, and comprehensive digital health companion. In a nation where access to qualified medical advice can be challenging due to geographical and financial barriers, Afya.Ai empowers users to make informed decisions about their health, promoting preventative care and improving overall well-being.

This platform is more than just an app; it's a vital tool for health literacy and a first step towards a healthier future for Kenya.

---

## 2. The Problem: Healthcare Challenges in Kenya

Access to timely and accurate health information is a critical challenge for millions in Kenya. The current landscape is marked by:
*   **Information Scarcity:** Reliable health resources are often difficult to find, leading to a reliance on informal advice or misinformation.
*   **Overburdened Health System:** Public health facilities are often overwhelmed, resulting in long wait times and limited one-on-one consultation.
*   **Geographical Barriers:** For individuals in rural and remote areas, reaching a healthcare facility is a significant logistical and financial challenge.
*   **High Costs of Consultation:** The cost of private consultations can be prohibitive for a large segment of the population.

These factors contribute to delayed diagnoses, poor management of chronic conditions, and a reactive rather than proactive approach to personal health.

---

## 3. Our Solution: An All-in-One Digital Health Platform

Afya.Ai directly addresses these challenges by leveraging cutting-edge AI technology to provide users with a suite of powerful, free, and easy-to-use tools:

*   **Instant, AI-Powered Guidance:** Get immediate answers to health questions and analyze symptoms from the comfort of your home.
*   **Centralized Health Services:** Find and connect with healthcare facilities across all 47 counties in Kenya.
*   **Personalized & Accessible Content:** Access a library of health resources and engage with a chatbot that understands text, image, and voice inputs.

By placing these tools in the hands of the people, Afya.Ai reduces the burden on the formal healthcare system and empowers individuals to become active participants in their own healthcare journey.

---

## 4. Key Features

Afya.Ai is packed with features designed to meet the diverse needs of our users:

*   **AI Health Chatbot:**
    *   **Conversational Q&A:** Ask any health-related question and receive clear, informative answers.
    *   **Image Diagnosis:** Upload a photo of a health concern (e.g., a skin rash) for an AI-powered analysis and possible diagnosis.
    *   **Voice Interaction:** Engage with the chatbot using voice commands and receive spoken responses, ensuring accessibility for all users.
*   **AI Symptom Checker:**
    *   Enter a list of symptoms and receive a curated list of possible medical conditions, helping you understand potential issues and when to seek professional care.
*   **Comprehensive Healthcare Directory:**
    *   A searchable directory of healthcare facilities across all **47 counties** in Kenya.
    *   Filter facilities by county to easily find what you need.
    *   **One-tap actions:** "Call Now" to initiate a phone call and "Get Directions" to open the location in Google Maps.
*   **Health Resource Library:**
    *   A curated collection of articles on common health topics relevant to Kenya, such as Maternal Health, HIV/AIDS, TB, and NCDs.
    *   Each topic opens into a detailed page for in-depth information.
*   **Secure User Profiles:**
    *   Users can create a secure account to manage their personal information.
    *   Save essential details like Date of Birth, Location (with user permission), and optional emergency contacts (Next of Kin).
*   **Robust Authentication:**
    *   Secure user sign-up and sign-in using Firebase Authentication, ensuring data privacy and security.

---

## 5. Technology Stack

Afya.Ai is built on a modern, scalable, and robust technology stack, ensuring a high-quality user experience and maintainability.

*   **Frontend:** [Next.js](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **UI/Styling:** [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
*   **AI & Generative Features:** [Google's Genkit](https://firebase.google.com/docs/genkit), [Gemini Models](https://deepmind.google/technologies/gemini/)
*   **Backend & Authentication:** [Firebase](https://firebase.google.com/) (Authentication, Hosting)
*   **Deployment:** [Firebase App Hosting](https://firebase.google.com/), [Vercel](https://vercel.com/)

---

## 6. Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Kmaina32/Afya.Ai.git
    cd Afya.Ai
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of the project by copying the example from `.env`. You will need to add your Firebase project configuration keys and Gemini API Key here.
    ```
    # .env.local

    # Your Firebase Web App's API Key
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_WEB_API_KEY"

    # Your Gemini API Key from Google AI Studio
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```

4.  **Run the development server:**
    The application runs on port `9002`.
    ```sh
    npm run dev
    ```

5.  **Run the Genkit development server:**
    In a separate terminal, start the Genkit AI flows.
    ```sh
    npm run genkit:watch
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

### Deploying to Vercel

When deploying to Vercel, you must set the environment variables in the Vercel project settings:
1.  Go to your project's **Settings > Environment Variables**.
2.  Add `NEXT_PUBLIC_FIREBASE_API_KEY` with the API key from your Firebase web app config.
3.  Add `GEMINI_API_KEY` with your Gemini API key.
4.  Redeploy the application for the changes to take effect.

README.txt 
" GUIDE TO RUNNING THE PROJECT "
STEP 1.clone the repo -> cd wealthwarp ->  run npm dev -> GO TO http://localhost:3000
STEP 2. on landing page -> log in using google email id -> take you to the website dashboard and side bar which has the feaature components 

THE VIDEO LINK TO DEMO VIDEO WE UPLOADED ON GOOGLE DRIVE -> https://drive.google.com/file/d/1_7LdZEOzO_968-GoqXEi46MB8g5Fh3Ei/view?usp=sharing

🧩** Dependencies**
**Runtime**
@radix-ui/react-checkbox ^1.1.5
@radix-ui/react-label ^2.1.3
@radix-ui/react-select ^2.1.7
@radix-ui/react-slot ^1.2.0
@supabase/auth-helpers-nextjs ^0.10.0
@supabase/supabase-js ^2.49.4
class-variance-authority ^0.7.1
clsx ^2.1.1
lucide-react ^0.487.0
next 15.3.0
openai ^4.93.0
react ^19.0.0
react-dom ^19.0.0
recharts ^2.15.2
tailwind-merge ^3.2.0
tailwind-variants ^1.0.0
tw-animate-css ^1.2.5

**Development**
@tailwindcss/postcss ^4
@types/node ^20
@types/react ^19
@types/react-dom ^19
tailwindcss ^4
typescript ^5

✅ Project Setup & Architecture
Initialized the project using Next.js for building a fast and scalable frontend.

Integrated Supabase for authentication and database functionalities.

Created the foundational structure of the Next.js app inside the main project folder, following best practices for scalability and maintainability.

🧩 Folder Structure & Components
Developed the landing page and feature-specific pages (page.tsx) within src/app/, structured with appropriate routing and layout.

Built a modular design system using reusable UI components inside src/components/ui/.

Ensured all components were cleanly imported and organized to promote reusability and clean code standards.

🔐 Authentication & Environment Setup
Enabled Google OAuth authentication via Supabase.

Created and configured Google Cloud Console credentials and linked them to the Supabase project.

Stored sensitive API keys (Google and Supabase) in .env.local and ensured the file was added to .gitignore for security and version control best practices.

🗄️ Database Integration
Designed and created Supabase tables to persist user interactions and data dynamically from various components in the application.

Ensured secure and efficient communication with Supabase using a centralized client (lib/supabaseClient.tsx), which is imported and utilized across features.

AI Integration
Open AI api is used for deriving the conclusions and inferences.
It is used to make visualizations of data and gather insights


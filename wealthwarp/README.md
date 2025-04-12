README.txt 

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



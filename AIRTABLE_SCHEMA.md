# Airtable Base Schema

This document outlines the required schema for the Airtable base that powers this portfolio website. Ensure your Airtable base has the following tables and fields with the specified types for the application to function correctly.

---

### 1. Table: `SiteSettings`
This table should have only **one record** containing global site settings.

- `siteTitle` (Single line text)
- `heroHeadline` (Single line text)
- `heroTagline` (Single line text)
- `heroIntro` (Long text)
- `footerText` (Single line text)
- `socialGithub` (URL)
- `socialTwitter` (URL)
- `socialLinkedIn` (URL)
- `socialSubstack` (URL)
- `socialEmail` (Email)

---

### 2. Table: `About`
This table should also have only **one record** for the content of your "About" page.

- `headline` (Single line text)
- `shortText` (Long text) - *Used for the homepage preview.*
- `fullText` (Long text) - *Use `\n` to create paragraph breaks.*
- `highlightArchitecture` (Long text)
- `highlightWeb3` (Long text)
- `highlightWriting` (Long text)
- `highlightCommunity` (Long text)
- `profileImageId` (Single line text) - *Matches an ID from `src/lib/placeholder-images.json`.*

---

### 3. Table: `Projects`
Each record in this table represents a project in your portfolio.

- `slug` (Single line text) - *A unique, URL-friendly identifier (e.g., `serene-residence`).*
- `title` (Single line text)
- `category` (Single select) - *Options: `Architecture`, `Web3`, `Writing`, `Community`.*
- `description` (Long text) - *A short summary for the project card.*
- `imageId` (Single line text) - *An ID from `placeholder-images.json`.*
- `galleryImageIds` (Single line text) - *Comma-separated IDs (e.g., `img1,img2,img3`).*
- `link` (URL) - *Link to the live project, if available.*
- `role` (Single line text)
- `duration` (Single line text)
- `technologies` (Single line text) - *Comma-separated list (e.g., `Next.js,Genkit`).*
- `overview` (Long text)
- `process` (Long text)
- `outcomes` (Long text)
- `featured` (Checkbox) - *Check this to feature the project on the homepage.*

---

### 4. Table: `Journal`
Each record represents a journal post.

- `title` (Single line text)
- `category` (Single select) - *Options: `Reflections`, `Experiments`, `Design Notes`.*
- `description` (Long text)
- `imageId` (Single line text) - *An ID from `placeholder-images.json`.*
- `link` (URL) - *Link to the full article (e.g., on Substack).*

---

### 5. Table: `Skills`
Each record is a single skill. The website will group them by category.

- `name` (Single line text) - *The name of the skill (e.g., `React`).*
- `category` (Single select) - *Options: `Architecture & Design`, `Web3 & Development`, `Writing & Community`.*

---

### 6. Table: `CV_Experience`
Each record is a job or work experience item.

- `date` (Single line text) - *e.g., `2022 - Present`.*
- `title` (Single line text) - *Your role.*
- `subtitle` (Single line text) - *The company name.*
- `description` (Long text)

---

### 7. Table: `CV_Education`
Each record is an education item.

- `date` (Single line text) - *e.g., `2018 - 2022`.*
- `title` (Single line text) - *Your degree or qualification.*
- `subtitle` (Single line text) - *The institution name.*
- `description` (Long text)

---

### 8. Table: `Contact`
This table should have only **one record** for the contact section content.

- `introText` (Single line text)
- `ctaLine` (Long text)

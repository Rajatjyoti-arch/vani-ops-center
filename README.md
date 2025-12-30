VANI: Verifiable Anonymous Network Intelligence
VANI is a next-generation Institutional Governance and Risk Management platform designed to bridge the gap between student anonymity and administrative accountability. By leveraging Zero-Knowledge Architecture and Multi-Agent AI Negotiation, VANI provides a secure, mathematical framework for conflict resolution and campus welfare analytics.

🏗 System Architecture
VANI operates on a dual-portal system to ensure distinct workflows for all stakeholders:

1. The Student Service Portal (Anonymous Credentialing)
Zero-Knowledge Entry: Students access the system via a locally-generated Private Governance Key.

Cryptographic Anonymization: The system utilizes SHA-256 hashing on the client-side, ensuring that no personally identifiable information (PII) ever reaches the server.

Encrypted Repository: Submissions are stored in an Encrypted Evidence Repository where data is tied to the unique cryptographic hash, not a student identity.

2. The Administrative Oversight Dashboard
Role-Based Access Control (RBAC): Authorized personnel access a high-level oversight suite via secure Multi-Factor Authentication (MFA).

Institutional Sentiment Analytics: A geospatial heat map provides real-time data on campus welfare trends and high-risk areas.

Governance Resolution Matrix: A multi-agent AI environment where Synthetic Proxies negotiate solutions based on real-world institutional policy constraints.

🚀 Key Features
Autonomous Negotiation Matrix: Powered by Google Gemini 1.5 Pro, the system models compromises between 'Sentinel' (Student Advocate) and 'Governor' (Admin) proxies to reach an equitable consensus.

Automated Disclosure Protocol: A built-in accountability mechanism (the "Dead-Man's Switch") that ensures critical safety data is addressed within a set timeframe.

Compliance & Transparency Log: A verifiable, read-only ledger of resolved cases and issued Resolution Certificates.

VANI Administrative Assistant: A persistent, Gemini 1.5 Flash-powered AI officer that guides users through institutional protocols and data privacy standards.

🛠 Tech Stack
Frontend: React.js / Tailwind CSS.

Backend & Database: Supabase (PostgreSQL) with Row-Level Security (RLS) policies.

Artificial Intelligence: Google Gemini 1.5 Pro (Logic) & Gemini 1.5 Flash (Interface Assistant).

Cryptography: Client-side SHA-256 Hashing and AES-256 Evidence Encryption.

🛡 Security & Privacy Statement
VANI is built on the principle of Inherent Privacy.

Identity Obfuscation: Student IDs are hashed locally; the original ID is never transmitted or stored.

Unbreakable Anonymity: Because the private key never leaves the student's device, it is mathematically impossible for administrators or developers to trace a report back to an individual.

Data Integrity: Every resolution is cryptographically signed and stored in a transparent compliance log to prevent tampering.

⚙️ Installation & Setup
Clone the Repository: git clone https://github.com/your-username/vani-governance.git

Environment Variables: Configure your .env file with your Supabase URL, Anon Key, and Gemini API Key.

Database Migration: Run the provided SQL schema in the Supabase SQL Editor to initialize the Governance and Sentiment tables.

📄 Disclaimer
This platform is intended for institutional governance and risk management. It is designed to supplement, not replace, existing legal and administrative procedures.[Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

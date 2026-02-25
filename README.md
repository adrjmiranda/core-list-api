# CoreList API 📇

**CoreList API** is a high-performance, multi-tenant contact management system designed for scalability and data integrity. This project serves as a cornerstone of my professional portfolio, demonstrating advanced Node.js patterns and a commitment to code quality.

Developed by **[Adriano Miranda](https://github.com/adrjmiranda)**.

---

## 🎯 Project Overview

CoreList goes beyond a simple contact list. It implements a **Multi-tenancy Lite** architecture, ensuring that each user has a completely isolated environment. The project is built with a "Zero Any, Zero Undefined" policy, leveraging TypeScript's strictest settings to prevent runtime errors.

### 🚀 Key Features (In Development)

- **Multi-tenancy**: Secure data isolation at the database level.
- **Rich Contact Profiles**: Support for multiple addresses, social media links, and avatars.
- **Advanced Organization**: Dynamic tagging system and contact grouping.
- **Audit Logging**: Full traceability of changes (who, when, and what changed).
- **Audit-Ready Validation**: Strict input validation using Zod.
- **Full Dockerization**: One-command setup for both API and Database.

## 🛠 Tech Stack

| Layer          | Technology                 |
| -------------- | -------------------------- |
| **Runtime**    | Node.js (v20+)             |
| **Framework**  | Fastify (High Performance) |
| **Language**   | TypeScript (Strict Mode)   |
| **Database**   | PostgreSQL                 |
| **ORM**        | Prisma                     |
| **Validation** | Zod                        |
| **Infra**      | Docker & Docker Compose    |

## 🏗 Engineering Standards

To ensure a maintainable and professional codebase, I follow these principles:

- **Layered Architecture**: Separation of concerns between Controllers, Services, and Repositories.
- **Zero `any` Policy**: 100% type coverage to ensure type safety.
- **Clean Commits**: Strict adherence to lowercase headers and no-period rules.
- **English Codebase**: All variables, functions, and documentation are written in English.

---

## 📦 Getting Started

### Prerequisites

- Docker & Docker Compose installed.

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/adrjmiranda/core-list-api.git](https://github.com/adrjmiranda/core-list-api.git)
   ```
2. Set up your environment variables (copying from `.env.example`).

3. Start the entire stack:
   ```bash
   docker-compose up -d
   ```

The API will be available at `http://localhost:3333/v1`.

# NoteBase - A Multi-Tenant SaaS Notes Application

This project is a multi-tenant SaaS application that allows different companies (tenants) to securely manage their notes and users. [cite_start]The application is built with a Node.js/Express backend and a React/Vite frontend and is deployed on Vercel[cite: 3, 31, 35].

## Live URLs

* **Frontend**: `[Paste your live Vercel frontend URL here]`
* **Backend**: `[Paste your live Vercel backend URL here]`

## Key Features

* [cite_start]**Multi-Tenancy**: Secure data isolation between different tenants (e.g., Acme and Globex)[cite: 7, 8].
* [cite_start]**JWT Authentication**: Secure login and session management using JSON Web Tokens[cite: 12].
* **Role-Based Access Control**:
    * [cite_start]**Admin**: Can invite users and upgrade the tenant's subscription plan[cite: 13].
    * [cite_start]**Member**: Can create, view, edit, and delete their own notes[cite: 13].
* **Subscription Gating**:
    * [cite_start]**Free Plan**: Limited to a maximum of 3 notes per tenant[cite: 20].
    * [cite_start]**Pro Plan**: Allows for unlimited notes[cite: 21].
* [cite_start]**Full CRUD API** for managing notes, with all endpoints enforcing tenant isolation[cite: 24, 25, 26, 27, 28, 29].

## Multi-Tenancy Approach

[cite_start]This application uses a **Shared Schema with a Tenant ID** approach to achieve multi-tenancy[cite: 9, 10].

* **Database Structure**: A single database and schema are used for all tenants.
* **Data Isolation**: Every collection that contains tenant-specific data (e.g., `notes` and `users`) has a mandatory `tenantId` field. This field acts as a foreign key, linking each record to a specific tenant in the `tenants` collection.
* **Enforcement**: Data isolation is strictly enforced at the API level. A middleware function inspects the authenticated user's JWT, identifies their `tenantId`, and automatically adds a `WHERE tenantId = :userTenantId` filter to every database query. [cite_start]This ensures that a user can only ever access data belonging to their own tenant[cite: 8].

## Tech Stack

* **Backend**: Node.js, Express, Mongoose, JWT, Bcrypt.js
* **Frontend**: React, Vite, Tailwind CSS, React Router
* **Database**: MongoDB Atlas
* **Deployment**: Vercel

## Setup and Running Locally

1.  **Backend**:
    ```bash
    cd "NoteBase Backend"
    npm install
    # Add your credentials to a .env file
    npm run seed
    npm run dev
    ```
2.  **Frontend**:
    ```bash
    cd "NoteBase Frontend"
    npm install
    npm run dev
    ```

## Mandatory Test Accounts

[cite_start]All accounts use the password: `password`.

* [cite_start]`admin@acme.test` (Role: Admin, Tenant: Acme) [cite: 15]
* [cite_start]`user@acme.test` (Role: Member, Tenant: Acme) [cite: 16]
* [cite_start]`admin@globex.test` (Role: Admin, Tenant: Globex) [cite: 17]
* [cite_start]`user@globex.test` (Role: Member, Tenant: Globex) [cite: 18]
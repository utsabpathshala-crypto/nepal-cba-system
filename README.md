# Nepal Continuous Assessment ERP System

> A modern School ERP System for Nepal implementing the Continuous Assessment (CBA) framework based on the National Curriculum Framework.

---

## Project Overview

The Nepal Continuous Assessment ERP System is a full-featured school management platform designed to help schools manage:

- Master Data
- School & Campus Management
- Students
- Teachers & Employees
- Academic Structure
- Curriculum
- Continuous Assessment (CBA)
- Attendance
- Report Cards
- Notifications
- Audit Logs
- System Administration

The goal is to provide a scalable, maintainable, and production-ready ERP system for Nepali schools.

---

## Technology Stack

### Frontend

- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS
- Lucide React Icons

### Backend

- PostgreSQL
- Prisma ORM

### Development

- Git
- GitHub

---

## Current Project Status

### ✅ Completed

- PostgreSQL database setup
- Prisma ORM integration
- Initial database schema
- Database migrations
- Geography seed data
- Responsive dashboard
- Dashboard statistics
- Reusable UI components
- Standard project architecture
- GitHub repository
- Project documentation

### 🚧 In Progress

- Master Data Module

### 📋 Planned

- School Management
- Academic Structure
- Student Management
- Teacher Management
- Curriculum Management
- Continuous Assessment
- Attendance
- Report Cards
- Notifications
- Audit Logs
- System Settings

---

## Current Features

### Dashboard

- Live database statistics
- Database connection status
- Migration status
- Geography seed verification
- Responsive design

### Geography Master Data

Seeded data includes:

- 4 Municipality Types
- 7 Provinces
- 77 Districts
- 753 Local Levels

---

## Project Structure

```text
app/
components/
docs/
lib/
prisma/
public/
```

---

## Documentation

Project documentation is available in the `docs/` directory.

- AI Development Guide
- Project Roadmap
- Database Documentation
- Setup Guide
- Changelog

---

## Development Principles

This project follows:

- Mobile-first responsive design
- Reusable components
- Modular architecture
- TypeScript strict typing
- Prisma best practices
- Production-quality code
- Clean project structure

---

## Installation

Clone the repository:

```bash
git clone https://github.com/utsabpathshala-crypto/nepal-cba-system.git
```

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Development Roadmap

```
Foundation
    ✅ Database
    ✅ Prisma
    ✅ Seed
    ✅ Dashboard

↓

Master Data

↓

School Management

↓

Academic Structure

↓

Student Management

↓

Teacher Management

↓

Continuous Assessment

↓

Attendance

↓

Report Cards

↓

System Administration
```

---

## License

This project is currently under active development.

---

## Author

Developed by **Utsab Pathshala** with AI-assisted development using ChatGPT and Claude.

---

## Project Vision

To build a modern, scalable, and user-friendly ERP system that supports Nepal's Continuous Assessment framework while reducing administrative workload for schools.
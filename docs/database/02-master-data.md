# Nepal Continuous Student Assessment System (NCAS)

# Database Documentation

## Module 02 - Master Data

Version: 1.0

Status: Approved

---

# Purpose

The Master Data Module contains all reference data used throughout the system.

Instead of storing text values such as:

- Koshi
- Sunsari
- Barahakshetra

the application stores IDs referencing master tables.

This ensures:

- Data consistency
- Fast searching
- No spelling mistakes
- Easy reporting
- Easy maintenance

---

# Objectives

The Master Data module provides:

- Nepal Administrative Structure
- Academic Reference Data
- Personal Information Reference Data
- Assessment Reference Data
- System Reference Data

---

# Nepal Administrative Structure

Province

District

Local Level

Municipality Type

Ward Number

These tables will be used by:

- School
- Campus
- Student
- Parent
- Teacher

---

# Academic Reference

Grade

Academic Year Type

Academic Term Type

Education Level

School Type

Language

---

# Personal Reference

Gender

Religion

Blood Group

Nationality

Mother Tongue

---

# Assessment Reference

Assessment Level

Performance Level

Attendance Status

Promotion Status

---

# System Reference

User Status

Role Type

Permission Type

Notification Type

Audit Action

---

# Database Design Rules

Every master table will contain:

UUID Primary Key

English Name

Nepali Name

Code

Display Order

Active Status

Created Date

Updated Date

---

# UUID

Every table uses UUID as Primary Key.

Reason:

- Better security
- Easier synchronization
- Multi-school support
- Cloud ready

---

# Seed Data

The application will automatically insert:

7 Provinces

77 Districts

753 Local Levels

Municipality Types

Languages

Religions

Blood Groups

Nationalities

Grades

Academic Types

Assessment Levels

Attendance Status

Promotion Status

---

# Future Expansion

The Master Data module is designed to support:

Grade 11

Grade 12

Additional Languages

New Assessment Policies

Additional School Types

without database redesign.

---

Status

Locked

Approved for Development
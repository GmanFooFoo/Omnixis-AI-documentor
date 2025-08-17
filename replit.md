# DocuAI - Automated OCR & Document Processing Platform

## Overview

DocuAI is a modern web application that provides AI-powered OCR and document processing capabilities. The platform allows users to upload documents (PDF, DOCX, images), automatically extract text and images using Mistral AI, store files securely in Supabase, and manage the entire processing pipeline through a clean React-based interface. Built with a full-stack TypeScript architecture, the application emphasizes real-time processing updates and enterprise-grade document management.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preferences: FontAwesome color-coded file icons strongly preferred over generic DocumentTypeIcon component for documents page (red PDF, blue Word, green Excel, etc.)
Navigation preference: Move Storybook/Design System to separate page under Settings navigation entry.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server
- **TanStack Query** for server state management and caching
- **Wouter** for client-side routing
- **shadcn/ui** component library with Radix UI primitives
- **Tailwind CSS** for styling with custom design tokens

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with structured error handling
- **Multer** for file upload handling with memory storage
- **Session-based authentication** using connect-pg-simple
- **PostgreSQL** database with Drizzle ORM for type-safe queries

### Authentication System
- **Replit Auth** integration using OpenID Connect
- Session management with PostgreSQL storage
- Middleware-based route protection
- User profile management with automatic session updates

### Database Design
- **PostgreSQL** (primary) - Document metadata, user data, processing queue, vector embeddings
- **Supabase Storage** - Cloud file storage for documents and extracted images
- **Vector Database** - PostgreSQL with vector extension for semantic search
- Core tables: users, documents, extracted_images, vector_embeddings, processing_queue
- Session storage table for authentication
- Comprehensive document metadata tracking
- Processing queue for async task management

### Storage Architecture
- **Primary Database**: Replit PostgreSQL database for all data (documents, users, vectors, files)
- **File Storage**: PostgreSQL BYTEA fields for document and image storage (base64 encoded)
- **Vector Storage**: PostgreSQL with vector embeddings stored as real arrays
- **Session Storage**: PostgreSQL table for authentication sessions
- **Unified Storage**: Everything stored in single Replit database for simplicity

### File Processing Pipeline
- **Mistral AI Document AI** with structured annotations for OCR text extraction and intelligent image analysis
- BBox annotations for detecting and describing charts, diagrams, signatures, and other visual elements
- Document annotations for extracting structured data, entities, and document classification
- **Supabase Storage** for secure file and image hosting with unique naming
- Async processing queue with real-time status tracking
- Vector embeddings generation for semantic search capabilities
- Support for PDF, DOCX, PNG, JPEG, and TIFF files up to 50MB

### UI/UX Design
- Modern, clean interface with dark/light theme support
- Responsive design optimized for desktop and mobile
- Real-time processing status indicators
- Drag-and-drop file upload with progress tracking
- Dashboard with analytics and document management

## External Dependencies

### Core Services
- **Mistral AI API** - OCR text extraction and image analysis
- **Supabase** - Cloud storage for documents and extracted images
- **PostgreSQL** - Primary database (configured for Neon)
- **Replit Auth** - User authentication and session management

### Development Tools
- **Vite** - Frontend build tool and development server
- **Drizzle Kit** - Database migration and schema management
- **ESBuild** - Server-side bundling for production
- **TSX** - TypeScript execution for development

### UI Libraries
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **React Hook Form** - Form state management
- **Zod** - Runtime type validation
- **Class Variance Authority** - Component variant styling
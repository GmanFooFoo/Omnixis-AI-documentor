# DocuAI - Automated OCR & Document Processing Platform

## Overview

DocuAI is a modern web application that provides AI-powered OCR and document processing capabilities. The platform allows users to upload documents (PDF, DOCX, images), automatically extract text and images using Mistral AI, store files securely in Supabase, and manage the entire processing pipeline through a clean React-based interface. Built with a full-stack TypeScript architecture, the application emphasizes real-time processing updates and enterprise-grade document management.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preferences: FontAwesome color-coded file icons strongly preferred over generic DocumentTypeIcon component for documents page (red PDF, blue Word, green Excel, etc.)
Accessibility preference: Enhanced color contrast for file type icons and UI elements for WCAG compliance
Navigation preference: Settings tiles sorted alphabetically (A-Z order)
LLM Models page design: Must match Documents page layout with list view, search, and stats cards

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
- **PostgreSQL** (primary) - Document metadata, user data, processing queue, vector embeddings, LLM configurations
- **Supabase Storage** - Cloud file storage for documents and extracted images
- **Vector Database** - PostgreSQL with vector extension for semantic search
- Core tables: users, documents, extracted_images, vector_embeddings, processing_queue, llm_providers, llm_models, user_llm_configs
- Session storage table for authentication
- Comprehensive document metadata tracking
- Processing queue for async task management
- LLM model management with secure API key storage

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
- Support for PDF, DOCX, PNG, JPEG, and TIFF files up to 10MB

### UI/UX Design
- **Modern Interface**: Clean, accessible design with comprehensive dark/light theme support
- **Responsive Design**: Mobile-first approach optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Fully clickable document lists and cards with proper hover states
- **Accessibility**: WCAG-compliant color contrast, keyboard navigation, and screen reader support
- **Real-time Features**: Live processing status indicators with semantic color coding
- **File Management**: Enhanced drag-and-drop upload with progress tracking and visual feedback
- **Dashboard Analytics**: KPI tiles with prominent icons and hover animations
- **Visual Consistency**: FontAwesome color-coded file icons throughout the application with standardized sizing
- **Icon System**: Comprehensive icon sizing system with 10 size levels and context-specific utilities
- **Micro-interactions**: Subtle animations and transitions for improved user experience

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

## Recent Changes & Features

### Design System & Accessibility Updates
- **File Management**: Updated file upload limit from 50MB to 10MB across all components and documentation
- **Accessibility Enhancements**: Implemented WCAG-compliant color contrast improvements:
  - Enhanced file type icon colors with sufficient contrast ratios for both light and dark themes
  - Added comprehensive focus states for keyboard navigation (3px blue outline with offset)
  - Improved status badge colors with better visibility and contrast
  - Created high-contrast theme variants with accessible color schemes
- **Interactive Elements**: Enhanced clickable functionality across the application:
  - Made document table rows and tiles fully clickable to navigate to detail pages
  - Added hover states and cursor indicators for better user experience
  - Implemented proper event propagation handling for nested interactive elements
- **Visual Design System**: Updated component styling and consistency:
  - Applied consistent FontAwesome color-coded file icons across all document displays
  - Removed background colors from KPI tiles and increased icon sizes for better prominence
  - Enhanced card hover effects with subtle animations and shadows
  - Improved mobile responsiveness and touch target sizing (minimum 44px)
- **Design Tokens**: Established comprehensive CSS custom properties for:
  - Accessible color palettes for file type icons
  - Interactive states (hover, focus, active)
  - Status indicators with semantic colors
  - Animation utilities for smooth transitions
- **Icon System**: Implemented comprehensive icon sizing and usage guidelines:
  - Standardized icon sizes from xs (12px) to 6xl (60px)
  - Context-specific icon classes for buttons, navigation, tables, and cards
  - Spacing utilities for consistent icon-text relationships
  - Accessibility helpers for better user experience
  - Loading and animation states for interactive elements
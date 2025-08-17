# DocuAI - AI-Powered Document Processing Platform

A sophisticated document processing web application that leverages advanced AI technologies for intelligent document analysis and extraction, with comprehensive LLM model management and multilingual support.

## 🚀 Features

### Core Functionality
- **AI-Powered OCR**: Advanced text extraction using Mistral AI Document AI
- **Multi-Format Support**: PDF, DOCX, PNG, JPEG, and TIFF files up to 50MB
- **Image Analysis**: Intelligent detection and description of charts, diagrams, signatures, and visual elements
- **Document Classification**: Automatic categorization and structured data extraction
- **Vector Search**: Semantic search capabilities with PostgreSQL vector embeddings
- **Real-time Processing**: Async processing queue with live status updates

### LLM Model Management
- **Multiple Providers**: Support for Mistral AI, OpenAI, and Google models
- **Secure Configuration**: Encrypted API key storage in database
- **Model Selection**: Configure primary and secondary models for different tasks
- **Cost Tracking**: Token usage and pricing information per model
- **Easy Management**: Search, filter, and manage AI models through intuitive interface

### User Interface
- **Modern Design**: Clean, responsive interface with dark/light theme support
- **Documents Dashboard**: List and tile view with advanced search and filtering
- **Settings Management**: Alphabetically organized configuration panels
- **Real-time Updates**: Live processing status and progress indicators
- **Mobile Optimized**: Adaptive UI for desktop, tablet, and mobile devices

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for build tooling and development
- **TanStack Query** for server state management
- **Wouter** for client-side routing
- **shadcn/ui** + Radix UI for components
- **Tailwind CSS** for styling

### Backend Stack
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Session-based Authentication** via Replit Auth
- **RESTful API** with structured error handling
- **Multer** for file upload processing

### Database Schema
- **Users & Sessions**: Authentication and user management
- **Documents**: Metadata, OCR results, and processing status
- **Categories**: Custom document classification system
- **LLM Configuration**: Model providers, specifications, and user settings
- **Vector Embeddings**: Semantic search capabilities
- **Processing Queue**: Async task management

### External Services
- **Mistral AI**: Document AI for OCR and analysis
- **Supabase**: Cloud storage for documents and images
- **PostgreSQL**: Primary database (Neon-compatible)
- **Replit Auth**: User authentication system

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Mistral AI API key (for production OCR)

### Environment Variables
```env
DATABASE_URL=postgresql://...
MISTRAL_API_KEY=your_mistral_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your database and environment variables
4. Run database migrations: `npm run db:push`
5. Start development server: `npm run dev`

The application will be available at `http://localhost:5000`

## 📊 Database Management

### Available Models (Pre-configured)
- **Mistral Large**: Advanced OCR and document processing
- **Gemini 2.5 Flash**: Fast text processing
- **GPT-4o**: Multimodal analysis with vision capabilities  
- **GPT-4o Mini**: Lightweight processing tasks

### Commands
- `npm run db:push` - Apply schema changes to database
- Database migrations are handled automatically through Drizzle

## 🎯 Usage

### Document Processing
1. **Upload**: Drag & drop or select documents
2. **Processing**: Real-time OCR and AI analysis
3. **Review**: View extracted text, images, and insights
4. **Search**: Find documents using semantic search
5. **Export**: Download processed content

### LLM Configuration
1. **Navigate**: Settings → LLM Models
2. **Add Models**: Configure API keys for different providers
3. **Set Primary**: Choose default model for processing
4. **Manage**: Enable/disable models as needed

### Categories & Classification
1. **Create Categories**: Define custom document types
2. **Set Prompts**: Configure AI analysis for each category
3. **Auto-Classification**: Documents are automatically categorized
4. **Custom Analysis**: Get structured insights based on document type

## 🔧 Configuration

### Settings Organization
Settings are organized alphabetically:
- **Account**: Profile and user preferences
- **Database**: Storage and backup management
- **Design System**: UI components and styling
- **General**: Application preferences
- **LLM Models**: AI model configuration
- **Notifications**: Email and processing alerts
- **Security**: Authentication and access control

### Processing Pipeline
1. **Upload** → File validation and storage
2. **Queue** → Async processing queue management
3. **OCR** → Text extraction via Mistral AI
4. **Analysis** → Document classification and insights
5. **Vectors** → Embedding generation for search
6. **Storage** → Final storage and indexing

## 🚀 Deployment

The application is designed for deployment on Replit with:
- Automatic SSL/TLS handling
- Built-in database connectivity
- Environment variable management
- Real-time collaboration support

For production deployment:
1. Configure your production database
2. Set up external storage (Supabase)
3. Add your AI service API keys
4. Deploy using Replit Deployments

## 📝 API Reference

### Document Endpoints
- `POST /api/documents` - Upload new document
- `GET /api/documents` - List user documents  
- `GET /api/documents/:id` - Get document details
- `DELETE /api/documents/:id` - Delete document

### LLM Management
- `GET /api/llm/models` - List available models
- `GET /api/llm/user-configs` - Get user configurations
- `POST /api/llm/user-configs` - Create model configuration
- `PUT /api/llm/user-configs/:id` - Update configuration
- `DELETE /api/llm/user-configs/:id` - Remove configuration

### Analytics & Stats
- `GET /api/analytics/stats` - Processing statistics
- `GET /api/processing/active` - Active processing jobs

## 🔒 Security

- **API Key Encryption**: All API keys stored securely in database
- **Session Management**: PostgreSQL-backed sessions
- **File Validation**: Comprehensive upload security
- **Access Control**: User-based document isolation
- **Data Privacy**: No external data sharing without consent

## 🎨 Design System

The application includes a comprehensive design system with:
- Consistent color palette and typography
- Reusable UI components
- Dark/light theme support
- Responsive breakpoints
- Accessibility compliance

## 📚 Recent Updates

### LLM Model Management (Current)
- Added comprehensive model configuration interface
- Implemented secure API key storage
- Created Documents-style list layout for model management
- Added search and filtering capabilities
- Integrated cost tracking and usage statistics

### Navigation & UX Improvements
- Reorganized settings with alphabetical tile ordering
- Enhanced mobile responsiveness
- Improved file type icons and visual indicators
- Streamlined document processing workflow

### Database Enhancements
- Extended schema for LLM provider and model management
- Added user configuration tables
- Implemented vector embedding storage
- Enhanced processing queue management

## 🤝 Contributing

This is a demonstration project showcasing modern web development practices with AI integration. The codebase demonstrates:
- Full-stack TypeScript development
- Modern React patterns and state management
- Database design and ORM usage
- AI service integration
- Responsive UI/UX design

## 📄 License

This project is for demonstration purposes. Please ensure you comply with the terms of service of all external APIs and services used.
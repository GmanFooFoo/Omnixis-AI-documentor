-- DocuAI Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR NOT NULL,
  original_name VARCHAR NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  ocr_text TEXT,
  image_count INTEGER DEFAULT 0,
  vector_count INTEGER DEFAULT 0,
  supabase_url VARCHAR,
  processing_error TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Extracted images table
CREATE TABLE IF NOT EXISTS extracted_images (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  document_id VARCHAR NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  annotation TEXT,
  supabase_url VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vector embeddings table
CREATE TABLE IF NOT EXISTS vector_embeddings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  document_id VARCHAR NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  content_type VARCHAR NOT NULL,
  content_text TEXT NOT NULL,
  embedding FLOAT[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Processing queue table
CREATE TABLE IF NOT EXISTS processing_queue (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_id VARCHAR NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  step VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_extracted_images_document_id ON extracted_images(document_id);
CREATE INDEX IF NOT EXISTS idx_vector_embeddings_document_id ON vector_embeddings(document_id);
CREATE INDEX IF NOT EXISTS idx_processing_queue_user_id ON processing_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_processing_queue_status ON processing_queue(status);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE vector_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_queue ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you may want to adjust these based on your auth requirements)
CREATE POLICY "Users can view their own data" ON users FOR ALL USING (true);
CREATE POLICY "Users can manage their documents" ON documents FOR ALL USING (true);
CREATE POLICY "Users can view extracted images" ON extracted_images FOR ALL USING (true);
CREATE POLICY "Users can view vector embeddings" ON vector_embeddings FOR ALL USING (true);
CREATE POLICY "Users can view processing queue" ON processing_queue FOR ALL USING (true);
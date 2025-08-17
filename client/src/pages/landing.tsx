import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-accent-blue rounded-lg flex items-center justify-center">
                <i className="fas fa-brain text-white text-xl"></i>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">DocuAI</h1>
            </div>
            
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Automated OCR & Document Processing
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Transform your documents with AI-powered OCR, secure cloud storage, and intelligent vector search. 
              Built with Mistral AI and Supabase for enterprise-grade document processing.
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <Button 
                size="lg" 
                className="bg-accent-blue hover:bg-blue-600 text-white px-8 py-3 text-lg"
                onClick={() => window.location.href = "/api/login"}
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Get Started
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-3 text-lg border-gray-300 dark:border-dark-border"
              >
                <i className="fas fa-play mr-2"></i>
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Document Processing Workflow
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our three-step process transforms your documents into searchable, intelligent data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <Card className="border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-eye text-accent-blue text-2xl"></i>
              </div>
              <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                OCR & Image Annotation
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Mistral AI extracts text with 99% accuracy and intelligently identifies and annotates images within your documents.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-shield-alt text-accent-green text-2xl"></i>
              </div>
              <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Secure Cloud Storage
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Images and documents are securely stored in Supabase with unique naming and enterprise-grade security.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-brain text-purple-500 text-2xl"></i>
              </div>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Vector Search & RAG
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Content is vectorized and stored in our vector database, enabling semantic search and multimodal RAG systems.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Documents?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have processed millions of documents with DocuAI
          </p>
          <Button 
            size="lg" 
            className="bg-accent-blue hover:bg-blue-600 text-white px-8 py-3 text-lg"
            onClick={() => window.location.href = "/api/login"}
          >
            Start Processing Documents
          </Button>
        </div>
      </div>
    </div>
  );
}

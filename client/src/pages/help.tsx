export default function Help() {
  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Help & Documentation</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Learn how DocuAI processes your documents and get support</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Processing Workflow */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Processing Workflow</h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent-blue rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">1</div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">OCR & Image Annotation</h5>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Mistral AI extracts text and identifies images</p>
                  </div>
                  <i className="fas fa-eye text-accent-blue text-sm sm:text-base flex-shrink-0"></i>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                  <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 dark:text-white">Secure Image Storage</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Images stored in Supabase with unique naming</p>
                  </div>
                  <i className="fas fa-shield-alt text-accent-green"></i>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 dark:text-white">Vectorization & Storage</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Embeddings created and stored in Vector Database</p>
                  </div>
                  <i className="fas fa-brain text-purple-500"></i>
                </div>
              </div>
            </div>

            {/* Supported File Types */}
            <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Supported File Types</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                  <i className="fas fa-file-pdf text-red-500 text-base sm:text-lg flex-shrink-0"></i>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">PDF</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Up to 50MB</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                  <i className="fas fa-file-word text-blue-500 text-lg"></i>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">DOCX</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Up to 50MB</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                  <i className="fas fa-file-image text-green-500 text-lg"></i>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Images</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPEG, TIFF</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                  <i className="fas fa-file-alt text-gray-500 text-lg"></i>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Text</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Plain text files</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ and Help */}
          <div className="space-y-6">
            {/* Frequently Asked Questions */}
            <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-dark-border pb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">How long does document processing take?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Processing time depends on file size and content complexity. Most documents are processed within 1-3 minutes.</p>
                </div>
                
                <div className="border-b border-gray-200 dark:border-dark-border pb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">What happens to my documents?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Documents are securely stored and processed. Text is extracted, images are analyzed, and vector embeddings are created for search.</p>
                </div>
                
                <div className="border-b border-gray-200 dark:border-dark-border pb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Can I delete my documents?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Yes, you can delete documents at any time. This will permanently remove the document and all related content.</p>
                </div>
                
                <div className="pb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">What is vector search?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Vector search allows you to find documents based on meaning and context, not just keywords. It's powered by AI embeddings.</p>
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Getting Started</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-blue rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Upload a Document</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Drag and drop or click to select a PDF, DOCX, or image file.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Monitor Processing</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Watch the real-time progress on your dashboard.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">View Results</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Access extracted text, images, and perform searches in the Documents section.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3 sm:mb-4">Need More Help?</h2>
              <p className="text-sm sm:text-base text-blue-800 dark:text-blue-200 mb-3 sm:mb-4">Our support team is here to help you get the most out of DocuAI.</p>
              
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                  <i className="fas fa-envelope"></i>
                  <span className="text-sm">support@docuai.com</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                  <i className="fas fa-book"></i>
                  <span className="text-sm">Documentation & Guides</span>
                </div>
                <a href="/storybook" className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 transition-colors">
                  <i className="fas fa-palette"></i>
                  <span className="text-sm">Design System Storybook</span>
                </a>
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                  <i className="fas fa-comments"></i>
                  <span className="text-sm">Live Chat Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { motion } from "framer-motion";
import { 
  FileText, 
  Image, 
  FileSpreadsheet, 
  File, 
  Presentation,
  Archive,
  Video,
  Music,
  Code
} from "lucide-react";

// Document type to icon mapping
const documentIcons = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  txt: FileText,
  rtf: FileText,
  
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
  
  ppt: Presentation,
  pptx: Presentation,
  
  jpg: Image,
  jpeg: Image,
  png: Image,
  gif: Image,
  bmp: Image,
  tiff: Image,
  svg: Image,
  
  zip: Archive,
  rar: Archive,
  '7z': Archive,
  
  mp4: Video,
  avi: Video,
  mov: Video,
  mkv: Video,
  
  mp3: Music,
  wav: Music,
  flac: Music,
  
  js: Code,
  ts: Code,
  jsx: Code,
  tsx: Code,
  html: Code,
  css: Code,
  py: Code,
  java: Code,
  
  default: File
};

export function getDocumentIcon(fileName: string) {
  const extension = fileName.toLowerCase().split('.').pop() || 'default';
  return documentIcons[extension as keyof typeof documentIcons] || documentIcons.default;
}

interface LoadingAnimationProps {
  fileName?: string;
  status?: string;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export function LoadingAnimation({ 
  fileName = "document", 
  status = "processing", 
  progress = 0,
  size = 'md',
  showProgress = true
}: LoadingAnimationProps) {
  const IconComponent = getDocumentIcon(fileName);
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };
  
  const containerSizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Animated Icon Container */}
      <div className={`relative ${containerSizeClasses[size]} flex items-center justify-center`}>
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 border-2 border-blue-200 dark:border-blue-800 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            borderTopColor: 'rgb(59 130 246)', // blue-500
          }}
        />
        
        {/* Progress ring */}
        {showProgress && (
          <motion.svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgb(229 231 235)" // gray-200
              strokeWidth="2"
              className="dark:stroke-gray-700"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgb(34 197 94)" // green-500
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                pathLength: progress / 100,
                strokeDasharray: "283", // 2 * π * 45
                strokeDashoffset: 283 * (1 - progress / 100),
              }}
            />
          </motion.svg>
        )}
        
        {/* Document Icon */}
        <motion.div
          className={`${sizeClasses[size]} text-blue-600 dark:text-blue-400 z-10`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <IconComponent className="w-full h-full" />
        </motion.div>
      </div>

      {/* Status Text */}
      <div className="text-center space-y-1">
        <motion.div
          className="text-sm font-medium text-gray-900 dark:text-gray-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {status === "processing" && "Processing document..."}
          {status === "uploading" && "Uploading file..."}
          {status === "ocr" && "Extracting text..."}
          {status === "analyzing" && "Analyzing content..."}
          {status === "embedding" && "Creating embeddings..."}
          {status === "completing" && "Finalizing..."}
          {status === "completed" && "Complete!"}
          {status === "failed" && "Processing failed"}
        </motion.div>
        
        {showProgress && (
          <motion.div
            className="text-xs text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {progress}% complete
          </motion.div>
        )}
        
        <motion.div
          className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-48"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {fileName}
        </motion.div>
      </div>

      {/* Animated dots */}
      <motion.div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

interface DocumentTypeIconProps {
  fileName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DocumentTypeIcon({ fileName, size = 'md', className = "" }: DocumentTypeIconProps) {
  const IconComponent = getDocumentIcon(fileName);
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };
  
  return (
    <IconComponent className={`${sizeClasses[size]} ${className}`} />
  );
}

interface ProcessingStepsProps {
  currentStep: string;
  progress: number;
}

export function ProcessingSteps({ currentStep, progress }: ProcessingStepsProps) {
  const steps = [
    { key: "upload", label: "Upload", threshold: 10 },
    { key: "ocr", label: "Text Extraction", threshold: 30 },
    { key: "analysis", label: "Document Analysis", threshold: 60 },
    { key: "embedding", label: "Vector Embedding", threshold: 80 },
    { key: "complete", label: "Complete", threshold: 100 }
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isCompleted = progress >= step.threshold;
          const isNext = !isCompleted && progress >= (steps[index - 1]?.threshold || 0);
          
          return (
            <div key={step.key} className="flex flex-col items-center space-y-2">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive || isNext
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                }`}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {isCompleted ? "✓" : index + 1}
              </motion.div>
              <span className={`text-xs text-center ${
                isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-500"
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
        <motion.div
          className="bg-blue-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
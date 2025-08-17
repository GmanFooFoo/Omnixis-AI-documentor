import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('document', file);

      // Simulate upload progress
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await apiRequest('POST', '/api/documents/upload', formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => setUploadProgress(0), 1000);
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Successful",
        description: "Your document is being processed. You'll see updates in the monitoring panel.",
      });
      
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/processing/active"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
    },
    onError: (error) => {
      setUploadProgress(0);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive",
      });
    }
  });

  const handleFileSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Validate files
    for (const file of fileArray) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 10MB. Please choose a smaller file.`,
          variant: "destructive",
        });
        return;
      }

      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png',
        'image/jpeg',
        'image/tiff'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Unsupported File Type",
          description: `${file.name} is not a supported file type. Please upload PDF, DOCX, PNG, JPG, or TIFF files.`,
          variant: "destructive",
        });
        return;
      }
    }

    // Upload first file (for now, supporting single file upload)
    if (fileArray.length > 0) {
      uploadMutation.mutate(fileArray[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-accent-blue bg-blue-50 dark:bg-blue-900/10'
            : 'border-gray-300 dark:border-dark-border hover:border-accent-blue dark:hover:border-accent-blue'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="w-16 h-16 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-cloud-upload-alt text-accent-blue text-2xl"></i>
        </div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Upload Documents</h4>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Drag and drop files here, or click to browse</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Supports PDF, DOCX, PNG, JPG, TIFF up to 10MB</p>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.docx,.png,.jpg,.jpeg,.tiff"
          onChange={handleFileChange}
        />
      </div>

      {/* Upload Progress */}
      {uploadMutation.isPending && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Uploading document...</span>
            <span className="text-gray-900 dark:text-white">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Upload Button Alternative */}
      <div className="flex justify-center">
        <Button
          onClick={handleClick}
          disabled={uploadMutation.isPending}
          className="bg-accent-blue hover:bg-blue-600 text-white"
        >
          <i className="fas fa-upload mr-2"></i>
          {uploadMutation.isPending ? 'Uploading...' : 'Choose Files'}
        </Button>
      </div>
    </div>
  );
}

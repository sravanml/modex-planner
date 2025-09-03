import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Eye, 
  Trash2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'uploaded' | 'processing' | 'ready';
}

const DataInput = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'demand_data_2024.csv',
      type: 'CSV',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      status: 'ready'
    },
    {
      id: '2', 
      name: 'inventory_levels.xlsx',
      type: 'Excel',
      size: '1.8 MB',
      uploadDate: '2024-01-14',
      status: 'ready'
    }
  ]);
  
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(),
          name: file.name,
          type: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'processing'
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        
        // Simulate file processing
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(f => f.id === newFile.id ? { ...f, status: 'ready' } : f)
          );
          toast({
            title: "File uploaded successfully",
            description: `${file.name} is ready for processing`,
          });
        }, 2000);
      });
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File deleted",
      description: "File has been removed from your uploads",
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('XLS') || type.includes('EXCEL')) {
      return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    }
    return <FileText className="h-8 w-8 text-blue-600" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'processing':
        return <AlertCircle className="h-5 w-5 text-warning animate-pulse" />;
      default:
        return <Upload className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <>
      <div className="mb-8">
        <h3 className="text-sm font-bold mb-2">Data Input Management</h3>
        <p className="text-muted-foreground">
          Upload and manage your supply chain data files for analysis and planning
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-sm font-bold">
                        <Upload className="h-5 w-5" />
                        <span>Upload Files</span>
                      </CardTitle>
                      <CardDescription>
                        Supported formats: CSV, Excel, PDF, Word documents
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <Label htmlFor="file-upload" className="cursor-pointer">
                          <span className="text-sm font-medium text-primary hover:underline">
                            Click to upload files
                          </span>
                          <span className="text-sm text-muted-foreground block mt-1">
                            or drag and drop
                          </span>
                        </Label>
                        <Input
                          id="file-upload"
                          type="file"
                          multiple
                          accept=".csv,.xlsx,.xls,.pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• Maximum file size: 10MB</p>
                        <p>• Supports multiple file upload</p>
                        <p>• Data will be validated automatically</p>
                      </div>
                    </CardContent>
          </Card>
        </div>

        {/* File Management Section */}
        <div className="lg:col-span-2">
          <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-bold">Uploaded Files</CardTitle>
                      <CardDescription>
                        Manage your uploaded data files and preview content
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {uploadedFiles.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No files uploaded yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {uploadedFiles.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-center space-x-4">
                                {getFileIcon(file.type)}
                                <div>
                                  <h4 className="font-medium">{file.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {file.type} • {file.size} • Uploaded {file.uploadDate}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(file.status)}
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteFile(file.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {uploadedFiles.length > 0 && (
                        <div className="mt-6 pt-6 border-t">
                          <div className="flex space-x-4">
                            <Button className="bg-gradient-primary hover:opacity-90">
                              Save Changes
                            </Button>
                            <Button variant="outline">
                              Download All Files
                            </Button>
                          </div>
                        </div>
                      )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DataInput;
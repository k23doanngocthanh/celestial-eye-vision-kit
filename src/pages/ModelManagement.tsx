
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ArrowLeft, CheckCircle, Eye, FileText, Trash2, Download, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const ModelManagement = () => {
  const [file, setFile] = useState<File | null>(null);
  const [modelName, setModelName] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedModels, setUploadedModels] = useState([
    {
      id: "1",
      name: "yolo_v8_custom",
      description: "Custom trained YOLO v8 model for specific objects",
      size: "45.2 MB",
      uploadedAt: "2024-01-15",
      format: "ONNX",
      status: "active"
    },
    {
      id: "2", 
      name: "face_recognition_v2",
      description: "Enhanced face recognition model with better accuracy",
      size: "28.7 MB",
      uploadedAt: "2024-01-16",
      format: "ONNX",
      status: "active"
    },
    {
      id: "3",
      name: "text_detection_eng",
      description: "English text detection model for OCR preprocessing",
      size: "15.4 MB",
      uploadedAt: "2024-01-17",
      format: "ONNX",
      status: "inactive"
    },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !modelName.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a file and enter a model name",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    setTimeout(() => {
      const newModel = {
        id: String(uploadedModels.length + 1),
        name: modelName,
        description: modelDescription || "No description provided",
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString().split('T')[0],
        format: "ONNX",
        status: "active"
      };
      
      setUploadedModels([...uploadedModels, newModel]);
      setFile(null);
      setModelName("");
      setModelDescription("");
      setIsUploading(false);
      
      toast({
        title: "Upload successful",
        description: `Model ${modelName} has been uploaded successfully`,
      });
    }, 2000);
  };

  const handleDelete = (modelId: string) => {
    setUploadedModels(uploadedModels.filter(model => model.id !== modelId));
    toast({
      title: "Model deleted",
      description: "Model has been removed successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <Eye className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CelestialEye</span>
          </Link>
          <Badge className="bg-indigo-100 text-indigo-700">Model Management</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Model Management</h1>
              <p className="text-gray-600">Upload, manage, and deploy custom ONNX models for specialized tasks</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Model</span>
              </CardTitle>
              <CardDescription>
                Upload custom ONNX models for computer vision tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="modelName">Model Name</Label>
                <Input
                  id="modelName"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="Enter model name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelDescription">Description (Optional)</Label>
                <Textarea
                  id="modelDescription"
                  value={modelDescription}
                  onChange={(e) => setModelDescription(e.target.value)}
                  placeholder="Describe what this model does"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Select ONNX Model</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".onnx"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  Only ONNX format (.onnx) is supported
                </p>
              </div>

              {file && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-indigo-600" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleUpload} 
                disabled={!file || !modelName.trim() || isUploading}
                className="w-full"
                size="lg"
              >
                {isUploading ? "Uploading..." : "Upload Model"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Upload Status</span>
              </CardTitle>
              <CardDescription>
                Model upload guidelines and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Requirements</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• ONNX format only (.onnx extension)</li>
                    <li>• Maximum file size: 500 MB</li>
                    <li>• Model name must be unique</li>
                    <li>• Compatible with ONNX Runtime</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Supported Tasks</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Object Detection (YOLO, etc.)</li>
                    <li>• Image Classification</li>
                    <li>• Semantic Segmentation</li>
                    <li>• Face Recognition</li>
                    <li>• OCR and Text Detection</li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Best Practices</h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Test models locally first</li>
                    <li>• Use descriptive names</li>
                    <li>• Document input/output formats</li>
                    <li>• Optimize for inference speed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Uploaded Models</span>
            </CardTitle>
            <CardDescription>
              Manage your uploaded ONNX models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedModels.map((model) => (
                <div key={model.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{model.name}</h3>
                        <Badge 
                          variant={model.status === "active" ? "default" : "secondary"}
                        >
                          {model.status}
                        </Badge>
                        <Badge variant="outline">{model.format}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Size: {model.size}</span>
                        <span>Uploaded: {model.uploadedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Info className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(model.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-12">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upload">Upload API</TabsTrigger>
              <TabsTrigger value="list">List API</TabsTrigger>
              <TabsTrigger value="info">Info API</TabsTrigger>
              <TabsTrigger value="delete">Delete API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint URL</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        POST /api/models/upload
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Parameters</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">file</span>
                          <Badge variant="destructive">required</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">name</span>
                          <Badge variant="destructive">required</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">description</span>
                          <Badge variant="secondary">optional</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="list" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint URL</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        GET /api/models/list
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Response</h3>
                      <p className="text-sm text-gray-600">
                        Returns a list of all uploaded models with their metadata
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="info" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint URL</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        GET /api/models/{"{modelName}"}
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Response</h3>
                      <p className="text-sm text-gray-600">
                        Returns detailed information about a specific model
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="delete" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint URL</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        DELETE /api/models/{"{modelName}"}
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Response</h3>
                      <p className="text-sm text-gray-600">
                        Deletes the specified model and returns confirmation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ModelManagement;

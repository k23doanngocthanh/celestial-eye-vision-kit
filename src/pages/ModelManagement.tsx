
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ArrowLeft, CheckCircle, Eye, Trash2, Download, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface ModelInfo {
  id: string;
  name: string;
  description: string;
  size: string;
  uploadDate: string;
  type: string;
  status: "active" | "inactive";
}

const ModelManagement = () => {
  const [file, setFile] = useState<File | null>(null);
  const [modelName, setModelName] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [models, setModels] = useState<ModelInfo[]>([
    {
      id: "yolo_v8_default",
      name: "YOLOv8 Default",
      description: "Pre-trained YOLO v8 model for general object detection",
      size: "42.5 MB",
      uploadDate: "2024-01-10",
      type: "Object Detection",
      status: "active"
    },
    {
      id: "tesseract_eng",
      name: "Tesseract English",
      description: "English OCR model using Tesseract engine",
      size: "12.8 MB", 
      uploadDate: "2024-01-05",
      type: "OCR",
      status: "active"
    },
    {
      id: "face_recognition_v1",
      name: "Face Recognition v1",
      description: "Basic face recognition and detection model",
      size: "38.2 MB",
      uploadDate: "2024-01-08",
      type: "Face Recognition",
      status: "inactive"
    }
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
      const newModel: ModelInfo = {
        id: `custom_${Date.now()}`,
        name: modelName,
        description: modelDescription || "Custom uploaded model",
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        type: "Custom",
        status: "active"
      };
      
      setModels(prev => [newModel, ...prev]);
      setIsUploading(false);
      setFile(null);
      setModelName("");
      setModelDescription("");
      
      toast({
        title: "Model uploaded successfully!",
        description: `${modelName} is now available for use`,
      });
    }, 3000);
  };

  const handleDeleteModel = (modelId: string) => {
    setModels(prev => prev.filter(model => model.id !== modelId));
    toast({
      title: "Model deleted",
      description: "Model has been removed from the system",
    });
  };

  const toggleModelStatus = (modelId: string) => {
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, status: model.status === "active" ? "inactive" : "active" }
        : model
    ));
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

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Model</span>
              </CardTitle>
              <CardDescription>
                Upload a new ONNX model to the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={modelDescription}
                  onChange={(e) => setModelDescription(e.target.value)}
                  placeholder="Describe the model's purpose and capabilities"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Select ONNX Model File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".onnx"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  Only ONNX format supported
                </p>
              </div>

              {file && (
                <div className="p-4 bg-gray-50 rounded-lg animate-fade-in">
                  <div className="flex items-center space-x-3">
                    <Upload className="h-8 w-8 text-indigo-600" />
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
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                size="lg"
              >
                {isUploading ? "Uploading Model..." : "Upload Model"}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            {isUploading ? (
              <LoadingSpinner text="Uploading and validating model..." />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="h-5 w-5" />
                    <span>Uploaded Models ({models.length})</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your uploaded and pre-trained models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {models.map((model) => (
                      <div 
                        key={model.id} 
                        className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-lg group-hover:text-indigo-600 transition-colors">
                                {model.name}
                              </h3>
                              <Badge 
                                variant={model.status === "active" ? "default" : "secondary"}
                                className={model.status === "active" ? "bg-green-100 text-green-700" : ""}
                              >
                                {model.status}
                              </Badge>
                              <Badge variant="outline">{model.type}</Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{model.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Size: {model.size}</span>
                              <span>Uploaded: {model.uploadDate}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleModelStatus(model.id)}
                            >
                              {model.status === "active" ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="outline" 
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteModel(model.id)}
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
            )}
          </div>
        </div>

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
                        Returns array of all uploaded models with their metadata
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
                        GET /api/models/{`{modelName}`}
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Parameters</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">modelName (path)</span>
                          <Badge variant="destructive">required</Badge>
                        </div>
                      </div>
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
                        DELETE /api/models/{`{modelName}`}
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Parameters</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">modelName (path)</span>
                          <Badge variant="destructive">required</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Warning</h3>
                      <p className="text-sm text-red-600">
                        This action permanently deletes the model and cannot be undone
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

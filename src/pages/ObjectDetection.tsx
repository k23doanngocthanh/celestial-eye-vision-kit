
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Eye, Upload, ArrowLeft, CheckCircle, Search, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const ObjectDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState("yolo_v8");
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.5]);
  const [classFilter, setClassFilter] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const detectionModels = [
    { id: "yolo_v8", name: "YOLO v8", description: "Latest YOLO model" },
    { id: "yolo_v5", name: "YOLO v5", description: "Stable YOLO model" },
    { id: "custom_model", name: "Custom Model", description: "User uploaded model" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResults(null);
    }
  };

  const simulateProcessing = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an image file to process",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      const mockResults = {
        success: true,
        modelName: selectedModel,
        imageName: file.name,
        imageWidth: 800,
        imageHeight: 600,
        processingTime: 120,
        detections: [
          {
            class: "person",
            confidence: 0.95,
            box: { x1: 100, y1: 150, x2: 300, y2: 500 }
          },
          {
            class: "car",
            confidence: 0.87,
            box: { x1: 400, y1: 200, x2: 700, y2: 400 }
          },
          {
            class: "bicycle",
            confidence: 0.72,
            box: { x1: 50, y1: 300, x2: 150, y2: 450 }
          },
          {
            class: "dog",
            confidence: 0.68,
            box: { x1: 200, y1: 400, x2: 280, y2: 500 }
          }
        ].filter(detection => detection.confidence >= confidenceThreshold[0])
         .filter(detection => !classFilter || detection.class.toLowerCase().includes(classFilter.toLowerCase()))
      };
      
      setResults(mockResults);
      setIsProcessing(false);
      toast({
        title: "Detection Complete",
        description: `Found ${mockResults.detections.length} objects`,
      });
    }, 2000);
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
          <Badge className="bg-red-100 text-red-700">Object Detection</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Search className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Object Detection</h1>
              <p className="text-gray-600">Detect and classify objects using state-of-the-art YOLO models</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Image</span>
              </CardTitle>
              <CardDescription>
                Configure detection parameters and upload an image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="model">Detection Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select detection model" />
                  </SelectTrigger>
                  <SelectContent>
                    {detectionModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-sm text-gray-500">{model.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidence">
                  Confidence Threshold: {confidenceThreshold[0].toFixed(2)}
                </Label>
                <Slider
                  id="confidence"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={confidenceThreshold}
                  onValueChange={setConfidenceThreshold}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">
                  Only show detections above this confidence level
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classFilter">Class Filter (Optional)</Label>
                <Input
                  id="classFilter"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  placeholder="e.g., person, car, dog"
                />
                <p className="text-sm text-gray-500">
                  Filter results by specific object classes
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Select Image</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.bmp"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG, BMP
                </p>
              </div>

              {file && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-red-600" />
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
                onClick={simulateProcessing} 
                disabled={!file || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? "Detecting..." : "Detect Objects"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Detection Results</span>
              </CardTitle>
              <CardDescription>
                Object detection results with bounding boxes and confidence scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!results ? (
                <div className="text-center py-12 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload an image and click "Detect Objects" to see results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{results.detections.length}</div>
                      <div className="text-sm text-gray-600">Objects Found</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{results.processingTime}ms</div>
                      <div className="text-sm text-gray-600">Processing Time</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Detected Objects:</h3>
                    {results.detections.map((detection: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="capitalize">
                            {detection.class}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {(detection.confidence * 100).toFixed(1)}% confidence
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Bounding Box: ({detection.box.x1}, {detection.box.y1}) to ({detection.box.x2}, {detection.box.y2})
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Size: {detection.box.x2 - detection.box.x1} × {detection.box.y2 - detection.box.y1} pixels
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="endpoint" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="endpoint">API Endpoint</TabsTrigger>
              <TabsTrigger value="request">Request Format</TabsTrigger>
              <TabsTrigger value="response">Response Format</TabsTrigger>
            </TabsList>
            
            <TabsContent value="endpoint" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint URL</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        POST /api/detection/detect/{"{modelName}"}
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Content-Type</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        multipart/form-data
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="request" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Request Parameters</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">modelName</span>
                      <Badge variant="destructive">required</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">image</span>
                      <Badge variant="destructive">required</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">classNames</span>
                      <Badge variant="secondary">optional</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">confThreshold</span>
                      <Badge variant="secondary">optional</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="response" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Response Example</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "modelName": "yolo_v8",
  "imageName": "test.jpg",
  "imageWidth": 800,
  "imageHeight": 600,
  "processingTime": 150,
  "detections": [
    {
      "class": "person",
      "confidence": 0.95,
      "box": {
        "x1": 100,
        "y1": 100,
        "x2": 300,
        "y2": 400
      }
    }
  ]
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ObjectDetection;

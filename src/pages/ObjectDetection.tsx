
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Upload, ArrowLeft, CheckCircle, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { DetectionCanvas } from "@/components/DetectionCanvas";
import { ResultsTable } from "@/components/ResultsTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface ObjectDetection {
  content: string;
  format: string;
  confidence: number;
  boundingBox: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

const ObjectDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState("yolo_v8");
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.5]);
  const [classFilter, setClassFilter] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [detections, setDetections] = useState<ObjectDetection[]>([]);

  const detectionModels = [
    { id: "yolo_v8", name: "YOLO v8", description: "Latest YOLO object detection model" },
    { id: "yolo_v5", name: "YOLO v5", description: "Stable YOLO model for general detection" },
    { id: "ssd_mobilenet", name: "SSD MobileNet", description: "Fast and lightweight detection" },
    { id: "faster_rcnn", name: "Faster R-CNN", description: "High accuracy object detection" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDetections([]);
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
      const mockDetections: ObjectDetection[] = [
        {
          content: "person",
          format: "OBJECT",
          confidence: 0.92,
          boundingBox: { x1: 100, y1: 50, x2: 200, y2: 300 }
        },
        {
          content: "car",
          format: "OBJECT", 
          confidence: 0.87,
          boundingBox: { x1: 250, y1: 150, x2: 450, y2: 280 }
        },
        {
          content: "bicycle",
          format: "OBJECT",
          confidence: 0.76,
          boundingBox: { x1: 50, y1: 200, x2: 120, y2: 280 }
        },
        {
          content: "dog",
          format: "OBJECT",
          confidence: 0.84,
          boundingBox: { x1: 300, y1: 280, x2: 400, y2: 350 }
        }
      ].filter(detection => detection.confidence >= confidenceThreshold[0]);
      
      setDetections(mockDetections);
      setIsProcessing(false);
      
      toast({
        title: "Objects detected!",
        description: `Found ${mockDetections.length} objects using ${selectedModel}`,
      });
    }, 2800);
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
              <Eye className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Object Detection</h1>
              <p className="text-gray-600">Detect and classify objects using state-of-the-art YOLO models</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload & Configure</span>
              </CardTitle>
              <CardDescription>
                Select image and detection parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label>Confidence Threshold: {confidenceThreshold[0].toFixed(2)}</Label>
                <Slider
                  value={confidenceThreshold}
                  onValueChange={setConfidenceThreshold}
                  max={1}
                  min={0.1}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">
                  Only show detections above this confidence level
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classFilter">Class Filter (optional)</Label>
                <Input
                  id="classFilter"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  placeholder="e.g., person,car,dog"
                />
                <p className="text-sm text-gray-500">
                  Comma-separated class names to filter
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Select Image File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.bmp"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  Supported: JPG, PNG, BMP
                </p>
              </div>

              {file && (
                <div className="p-4 bg-gray-50 rounded-lg animate-fade-in">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-8 w-8 text-red-600" />
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
                className="w-full bg-red-600 hover:bg-red-700"
                size="lg"
              >
                {isProcessing ? "Detecting Objects..." : "Detect Objects"}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            {isProcessing ? (
              <LoadingSp innner text="Running object detection model..." />
            ) : (
              <DetectionCanvas 
                imageFile={file} 
                detections={detections}
                isProcessing={isProcessing}
              />
            )}
          </div>
        </div>

        {detections.length > 0 && (
          <div className="animate-fade-in">
            <ResultsTable detections={detections} />
          </div>
        )}

        <div className="mt-12">
          <Tabs defaultValue="detect" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="detect">Detection API</TabsTrigger>
              <TabsTrigger value="models">Available Models</TabsTrigger>
              <TabsTrigger value="cache">Cache Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detect" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint URL</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        POST /api/detection/detect/{`{modelName}`}
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Parameters</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">modelName (path)</span>
                          <Badge variant="destructive">required</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">image</span>
                          <Badge variant="destructive">required</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">classNames</span>
                          <Badge variant="secondary">optional</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">confThreshold</span>
                          <Badge variant="secondary">optional</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="models" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Available Detection Models</h3>
                  <div className="grid gap-3">
                    {detectionModels.map((model) => (
                      <div key={model.id} className="p-3 border rounded-lg">
                        <div className="font-medium">{model.name}</div>
                        <div className="text-sm text-gray-500">{model.description}</div>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                          {model.id}
                        </code>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cache" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Clear Model Cache</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        DELETE /api/detection/cache/{`{modelName}`}
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Clear All Cache</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        DELETE /api/detection/cache
                      </code>
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

export default ObjectDetection;

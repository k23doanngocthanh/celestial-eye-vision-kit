
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, ArrowLeft, CheckCircle, Eye, Scan } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const OCRDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState("paddle-ocr");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const ocrModels = [
    { id: "paddle-ocr", name: "PaddleOCR", description: "General purpose OCR" },
    { id: "tesseract", name: "Tesseract", description: "Traditional OCR engine" },
    { id: "easyocr", name: "EasyOCR", description: "Multi-language support" },
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
        processingTime: 180,
        detections: [
          {
            text: "CERTIFICATE OF COMPLETION",
            confidence: 0.98,
            boundingBox: { x1: 120, y1: 50, x2: 480, y2: 85 }
          },
          {
            text: "This is to certify that",
            confidence: 0.95,
            boundingBox: { x1: 150, y1: 120, x2: 450, y2: 140 }
          },
          {
            text: "John Doe",
            confidence: 0.97,
            boundingBox: { x1: 250, y1: 160, x2: 350, y2: 190 }
          },
          {
            text: "has successfully completed the course",
            confidence: 0.93,
            boundingBox: { x1: 100, y1: 200, x2: 500, y2: 220 }
          }
        ]
      };
      
      setResults(mockResults);
      setIsProcessing(false);
      toast({
        title: "OCR Complete",
        description: `Extracted ${mockResults.detections.length} text segments`,
      });
    }, 2500);
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
          <Badge className="bg-purple-100 text-purple-700">OCR Text Recognition</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">OCR Text Recognition</h1>
              <p className="text-gray-600">Extract text from images with high accuracy using advanced OCR models</p>
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
                Select an image and OCR model to extract text content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="model">OCR Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select OCR model" />
                  </SelectTrigger>
                  <SelectContent>
                    {ocrModels.map((model) => (
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
                <Label htmlFor="file">Select Image</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.bmp,.tiff"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG, BMP, TIFF
                </p>
              </div>

              {file && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-purple-600" />
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
                {isProcessing ? "Processing..." : "Extract Text"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Extracted Text</span>
              </CardTitle>
              <CardDescription>
                Text recognition results with confidence scores and positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!results ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload an image and click "Extract Text" to see results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{results.detections.length}</div>
                      <div className="text-sm text-gray-600">Text Segments</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{results.processingTime}ms</div>
                      <div className="text-sm text-gray-600">Processing Time</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Detected Text:</h3>
                    {results.detections.map((detection: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">Text {index + 1}</Badge>
                          <span className="text-sm text-gray-500">
                            {(detection.confidence * 100).toFixed(1)}% confidence
                          </span>
                        </div>
                        <p className="text-lg mb-2">{detection.text}</p>
                        <p className="text-xs text-gray-500">
                          Position: ({detection.boundingBox.x1}, {detection.boundingBox.y1}) to ({detection.boundingBox.x2}, {detection.boundingBox.y2})
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
                        POST /api/ocr/detect/{"{modelName}"}
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
                    <p className="text-sm text-gray-600">
                      Image file to perform OCR on. Supported formats: JPG, PNG, BMP, TIFF
                    </p>
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
  "data": {
    "detections": [
      {
        "text": "Sample text",
        "confidence": 0.95,
        "boundingBox": {
          "x1": 100,
          "y1": 100,
          "x2": 200,
          "y2": 150
        }
      }
    ]
  }
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

export default OCRDetection;

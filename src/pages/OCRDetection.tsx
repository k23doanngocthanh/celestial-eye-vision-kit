
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, ArrowLeft, CheckCircle, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { DetectionCanvas } from "@/components/DetectionCanvas";
import { ResultsTable } from "@/components/ResultsTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface OCRDetection {
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

const OCRDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState("tesseract-eng");
  const [isProcessing, setIsProcessing] = useState(false);
  const [detections, setDetections] = useState<OCRDetection[]>([]);

  const ocrModels = [
    { id: "tesseract-eng", name: "Tesseract English", description: "General English text recognition" },
    { id: "tesseract-vie", name: "Tesseract Vietnamese", description: "Vietnamese text recognition" },
    { id: "paddleocr", name: "PaddleOCR", description: "Multi-language OCR model" },
    { id: "easyocr", name: "EasyOCR", description: "Easy-to-use OCR model" }
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
      const mockDetections: OCRDetection[] = [
        {
          content: "INVOICE",
          format: "TEXT",
          confidence: 0.97,
          boundingBox: { x1: 200, y1: 50, x2: 300, y2: 80 }
        },
        {
          content: "Invoice #: INV-2024-001",
          format: "TEXT",
          confidence: 0.95,
          boundingBox: { x1: 50, y1: 100, x2: 250, y2: 125 }
        },
        {
          content: "Date: 2024-01-15",
          format: "TEXT", 
          confidence: 0.93,
          boundingBox: { x1: 50, y1: 140, x2: 180, y2: 165 }
        },
        {
          content: "Total: $1,234.56",
          format: "TEXT",
          confidence: 0.96,
          boundingBox: { x1: 300, y1: 400, x2: 450, y2: 430 }
        }
      ];
      
      setDetections(mockDetections);
      setIsProcessing(false);
      
      toast({
        title: "Text extracted successfully!",
        description: `Found ${mockDetections.length} text regions using ${selectedModel}`,
      });
    }, 3000);
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
          <Badge className="bg-purple-100 text-purple-700">OCR Detection</Badge>
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
              <p className="text-gray-600">Extract text from images using advanced OCR models with high accuracy</p>
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
                Select image and OCR model for text extraction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="file">Select Image File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.tiff"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  Supported: JPG, PNG, PDF, TIFF
                </p>
              </div>

              {file && (
                <div className="p-4 bg-gray-50 rounded-lg animate-fade-in">
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
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {isProcessing ? "Extracting Text..." : "Extract Text"}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            {isProcessing ? (
              <LoadingSpinner text="Processing image with OCR model..." />
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="detect">OCR API</TabsTrigger>
              <TabsTrigger value="models">Available Models</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detect" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint URL</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        POST /api/ocr/detect/{`{modelName}`}
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
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="models" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Available OCR Models</h3>
                  <div className="grid gap-3">
                    {ocrModels.map((model) => (
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default OCRDetection;

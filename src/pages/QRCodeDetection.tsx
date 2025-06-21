
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Upload, ArrowLeft, CheckCircle, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { DetectionCanvas } from "@/components/DetectionCanvas";
import { ResultsTable } from "@/components/ResultsTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface QRDetection {
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

const QRCodeDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detections, setDetections] = useState<QRDetection[]>([]);

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
      const mockDetections: QRDetection[] = [
        {
          content: "https://example.com/product/123",
          format: "QR_CODE",
          confidence: 0.98,
          boundingBox: { x1: 120, y1: 80, x2: 280, y2: 240 }
        },
        {
          content: "Contact: John Doe\nPhone: +1234567890\nEmail: john@example.com",
          format: "QR_CODE", 
          confidence: 0.94,
          boundingBox: { x1: 350, y1: 150, x2: 510, y2: 310 }
        }
      ];
      
      setDetections(mockDetections);
      setIsProcessing(false);
      
      toast({
        title: "QR codes detected!",
        description: `Found ${mockDetections.length} QR codes in the image`,
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
          <Badge className="bg-green-100 text-green-700">QR Code Detection</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Search className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QR Code Detection</h1>
              <p className="text-gray-600">Detect and decode QR codes with precise positioning and content extraction</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Image</span>
              </CardTitle>
              <CardDescription>
                Select an image containing QR codes for detection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Select Image File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.bmp"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  Supported: JPG, PNG, GIF, BMP
                </p>
              </div>

              {file && (
                <div className="p-4 bg-gray-50 rounded-lg animate-fade-in">
                  <div className="flex items-center space-x-3">
                    <Search className="h-8 w-8 text-green-600" />
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
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isProcessing ? "Detecting QR Codes..." : "Detect QR Codes"}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            {isProcessing ? (
              <LoadingSpinner text="Analyzing image for QR codes..." />
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
              <TabsTrigger value="status">Status API</TabsTrigger>
              <TabsTrigger value="websocket">WebSocket API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detect" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint URL</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        POST /api/qrcode/detect
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Parameters</h3>
                      <div className="space-y-2">
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
            
            <TabsContent value="status" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint URL</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        GET /api/qrcode/status
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Response</h3>
                      <p className="text-sm text-gray-600">
                        Returns service status and detection capabilities
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="websocket" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">WebSocket URL</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        ws://your-server/ws/detect-stream
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Usage</h3>
                      <p className="text-sm text-gray-600">
                        Stream video frames for real-time QR code detection
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

export default QRCodeDetection;

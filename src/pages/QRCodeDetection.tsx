
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Search, Upload, ArrowLeft, CheckCircle, Image, Globe, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const QRCodeDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

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
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        success: true,
        data: {
          imageInfo: `${file.name} (800x600)`,
          totalQrCodes: 2,
          qrCodes: [
            {
              content: "https://celestialeye.example.com",
              type: "URL",
              boundingBox: {
                x1: 100,
                y1: 100,
                x2: 200,
                y2: 200
              }
            },
            {
              content: "Contact: John Doe\nPhone: +1234567890\nEmail: john@example.com",
              type: "TEXT",
              boundingBox: {
                x1: 300,
                y1: 150,
                x2: 400,
                y2: 250
              }
            }
          ],
          processingTimeMs: 145
        }
      };
      
      setResults(mockResults);
      setIsProcessing(false);
      toast({
        title: "Processing complete",
        description: `Found ${mockResults.data.totalQrCodes} QR codes`,
      });
    }, 1800);
  };

  const getQRIcon = (type: string) => {
    switch (type) {
      case "URL":
        return <Globe className="h-4 w-4" />;
      case "PHONE":
        return <Phone className="h-4 w-4" />;
      case "EMAIL":
        return <Mail className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Search className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QR Code Detection</h1>
              <p className="text-gray-600">Advanced QR code detection with multi-code support</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Image</span>
              </CardTitle>
              <CardDescription>
                Upload an image containing QR codes for detection and decoding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file">Select Image</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG, GIF, BMP, WebP
                </p>
              </div>

              {file && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Image className="h-8 w-8 text-green-600" />
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
                {isProcessing ? "Detecting QR Codes..." : "Detect QR Codes"}
              </Button>

              {/* Status Information */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Service Status</h3>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>✓ QR Code detection service is running</p>
                  <p>✓ Library: BoofCV</p>
                  <p>✓ Multi-QR support enabled</p>
                  <p>✓ Bounding box coordinates available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Detection Results</span>
              </CardTitle>
              <CardDescription>
                QR code detection results with content and position data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!results ? (
                <div className="text-center py-12 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload an image and click "Detect QR Codes" to see results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{results.data.totalQrCodes}</div>
                      <div className="text-sm text-gray-600">QR Codes Found</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{results.data.processingTimeMs}ms</div>
                      <div className="text-sm text-gray-600">Processing Time</div>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Image:</strong> {results.data.imageInfo}
                    </p>
                  </div>

                  {/* QR Codes */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Detected QR Codes:</h3>
                    {results.data.qrCodes.map((qr: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getQRIcon(qr.type)}
                            <Badge variant="outline">{qr.type}</Badge>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <h4 className="font-medium mb-2">Content:</h4>
                          <div className="bg-gray-50 p-3 rounded font-mono text-sm whitespace-pre-wrap">
                            {qr.content}
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-500">
                          Bounding Box: ({qr.boundingBox.x1}, {qr.boundingBox.y1}) to ({qr.boundingBox.x2}, {qr.boundingBox.y2})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* API Information */}
        <div className="mt-12">
          <Tabs defaultValue="rest" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="rest">REST API</TabsTrigger>
              <TabsTrigger value="websocket">WebSocket</TabsTrigger>
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rest" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Detection Endpoint</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block mb-4">
                        POST /api/qrcode/detect
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Status Endpoint</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        GET /api/qrcode/status
                      </code>
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
                      <h3 className="font-semibold mb-2">WebSocket Endpoint</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        ws://your-server/ws/detect-stream
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Usage</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Send binary image data for real-time QR code detection including CCCD support
                      </p>
                      <code className="bg-gray-900 text-gray-100 p-3 rounded text-sm block">
                        ws.send(imageBlob); // Send binary image data
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
                      <span className="font-medium">image</span>
                      <Badge variant="destructive">required</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Image file containing QR codes to be detected and decoded
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
    "imageInfo": "image.jpg (800x600)",
    "totalQrCodes": 1,
    "qrCodes": [
      {
        "content": "https://example.com",
        "type": "URL",
        "boundingBox": {
          "x1": 100,
          "y1": 100,
          "x2": 200,
          "y2": 200
        }
      }
    ],
    "processingTimeMs": 150
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

export default QRCodeDetection;

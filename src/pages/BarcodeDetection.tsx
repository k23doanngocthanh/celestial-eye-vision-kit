
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Scan, Upload, ArrowLeft, CheckCircle, FileText, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const BarcodeDetection = () => {
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
        description: "Please select a file to process",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        success: true,
        totalPages: 1,
        detectedPages: 1,
        totalBarcodes: 2,
        results: [
          {
            pageNumber: 1,
            barcodes: [
              {
                content: "123456789012",
                format: "CODE_128",
                confidence: 0.95,
                boundingBox: {
                  x1: 100,
                  y1: 100,
                  x2: 300,
                  y2: 150
                }
              },
              {
                content: "987654321098",
                format: "EAN_13",
                confidence: 0.89,
                boundingBox: {
                  x1: 150,
                  y1: 200,
                  x2: 350,
                  y2: 250
                }
              }
            ]
          }
        ]
      };
      
      setResults(mockResults);
      setIsProcessing(false);
      toast({
        title: "Processing complete",
        description: `Found ${mockResults.totalBarcodes} barcodes`,
      });
    }, 2000);
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
          <Badge className="bg-blue-100 text-blue-700">Barcode Detection</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Scan className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Barcode Detection</h1>
              <p className="text-gray-600">Process documents and images to detect various barcode formats</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload Document</span>
              </CardTitle>
              <CardDescription>
                Support for PDF, TIFF, and image files containing barcodes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.tiff,.tif,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, TIFF, JPG, PNG
                </p>
              </div>

              {file && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
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
                {isProcessing ? "Processing..." : "Detect Barcodes"}
              </Button>
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
                Barcode detection results with confidence scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!results ? (
                <div className="text-center py-12 text-gray-500">
                  <Scan className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload a file and click "Detect Barcodes" to see results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{results.totalPages}</div>
                      <div className="text-sm text-gray-600">Total Pages</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{results.totalBarcodes}</div>
                      <div className="text-sm text-gray-600">Barcodes Found</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Detected Barcodes:</h3>
                    {results.results[0].barcodes.map((barcode: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{barcode.format}</Badge>
                          <span className="text-sm text-gray-500">
                            {(barcode.confidence * 100).toFixed(1)}% confidence
                          </span>
                        </div>
                        <p className="font-mono text-lg">{barcode.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Position: ({barcode.boundingBox.x1}, {barcode.boundingBox.y1}) to ({barcode.boundingBox.x2}, {barcode.boundingBox.y2})
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
                        POST /api/barcode/process
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
                      <span className="font-medium">file</span>
                      <Badge variant="destructive">required</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      PDF, TIFF, or image file containing barcodes to be processed
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
  "totalPages": 1,
  "detectedPages": 1,
  "totalBarcodes": 2,
  "results": [
    {
      "pageNumber": 1,
      "barcodes": [
        {
          "content": "123456789012",
          "format": "CODE_128",
          "confidence": 0.95,
          "boundingBox": {
            "x1": 100,
            "y1": 100,
            "x2": 300,
            "y2": 150
          }
        }
      ]
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

export default BarcodeDetection;

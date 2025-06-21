
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Scan, Upload, ArrowLeft, CheckCircle, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { DetectionCanvas } from "@/components/DetectionCanvas";
import { ResultsTable } from "@/components/ResultsTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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
    
    // Simulate API call with realistic delay
    setTimeout(() => {
      const mockResults = {
        success: true,
        totalPages: 1,
        detectedPages: 1,
        totalBarcodes: 3,
        results: [
          {
            pageNumber: 1,
            barcodes: [
              {
                content: "123456789012",
                format: "CODE_128",
                confidence: 0.95,
                boundingBox: {
                  x1: 120,
                  y1: 80,
                  x2: 320,
                  y2: 130
                }
              },
              {
                content: "9876543210987",
                format: "EAN_13",
                confidence: 0.89,
                boundingBox: {
                  x1: 180,
                  y1: 200,
                  x2: 380,
                  y2: 250
                }
              },
              {
                content: "https://example.com/product/12345",
                format: "QR_CODE",
                confidence: 0.92,
                boundingBox: {
                  x1: 50,
                  y1: 300,
                  x2: 150,
                  y2: 400
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
        description: `Found ${mockResults.totalBarcodes} barcodes with high confidence`,
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5" />
            <Eye className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CelestialEye</span>
          </Link>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
            <Scan className="h-4 w-4 mr-1" />
            Barcode Detection
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Scan className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Barcode Detection</h1>
              <p className="text-gray-600">Advanced barcode and QR code detection with AI-powered analysis</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Upload Section */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-blue-600" />
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
                  className="cursor-pointer hover:border-blue-300 transition-colors"
                />
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, TIFF, JPG, PNG (Max: 10MB)
                </p>
              </div>

              {file && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={simulateProcessing} 
                disabled={!file || isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                size="lg"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Scan className="h-4 w-4" />
                    <span>Detect Barcodes</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span>Detection Summary</span>
              </CardTitle>
              <CardDescription>
                Overview of detection results and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!results ? (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload and process a file to see detection statistics</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-shadow">
                      <div className="text-2xl font-bold text-blue-600">{results.totalPages}</div>
                      <div className="text-sm text-gray-600">Total Pages</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-md transition-shadow">
                      <div className="text-2xl font-bold text-green-600">{results.totalBarcodes}</div>
                      <div className="text-sm text-gray-600">Barcodes Found</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Format Distribution:</h4>
                    {/* Format breakdown */}
                    {Object.entries(
                      results.results[0].barcodes.reduce((acc: any, barcode: any) => {
                        acc[barcode.format] = (acc[barcode.format] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([format, count]: [string, any]) => (
                      <div key={format} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <Badge variant="outline">{format}</Badge>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detection Visualization */}
        {(file || isProcessing) && (
          <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <span>Detection Visualization</span>
              </CardTitle>
              <CardDescription>
                Visual representation of detected barcodes with bounding boxes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <LoadingSpinner size="lg" text="Analyzing image and detecting barcodes..." />
              ) : (
                <DetectionCanvas
                  imageFile={file}
                  detections={results?.results[0]?.barcodes || []}
                  isProcessing={isProcessing}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Table */}
        {results && (
          <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Detection Results</span>
              </CardTitle>
              <CardDescription>
                Detailed information about each detected barcode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResultsTable detections={results.results[0].barcodes} />
            </CardContent>
          </Card>
        )}

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

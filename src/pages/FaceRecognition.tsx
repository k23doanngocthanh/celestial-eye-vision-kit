
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Upload, ArrowLeft, CheckCircle, Eye, UserPlus, UserCheck, List } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const FaceRecognition = () => {
  const [file, setFile] = useState<File | null>(null);
  const [personName, setPersonName] = useState("");
  const [mode, setMode] = useState<"register" | "authenticate">("register");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [registeredFaces] = useState([
    { id: "1", name: "John Doe", registeredAt: "2024-01-15" },
    { id: "2", name: "Jane Smith", registeredAt: "2024-01-16" },
    { id: "3", name: "Mike Johnson", registeredAt: "2024-01-17" },
  ]);

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

    if (mode === "register" && !personName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a person name for registration",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      if (mode === "register") {
        const mockResults = {
          success: true,
          action: "register",
          personName: personName,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          faceDetected: true
        };
        setResults(mockResults);
        toast({
          title: "Registration successful",
          description: `Face registered for ${personName}`,
        });
      } else {
        const mockResults = {
          success: true,
          action: "authenticate",
          authenticated: Math.random() > 0.3,
          personName: registeredFaces[Math.floor(Math.random() * registeredFaces.length)].name,
          confidence: 0.92,
          timestamp: new Date().toISOString()
        };
        setResults(mockResults);
        toast({
          title: mockResults.authenticated ? "Authentication successful" : "Authentication failed",
          description: mockResults.authenticated 
            ? `Recognized as ${mockResults.personName}` 
            : "Face not recognized",
          variant: mockResults.authenticated ? "default" : "destructive",
        });
      }
      setIsProcessing(false);
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
          <Badge className="bg-orange-100 text-orange-700">Face Recognition</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Face Recognition</h1>
              <p className="text-gray-600">Register new faces and authenticate existing ones with high precision</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Face Processing</span>
                </CardTitle>
                <CardDescription>
                  Register new faces or authenticate existing ones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-4">
                  <Button
                    variant={mode === "register" ? "default" : "outline"}
                    onClick={() => setMode("register")}
                    className="flex-1"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register Face
                  </Button>
                  <Button
                    variant={mode === "authenticate" ? "default" : "outline"}
                    onClick={() => setMode("authenticate")}
                    className="flex-1"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Authenticate Face
                  </Button>
                </div>

                {mode === "register" && (
                  <div className="space-y-2">
                    <Label htmlFor="personName">Person Name</Label>
                    <Input
                      id="personName"
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      placeholder="Enter person's name"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="file">Select Image</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500">
                    Supported formats: JPG, PNG
                  </p>
                </div>

                {file && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-8 w-8 text-orange-600" />
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
                  {isProcessing ? "Processing..." : (mode === "register" ? "Register Face" : "Authenticate Face")}
                </Button>

                {results && (
                  <div className="p-6 bg-white border rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">
                        {results.action === "register" ? "Registration" : "Authentication"} Results
                      </span>
                    </div>
                    
                    {results.action === "register" ? (
                      <div className="space-y-2">
                        <p><span className="font-medium">Status:</span> Successfully registered</p>
                        <p><span className="font-medium">Person:</span> {results.personName}</p>
                        <p><span className="font-medium">ID:</span> {results.id}</p>
                        <p><span className="font-medium">Time:</span> {new Date(results.timestamp).toLocaleString()}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p><span className="font-medium">Status:</span> 
                          <Badge className={`ml-2 ${results.authenticated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {results.authenticated ? "Authenticated" : "Not Recognized"}
                          </Badge>
                        </p>
                        {results.authenticated && (
                          <>
                            <p><span className="font-medium">Person:</span> {results.personName}</p>
                            <p><span className="font-medium">Confidence:</span> {(results.confidence * 100).toFixed(1)}%</p>
                          </>
                        )}
                        <p><span className="font-medium">Time:</span> {new Date(results.timestamp).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <List className="h-5 w-5" />
                <span>Registered Faces</span>
              </CardTitle>
              <CardDescription>
                List of currently registered faces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {registeredFaces.map((face) => (
                  <div key={face.id} className="p-3 border rounded-lg">
                    <p className="font-medium">{face.name}</p>
                    <p className="text-sm text-gray-500">
                      Registered: {face.registeredAt}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="register">Register API</TabsTrigger>
              <TabsTrigger value="authenticate">Authenticate API</TabsTrigger>
              <TabsTrigger value="websocket">WebSocket API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="register" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint URL</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        POST /api/face/register
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Parameters</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">image</span>
                          <Badge variant="destructive">required</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">name</span>
                          <Badge variant="destructive">required</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="authenticate" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint URL</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        POST /api/face/authenticate
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
            
            <TabsContent value="websocket" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">WebSocket URL</h3>
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm block">
                        ws://your-server/ws/face-stream
                      </code>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Usage</h3>
                      <p className="text-sm text-gray-600">
                        Stream video frames for real-time face registration and authentication
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

export default FaceRecognition;

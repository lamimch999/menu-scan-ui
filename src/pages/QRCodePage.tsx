
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, Share2, Printer, ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";

const QRCodePage = () => {
  const { id } = useParams();
  
  const restaurant = {
    id: 1,
    name: "Pizza Palace",
    subtitle: "Authentic Italian Pizza",
    url: `https://menu.restaurantos.com/pizza-palace-${id}`,
    qrCodeUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  };

  const handleDownload = () => {
    console.log("Downloading QR code...");
  };

  const handleShare = () => {
    console.log("Sharing QR code...");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow-sm">
        <div className="flex items-center gap-4 p-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QR Code Generator</h1>
            <p className="text-gray-600">Generate and manage QR codes for your restaurant</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QR Code Display */}
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <QrCode className="w-6 h-6 text-orange-600" />
                  QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300 mx-auto w-fit">
                  {/* QR Code placeholder - in real app this would be generated */}
                  <div className="w-48 h-48 bg-black flex items-center justify-center text-white text-xs">
                    <div className="text-center">
                      <QrCode className="w-12 h-12 mx-auto mb-2" />
                      QR Code Preview
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button onClick={handleDownload} className="w-full bg-orange-600 hover:bg-orange-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={handleShare} variant="outline" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button onClick={handlePrint} variant="outline" className="w-full">
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Information */}
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{restaurant.name}</h3>
                  <p className="text-gray-600">{restaurant.subtitle}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Menu URL</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={restaurant.url}
                        readOnly
                        className="flex-1 p-2 border rounded-md bg-gray-50 text-sm"
                      />
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">How to use this QR Code:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Print and place on tables for easy menu access</li>
                      <li>• Include on promotional materials</li>
                      <li>• Display at entrance or cashier counter</li>
                      <li>• Share digitally via social media or website</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-2">QR Code Features:</h4>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• High resolution for clear printing</li>
                      <li>• Works with any smartphone camera</li>
                      <li>• Direct link to your digital menu</li>
                      <li>• Trackable scan analytics (coming soon)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code Sizes */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Available Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { size: "Small", dimensions: "100x100px", use: "Business cards" },
                  { size: "Medium", dimensions: "200x200px", use: "Flyers, posters" },
                  { size: "Large", dimensions: "300x300px", use: "Table tents" },
                  { size: "Extra Large", dimensions: "500x500px", use: "Banners, signs" }
                ].map((option) => (
                  <div key={option.size} className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="bg-black text-white text-xs p-2 rounded mb-2 mx-auto w-fit">
                      QR Preview
                    </div>
                    <h4 className="font-semibold">{option.size}</h4>
                    <p className="text-sm text-gray-600">{option.dimensions}</p>
                    <p className="text-xs text-gray-500 mt-1">{option.use}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;


import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { QrCode, Download, Share2, Printer, ExternalLink, Palette, Type } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import QRCodeGenerator from "qrcode";

const QRCodePage = () => {
  const { id } = useParams();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [centerText, setCenterText] = useState("");
  const [textSize, setTextSize] = useState([16]);
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const restaurant = {
    id: 1,
    name: "Pizza Palace",
    subtitle: "Authentic Italian Pizza",
    url: `https://menu.restaurantos.com/pizza-palace-${id}`,
  };

  const sizeOptions = [
    { size: "Small", dimensions: "100x100px", pixels: 100, use: "Business cards" },
    { size: "Medium", dimensions: "200x200px", pixels: 200, use: "Flyers, posters" },
    { size: "Large", dimensions: "300x300px", pixels: 300, use: "Table tents" },
    { size: "Extra Large", dimensions: "500x500px", pixels: 500, use: "Banners, signs" }
  ];

  const currentSize = sizeOptions.find(option => option.size === selectedSize) || sizeOptions[1];

  const generateQRCodeWithText = async (url: string, size: number) => {
    try {
      // Generate base QR code
      const qrCodeDataUrl = await QRCodeGenerator.toDataURL(url, {
        width: size,
        margin: 2,
        color: {
          dark: qrColor,
          light: bgColor
        }
      });

      // If no center text, return the basic QR code
      if (!centerText.trim()) {
        setQrCodeUrl(qrCodeDataUrl);
        return;
      }

      // Create canvas to add text overlay
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = size;
      canvas.height = size;

      // Draw QR code
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);

        // Set up font with better styling
        ctx.font = `bold ${textSize[0]}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Measure text properly
        const textMetrics = ctx.measureText(centerText);
        const textWidth = textMetrics.width;
        const textHeight = textSize[0];
        const padding = Math.max(8, textSize[0] * 0.3); // Dynamic padding based on text size
        
        // Calculate background rectangle
        const rectX = (size - textWidth) / 2 - padding;
        const rectY = (size - textHeight) / 2 - padding;
        const rectWidth = textWidth + padding * 2;
        const rectHeight = textHeight + padding * 2;

        // Add background with rounded corners
        ctx.fillStyle = bgColor;
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

        // Add border around text background for better contrast
        ctx.strokeStyle = qrColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

        // Add text with better styling
        ctx.fillStyle = qrColor;
        ctx.fillText(centerText, size / 2, size / 2);

        // Convert to data URL
        const finalDataUrl = canvas.toDataURL('image/png');
        setQrCodeUrl(finalDataUrl);
      };
      img.src = qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  useEffect(() => {
    generateQRCodeWithText(restaurant.url, currentSize.pixels);
  }, [restaurant.url, currentSize.pixels, centerText, textSize, qrColor, bgColor]);

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `qr-code-${restaurant.name.toLowerCase().replace(/\s+/g, '-')}-${selectedSize.toLowerCase()}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share && qrCodeUrl) {
      try {
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], `qr-code-${restaurant.name}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `QR Code for ${restaurant.name}`,
          text: `Scan this QR code to view the menu for ${restaurant.name}`,
          files: [file]
        });
      } catch (error) {
        console.log('Error sharing:', error);
        navigator.clipboard.writeText(restaurant.url);
        alert('Menu URL copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(restaurant.url);
      alert('Menu URL copied to clipboard!');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && qrCodeUrl) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${restaurant.name}</title>
            <style>
              body { 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh; 
                margin: 0; 
                font-family: Arial, sans-serif; 
              }
              .qr-container { text-align: center; }
              .restaurant-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
              .restaurant-subtitle { font-size: 16px; color: #666; margin-bottom: 20px; }
              .qr-code { border: 2px solid #ddd; padding: 20px; }
              .url { font-size: 14px; margin-top: 10px; color: #888; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="restaurant-name">${restaurant.name}</div>
              <div class="restaurant-subtitle">${restaurant.subtitle}</div>
              <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" />
              <div class="url">${restaurant.url}</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* QR Code Display */}
            <Card className="text-center lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <QrCode className="w-6 h-6 text-orange-600" />
                  QR Code - {selectedSize}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300 mx-auto w-fit">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="mx-auto"
                      style={{ width: currentSize.pixels, height: currentSize.pixels }}
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      <div className="text-center">
                        <QrCode className="w-12 h-12 mx-auto mb-2" />
                        Generating QR Code...
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Button onClick={handleDownload} className="w-full bg-orange-600 hover:bg-orange-700" disabled={!qrCodeUrl}>
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={handleShare} variant="outline" className="w-full" disabled={!qrCodeUrl}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button onClick={handlePrint} variant="outline" className="w-full" disabled={!qrCodeUrl}>
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customization Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Customize QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Center Text */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Type className="w-4 h-4" />
                    Center Text
                  </Label>
                  <Input
                    placeholder="Enter text for center"
                    value={centerText}
                    onChange={(e) => setCenterText(e.target.value)}
                    className="text-sm"
                  />
                </div>

                {/* Text Size */}
                {centerText && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Text Size: {textSize[0]}px
                    </Label>
                    <Slider
                      value={textSize}
                      onValueChange={setTextSize}
                      max={40}
                      min={8}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}

                {/* QR Color */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">QR Code Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1 text-sm"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Background Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      placeholder="#FFFFFF"
                      className="flex-1 text-sm"
                    />
                  </div>
                </div>

                {/* Quick Color Presets */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Quick Presets</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => { setQrColor('#000000'); setBgColor('#FFFFFF'); }}
                      className="w-full h-8 rounded border border-gray-300 bg-white relative"
                      title="Classic"
                    >
                      <div className="absolute inset-1 bg-black rounded-sm"></div>
                    </button>
                    <button
                      onClick={() => { setQrColor('#FFFFFF'); setBgColor('#000000'); }}
                      className="w-full h-8 rounded border border-gray-300 bg-black relative"
                      title="Inverted"
                    >
                      <div className="absolute inset-1 bg-white rounded-sm"></div>
                    </button>
                    <button
                      onClick={() => { setQrColor('#1f2937'); setBgColor('#f3f4f6'); }}
                      className="w-full h-8 rounded border border-gray-300 bg-gray-100 relative"
                      title="Gray"
                    >
                      <div className="absolute inset-1 bg-gray-800 rounded-sm"></div>
                    </button>
                    <button
                      onClick={() => { setQrColor('#dc2626'); setBgColor('#FFFFFF'); }}
                      className="w-full h-8 rounded border border-gray-300 bg-white relative"
                      title="Red"
                    >
                      <div className="absolute inset-1 bg-red-600 rounded-sm"></div>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Restaurant Information */}
          <Card className="mt-6">
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
                    <Button size="sm" variant="outline" onClick={() => window.open(restaurant.url, '_blank')}>
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
                  <h4 className="font-semibold text-orange-900 mb-2">Customization Features:</h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Add custom text in the center of QR code</li>
                    <li>• Adjust text size for perfect readability</li>
                    <li>• Change QR code and background colors</li>
                    <li>• Quick color presets for common themes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Sizes */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Available Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {sizeOptions.map((option) => (
                  <div 
                    key={option.size} 
                    className={`text-center p-4 border rounded-lg transition-colors cursor-pointer ${
                      selectedSize === option.size 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => handleSizeSelect(option.size)}
                  >
                    <div className="bg-black text-white text-xs p-2 rounded mb-2 mx-auto w-fit">
                      QR Preview
                    </div>
                    <h4 className="font-semibold">{option.size}</h4>
                    <p className="text-sm text-gray-600">{option.dimensions}</p>
                    <p className="text-xs text-gray-500 mt-1">{option.use}</p>
                    {selectedSize === option.size && (
                      <Badge className="mt-2 bg-orange-600">Selected</Badge>
                    )}
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


import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantAPI } from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { CLIENT_BASE_URL } from '@/config/env';

const QRCodePage = () => {
  const { id } = useParams<{ id: string }>();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantAPI.getById(id!),
    enabled: !!id,
  });

  // Generate client URL using restaurant slug
  const clientUrl = restaurant?.slug ? `${CLIENT_BASE_URL}/restaurants/client/${restaurant.slug}` : '';

  useEffect(() => {
    if (clientUrl) {
      QRCode.toDataURL(clientUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('QR Code generation error:', err));
    }
  }, [clientUrl]);

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${restaurant?.name || 'restaurant'}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded successfully!');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(clientUrl);
      toast.success('URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const openClientView = () => {
    window.open(clientUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">QR Code Menu</h1>
          <p className="text-gray-600 mt-2">Generate QR code for {restaurant.name}</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Restaurant QR Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {qrCodeUrl ? (
                <div className="flex flex-col items-center space-y-4">
                  <img src={qrCodeUrl} alt="QR Code" className="border rounded-lg" />
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button onClick={downloadQRCode} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Code
                    </Button>
                    <Button onClick={copyToClipboard} variant="outline">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy URL
                    </Button>
                    <Button onClick={openClientView} variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse">
                  <div className="w-72 h-72 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                  <p className="text-gray-500">Generating QR code...</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm text-gray-700 break-all">{clientUrl}</p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Customers can scan the QR code or visit this URL to view your menu and place orders.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Print the QR code and place it on tables</p>
                <p>• Customers scan the code to view your menu</p>
                <p>• Orders will be received in your dashboard</p>
                <p>• Make sure your restaurant slug is unique: <strong>{restaurant.slug}</strong></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;

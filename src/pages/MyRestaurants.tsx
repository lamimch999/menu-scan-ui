
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, QrCode, Edit, Eye, MapPin, Clock, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const MyRestaurants = () => {
  const restaurants = [
    {
      id: 1,
      name: "Pizza Palace",
      subtitle: "Authentic Italian Pizza",
      timing: "11:00 AM - 11:00 PM",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Downtown",
      status: "Active",
      coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Burger Barn",
      subtitle: "Gourmet Burgers & Fries",
      timing: "10:00 AM - 10:00 PM",
      phone: "+1 (555) 234-5678",
      address: "456 Oak Ave, Midtown",
      status: "Active",
      coverImage: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Taco Fiesta",
      subtitle: "Mexican Street Food",
      timing: "12:00 PM - 9:00 PM",
      phone: "+1 (555) 345-6789",
      address: "789 Pine St, Uptown",
      status: "Inactive",
      coverImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow-sm">
        <div className="flex items-center gap-4 p-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Restaurants</h1>
            <p className="text-gray-600">Manage your restaurant locations</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={restaurant.coverImage}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={restaurant.status === 'Active' ? 'default' : 'secondary'}
                    className={restaurant.status === 'Active' ? 'bg-green-600' : 'bg-gray-500'}
                  >
                    {restaurant.status}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{restaurant.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{restaurant.subtitle}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{restaurant.timing}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{restaurant.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.address}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Link to={`/restaurant/${restaurant.id}/menus`}>
                      <Menu className="w-4 h-4 mr-1" />
                      Menus
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="hover:bg-orange-50 hover:border-orange-300"
                  >
                    <Link to={`/restaurant/${restaurant.id}/qr`}>
                      <QrCode className="w-4 h-4 mr-1" />
                      QR Code
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hover:bg-green-50 hover:border-green-300"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hover:bg-purple-50 hover:border-purple-300"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Public View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyRestaurants;

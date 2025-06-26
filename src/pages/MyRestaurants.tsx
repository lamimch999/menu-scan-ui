
import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, QrCode, Edit, MapPin, Clock, Phone, Trash2, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { restaurantAPI, getImageUrl } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import EditRestaurantDialog from "@/components/restaurant/EditRestaurantDialog";

interface Restaurant {
  _id: string;
  name: string;
  subtitle?: string;
  description?: string;
  phone?: string;
  address?: string;
  operatingHours?: string;
  logo?: string;
  coverImage?: string;
  slug: string;
}

const MyRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const { toast } = useToast();
  const { logout } = useAuth();

  const fetchRestaurants = async () => {
    try {
      const data = await restaurantAPI.getAll();
      setRestaurants(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch restaurants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await restaurantAPI.delete(id);
        toast({
          title: "Restaurant Deleted",
          description: `${name} has been deleted successfully.`,
        });
        fetchRestaurants();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete restaurant",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
  };

  const handleEditSuccess = () => {
    setEditingRestaurant(null);
    fetchRestaurants();
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Restaurants</h1>
                <p className="text-gray-600">Manage your restaurant locations</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout} className="text-red-600 hover:text-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading restaurants...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Restaurants</h1>
              <p className="text-gray-600">Manage your restaurant locations</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout} className="text-red-600 hover:text-red-700">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="p-6">
        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No restaurants found. Create your first restaurant!</p>
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link to="/add-restaurant">Add Restaurant</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Card key={restaurant._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={restaurant.coverImage ? getImageUrl(restaurant.coverImage) : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop"}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-600">
                      Active
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{restaurant.name}</h3>
                    {restaurant.subtitle && (
                      <p className="text-gray-600 text-sm mb-3">{restaurant.subtitle}</p>
                    )}
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      {restaurant.operatingHours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{restaurant.operatingHours}</span>
                        </div>
                      )}
                      {restaurant.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{restaurant.phone}</span>
                        </div>
                      )}
                      {restaurant.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{restaurant.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Link to={`/restaurant/${restaurant._id}/menus`}>
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
                      <Link to={`/restaurant/${restaurant._id}/qr`}>
                        <QrCode className="w-4 h-4 mr-1" />
                        QR Code
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-green-50 hover:border-green-300"
                      onClick={() => handleEdit(restaurant)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-red-50 hover:border-red-300 text-red-600"
                      onClick={() => handleDelete(restaurant._id, restaurant.name)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {editingRestaurant && (
        <EditRestaurantDialog
          restaurant={editingRestaurant}
          onClose={() => setEditingRestaurant(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default MyRestaurants;

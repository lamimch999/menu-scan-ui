
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { clientAPI } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart, MapPin, Phone, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  available: boolean;
  logo?: string | null;
}

interface MenuCategory {
  _id: string;
  category: string;
  items: MenuItem[];
}

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  phone: string;
  subtitle: string;
  description: string;
  logo?: string | null;
  coverImage?: string | null;
  operatingHours: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const ClientRestaurant = () => {
  const { slug } = useParams<{ slug: string }>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [showCart, setShowCart] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['client-restaurant', slug],
    queryFn: () => clientAPI.getRestaurantBySlug(slug!),
    enabled: !!slug,
  });

  const restaurant: Restaurant = data?.restaurant;
  const menuCategories: MenuCategory[] = data?.menu || [];

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem._id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(cartItem =>
          cartItem._id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter(cartItem => cartItem._id !== itemId);
    });
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleOrder = async () => {
    if (!tableNumber.trim()) {
      toast.error('Please enter your table number');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity
        })),
        totalAmount: getTotalAmount(),
        tableNumber: parseInt(tableNumber),
      };

      await clientAPI.createOrder(restaurant._id, orderData);
      toast.success('Order placed successfully!');
      setCart([]);
      setTableNumber('');
      setShowCart(false);
    } catch (error) {
      toast.error('Failed to place order');
      console.error('Order error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Restaurant not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow-sm">
        {restaurant.coverImage && (
          <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${restaurant.coverImage})` }}></div>
        )}
        <div className="p-4">
          <div className="flex items-start gap-4">
            {restaurant.logo && (
              <img src={restaurant.logo} alt={restaurant.name} className="w-16 h-16 rounded-full object-cover" />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
              <p className="text-gray-600 text-sm mb-2">{restaurant.subtitle}</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {restaurant.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {restaurant.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {restaurant.operatingHours}
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-700 mt-3">{restaurant.description}</p>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="p-4 space-y-6">
        {menuCategories.map(category => (
          <div key={category._id}>
            <h2 className="text-xl font-semibold mb-3 text-gray-900">{category.category}</h2>
            <div className="space-y-3">
              {category.items.map(item => (
                <Card key={item._id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {item.logo && (
                        <img src={item.logo} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</span>
                          <div className="flex items-center gap-2">
                            {!item.available ? (
                              <Badge variant="destructive">Unavailable</Badge>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFromCart(item._id)}
                                  disabled={!cart.find(cartItem => cartItem._id === item._id)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center">
                                  {cart.find(cartItem => cartItem._id === item._id)?.quantity || 0}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addToCart(item)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => setShowCart(true)}
            className="rounded-full h-14 w-14 shadow-lg"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </Button>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] overflow-y-auto rounded-t-lg">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Order</h2>
                <Button variant="ghost" onClick={() => setShowCart(false)}>×</Button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {cart.map(item => (
                <div key={item._id} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => removeFromCart(item._id)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => addToCart(item)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Total: ${getTotalAmount().toFixed(2)}</span>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Table Number</label>
                  <input
                    type="number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your table number"
                  />
                </div>
                
                <Button onClick={handleOrder} className="w-full">
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientRestaurant;

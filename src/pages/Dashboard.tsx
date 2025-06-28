
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Store, ShoppingBag, CreditCard, TrendingUp, Users, Settings, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "@/utils/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardAPI.getDashboardData,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading dashboard data</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Restaurants",
      value: dashboardData?.totalRestaurants?.toString() || "0",
      change: "Total managed restaurants",
      icon: Store,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Total Orders",
      value: dashboardData?.totalOrders?.toString() || "0",
      change: "All time orders",
      icon: ShoppingBag,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      title: "Revenue",
      value: `$${dashboardData?.totalRevenue?.toFixed(2) || "0.00"}`,
      change: "Total revenue generated",
      icon: CreditCard,
      color: "text-orange-600",
      bg: "bg-orange-100"
    },
    {
      title: "Pending Orders",
      value: dashboardData?.pendingOrders?.toString() || "0",
      change: "Orders awaiting processing",
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-restaurant':
        navigate('/add-restaurant');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'account-settings':
        navigate('/account-settings');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow-sm">
        <div className="flex items-center gap-4 p-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Overview of your restaurant management</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                Top Selling Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.topItems?.length > 0 ? (
                  dashboardData.topItems.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Menu item</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-orange-600">
                          {item.totalSold} sold
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No sales data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => handleQuickAction('add-restaurant')}
                  className="p-4 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
                >
                  <h3 className="font-medium text-orange-900">Add New Restaurant</h3>
                  <p className="text-sm text-orange-700">Set up a new restaurant location</p>
                </button>
                <button 
                  onClick={() => handleQuickAction('orders')}
                  className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                >
                  <h3 className="font-medium text-blue-900">View Orders</h3>
                  <p className="text-sm text-blue-700">Check recent orders and status</p>
                </button>
                <button 
                  onClick={() => handleQuickAction('account-settings')}
                  className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                >
                  <h3 className="font-medium text-green-900">Account Management</h3>
                  <p className="text-sm text-green-700">Manage your account settings</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

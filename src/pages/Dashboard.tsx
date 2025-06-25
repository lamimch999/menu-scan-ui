
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Store, ShoppingBag, CreditCard, TrendingUp, Users } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Restaurants",
      value: "12",
      change: "+2 this month",
      icon: Store,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+18% from last month",
      icon: ShoppingBag,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      title: "Revenue",
      value: "$12,345",
      change: "+12% from last month",
      icon: CreditCard,
      color: "text-orange-600",
      bg: "bg-orange-100"
    },
    {
      title: "Active Customers",
      value: "856",
      change: "+5% from last month",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ];

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
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">New restaurant added</p>
                    <p className="text-sm text-gray-500">Pizza Palace</p>
                  </div>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Menu updated</p>
                    <p className="text-sm text-gray-500">Burger Barn</p>
                  </div>
                  <span className="text-xs text-gray-400">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">QR code generated</p>
                    <p className="text-sm text-gray-500">Taco Fiesta</p>
                  </div>
                  <span className="text-xs text-gray-400">1 day ago</span>
                </div>
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
                <button className="p-4 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200">
                  <h3 className="font-medium text-orange-900">Add New Restaurant</h3>
                  <p className="text-sm text-orange-700">Set up a new restaurant location</p>
                </button>
                <button className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
                  <h3 className="font-medium text-blue-900">View Orders</h3>
                  <p className="text-sm text-blue-700">Check recent orders and status</p>
                </button>
                <button className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200">
                  <h3 className="font-medium text-green-900">Generate QR Code</h3>
                  <p className="text-sm text-green-700">Create QR codes for restaurants</p>
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


import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Transactions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow-sm">
        <div className="flex items-center gap-4 p-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600">View payment history and financial reports</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Financial Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transactions Coming Soon</h3>
              <p className="text-gray-600">Transaction management and reporting will be available in the next update.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transactions;

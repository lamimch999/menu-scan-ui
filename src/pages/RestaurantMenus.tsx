
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const RestaurantMenus = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: ""
  });

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Appetizers",
      items: [
        { id: 1, name: "Garlic Bread", description: "Fresh baked bread with garlic butter", price: "$6.99" },
        { id: 2, name: "Mozzarella Sticks", description: "Crispy breaded mozzarella", price: "$8.99" }
      ]
    },
    {
      id: 2,
      name: "Main Dishes",
      items: [
        { id: 3, name: "Margherita Pizza", description: "Classic tomato, mozzarella, and basil", price: "$14.99" },
        { id: 4, name: "Pepperoni Pizza", description: "Pepperoni with mozzarella cheese", price: "$16.99" }
      ]
    },
    {
      id: 3,
      name: "Beverages",
      items: [
        { id: 5, name: "Coca Cola", description: "Refreshing soft drink", price: "$2.99" },
        { id: 6, name: "Fresh Orange Juice", description: "Freshly squeezed orange juice", price: "$4.99" }
      ]
    }
  ]);

  const addCategory = () => {
    if (!newCategory.trim()) return;
    
    const newCategoryObj = {
      id: Date.now(),
      name: newCategory,
      items: []
    };
    
    setCategories([...categories, newCategoryObj]);
    setNewCategory("");
    toast({
      title: "Category Added",
      description: `${newCategory} has been added to the menu.`,
    });
  };

  const addItem = () => {
    if (!newItem.name.trim() || !newItem.categoryId) return;
    
    const updatedCategories = categories.map(category => {
      if (category.id.toString() === newItem.categoryId) {
        return {
          ...category,
          items: [...category.items, {
            id: Date.now(),
            name: newItem.name,
            description: newItem.description,
            price: newItem.price
          }]
        };
      }
      return category;
    });
    
    setCategories(updatedCategories);
    setNewItem({ name: "", description: "", price: "", categoryId: "" });
    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to the menu.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Menus</h1>
              <p className="text-gray-600">Manage your restaurant menu items</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input
                      id="category-name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="e.g., Appetizers, Main Dishes"
                    />
                  </div>
                  <Button onClick={addCategory} className="w-full">
                    Add Category
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Menu Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="item-category">Category</Label>
                    <select
                      id="item-category"
                      value={newItem.categoryId}
                      onChange={(e) => setNewItem({...newItem, categoryId: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="item-name">Item Name</Label>
                    <Input
                      id="item-name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      placeholder="e.g., Margherita Pizza"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-description">Description</Label>
                    <Textarea
                      id="item-description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder="Describe the item..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-price">Price</Label>
                    <Input
                      id="item-price"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      placeholder="e.g., $12.99"
                    />
                  </div>
                  <Button onClick={addItem} className="w-full">
                    Add Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="bg-orange-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-orange-900">{category.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {category.items.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No items in this category yet. Add some items to get started.
                  </div>
                ) : (
                  <div className="divide-y">
                    {category.items.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-green-600 font-semibold">
                              <DollarSign className="w-4 h-4" />
                              {item.price}
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenus;

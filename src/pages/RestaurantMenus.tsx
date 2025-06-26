
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MenuCategory from "@/components/menu/MenuCategory";
import AddCategoryDialog from "@/components/menu/AddCategoryDialog";
import AddItemDialog from "@/components/menu/AddItemDialog";

const RestaurantMenus = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Appetizers",
      items: [
        { id: 1, name: "Garlic Bread", description: "Fresh baked bread with garlic butter", price: "$6.99", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop" },
        { id: 2, name: "Mozzarella Sticks", description: "Crispy breaded mozzarella", price: "$8.99", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop" }
      ]
    },
    {
      id: 2,
      name: "Main Dishes",
      items: [
        { id: 3, name: "Margherita Pizza", description: "Classic tomato, mozzarella, and basil", price: "$14.99", image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=200&fit=crop" },
        { id: 4, name: "Pepperoni Pizza", description: "Pepperoni with mozzarella cheese", price: "$16.99", image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop" }
      ]
    },
    {
      id: 3,
      name: "Beverages",
      items: [
        { id: 5, name: "Coca Cola", description: "Refreshing soft drink", price: "$2.99", image: "" },
        { id: 6, name: "Fresh Orange Juice", description: "Freshly squeezed orange juice", price: "$4.99", image: "" }
      ]
    }
  ]);

  const handleAddCategory = (categoryName: string) => {
    const newCategoryObj = {
      id: Date.now(),
      name: categoryName,
      items: []
    };
    
    setCategories([...categories, newCategoryObj]);
    toast({
      title: "Category Added",
      description: `${categoryName} has been added to the menu.`,
    });
  };

  const handleAddItem = (newItem: {
    name: string;
    description: string;
    price: string;
    categoryId: string;
    image: string;
  }) => {
    const updatedCategories = categories.map(category => {
      if (category.id.toString() === newItem.categoryId) {
        return {
          ...category,
          items: [...category.items, {
            id: Date.now(),
            name: newItem.name,
            description: newItem.description,
            price: newItem.price,
            image: newItem.image
          }]
        };
      }
      return category;
    });
    
    setCategories(updatedCategories);
    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to the menu.`,
    });
  };

  const handleEditCategory = (category: any) => {
    // TODO: Implement edit category functionality
    console.log("Edit category:", category);
  };

  const handleDeleteCategory = (categoryId: number) => {
    // TODO: Implement delete category functionality
    console.log("Delete category:", categoryId);
  };

  const handleEditItem = (item: any) => {
    // TODO: Implement edit item functionality
    console.log("Edit item:", item);
  };

  const handleDeleteItem = (itemId: number) => {
    // TODO: Implement delete item functionality
    console.log("Delete item:", itemId);
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
            <AddCategoryDialog onAddCategory={handleAddCategory} />
            <AddItemDialog categories={categories} onAddItem={handleAddItem} />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {categories.map((category) => (
            <MenuCategory
              key={category.id}
              category={category}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenus;

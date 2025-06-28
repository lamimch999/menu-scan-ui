import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MenuCategory from "@/components/menu/MenuCategory";
import AddCategoryDialog from "@/components/menu/AddCategoryDialog";
import AddItemDialog from "@/components/menu/AddItemDialog";
import { menuAPI } from "@/utils/api";

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
  restaurantId: string;
  items: MenuItem[];
}

const RestaurantMenus = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenus = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await menuAPI.getAllMenus(id);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching menus:', error);
      toast({
        title: "Error",
        description: "Failed to load menus. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [id]);

  const handleAddCategory = async (categoryName: string) => {
    if (!id) return;
    
    try {
      await menuAPI.createMenuCategory({
        restaurantId: id,
        category: categoryName
      });
      
      toast({
        title: "Category Added",
        description: `${categoryName} has been added to the menu.`,
      });
      
      // Refresh the menu list
      fetchMenus();
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = async (newItem: {
    name: string;
    description: string;
    price: string;
    categoryId: string;
    image: File | null;
  }) => {
    try {
      const itemData = {
        name: newItem.name,
        price: parseFloat(newItem.price.replace('$', '')),
        available: true,
        image: newItem.image
      };
      
      await menuAPI.createMenuItems(newItem.categoryId, [itemData]);
      
      toast({
        title: "Item Added",
        description: `${newItem.name} has been added to the menu.`,
      });
      
      // Refresh the menu list
      fetchMenus();
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = async (category: MenuCategory, newName: string) => {
    try {
      await menuAPI.updateMenuCategory(category._id, { category: newName });
      
      toast({
        title: "Category Updated",
        description: `Category has been updated to ${newName}.`,
      });
      
      // Refresh the menu list
      fetchMenus();
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await menuAPI.deleteMenuCategory(categoryId);
      
      toast({
        title: "Category Deleted",
        description: "Category has been deleted successfully.",
      });
      
      // Refresh the menu list
      fetchMenus();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = async (item: MenuItem, menuId: string, updatedData: {name: string; price: number; available: boolean; image?: File}) => {
    try {
      await menuAPI.updateMenuItem(menuId, item._id, updatedData);
      
      toast({
        title: "Item Updated",
        description: `${updatedData.name} has been updated successfully.`,
      });
      
      // Refresh the menu list
      fetchMenus();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (itemId: string, menuId: string) => {
    try {
      await menuAPI.deleteMenuItem(menuId, itemId);
      
      toast({
        title: "Item Deleted",
        description: "Item has been deleted successfully.",
      });
      
      // Refresh the menu list
      fetchMenus();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menus...</p>
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
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No menu categories found.</p>
              <p className="text-gray-400">Start by adding a category to organize your menu items.</p>
            </div>
          ) : (
            categories.map((category) => (
              <MenuCategory
                key={category._id}
                category={category}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onEditItem={handleEditItem}
                onDeleteItem={(itemId) => handleDeleteItem(itemId, category._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenus;

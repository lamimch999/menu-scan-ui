
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import MenuItem from "./MenuItem";

interface MenuItemType {
  _id: string;
  name: string;
  price: number;
  available: boolean;
  logo?: string | null;
}

interface MenuCategoryProps {
  category: {
    _id: string;
    category: string;
    restaurantId: string;
    items: MenuItemType[];
  };
  onEditCategory: (category: any, newName: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onEditItem: (item: MenuItemType, menuId: string, updatedData: {name: string; price: number; available: boolean; logo?: string}) => void;
  onDeleteItem: (itemId: string) => void;
}

const MenuCategory = ({ 
  category, 
  onEditCategory, 
  onDeleteCategory, 
  onEditItem, 
  onDeleteItem 
}: MenuCategoryProps) => {
  const handleEditCategory = () => {
    const newName = prompt('Enter new category name:', category.category);
    if (newName && newName.trim() && newName !== category.category) {
      onEditCategory(category, newName.trim());
    }
  };

  return (
    <Card>
      <CardHeader className="bg-orange-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-orange-900">{category.category}</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleEditCategory}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={() => {
                if (confirm('Are you sure you want to delete this category? This will delete all items in it.')) {
                  onDeleteCategory(category._id);
                }
              }}
            >
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
              <MenuItem
                key={item._id}
                item={item}
                menuId={category._id}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuCategory;

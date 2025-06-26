
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import MenuItem from "./MenuItem";

interface MenuCategoryProps {
  category: {
    id: number;
    name: string;
    items: Array<{
      id: number;
      name: string;
      description: string;
      price: string;
      image?: string;
    }>;
  };
  onEditCategory: (category: any) => void;
  onDeleteCategory: (categoryId: number) => void;
  onEditItem: (item: any) => void;
  onDeleteItem: (itemId: number) => void;
}

const MenuCategory = ({ 
  category, 
  onEditCategory, 
  onDeleteCategory, 
  onEditItem, 
  onDeleteItem 
}: MenuCategoryProps) => {
  return (
    <Card>
      <CardHeader className="bg-orange-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-orange-900">{category.name}</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEditCategory(category)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={() => onDeleteCategory(category.id)}
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
                key={item.id}
                item={item}
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


import { Button } from "@/components/ui/button";
import { Edit, Trash2, DollarSign } from "lucide-react";

interface MenuItemProps {
  item: {
    id: number;
    name: string;
    description: string;
    price: string;
    image?: string;
  };
  onEdit: (item: any) => void;
  onDelete: (itemId: number) => void;
}

const MenuItem = ({ item, onEdit, onDelete }: MenuItemProps) => {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        {item.image && (
          <div className="flex-shrink-0">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-16 h-16 object-cover rounded-md border"
            />
          </div>
        )}
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
            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;

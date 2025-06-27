
import { Button } from "@/components/ui/button";
import { Edit, Trash2, DollarSign } from "lucide-react";
import { useState } from "react";
import EditItemDialog from "./EditItemDialog";

interface MenuItemProps {
  item: {
    _id: string;
    name: string;
    price: number;
    available: boolean;
    logo?: string | null;
  };
  menuId: string;
  onEdit: (item: any, menuId: string, updatedData: {name: string; price: number; available: boolean; logo?: string}) => void;
  onDelete: (itemId: string) => void;
}

const MenuItem = ({ item, menuId, onEdit, onDelete }: MenuItemProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEditItem = (updatedData: {name: string; price: number; available: boolean; logo?: string}) => {
    onEdit(item, menuId, updatedData);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      onDelete(item._id);
    }
  };

  return (
    <>
      <div className="p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4">
          {item.logo && (
            <div className="flex-shrink-0">
              <img 
                src={item.logo} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md border"
              />
            </div>
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{item.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-green-600 font-semibold">
              <DollarSign className="w-4 h-4" />
              {item.price.toFixed(2)}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setShowEditDialog(true)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <EditItemDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        item={item}
        onEditItem={handleEditItem}
      />
    </>
  );
};

export default MenuItem;

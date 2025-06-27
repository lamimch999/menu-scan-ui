
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface EditItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    _id: string;
    name: string;
    price: number;
    available: boolean;
    logo?: string | null;
  };
  onEditItem: (updatedData: {
    name: string;
    price: number;
    available: boolean;
    logo?: string;
  }) => void;
}

const EditItemDialog = ({ isOpen, onClose, item, onEditItem }: EditItemDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    price: "",
    available: true,
    image: ""
  });

  useEffect(() => {
    if (item) {
      setEditData({
        name: item.name,
        description: "",
        price: item.price.toString(),
        available: item.available,
        image: item.logo || ""
      });
    }
  }, [item]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditData({ ...editData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setEditData({ ...editData, image: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (!editData.name.trim() || !editData.price.trim()) return;
    
    onEditItem({
      name: editData.name.trim(),
      price: parseFloat(editData.price),
      available: editData.available,
      logo: editData.image || undefined
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-item-image">Item Image</Label>
            <div className="space-y-2">
              {editData.image ? (
                <div className="relative">
                  <img 
                    src={editData.image} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500 mb-2">Upload an image</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-item-name">Item Name</Label>
            <Input
              id="edit-item-name"
              value={editData.name}
              onChange={(e) => setEditData({...editData, name: e.target.value})}
              placeholder="e.g., Margherita Pizza"
            />
          </div>

          <div>
            <Label htmlFor="edit-item-description">Description (Optional)</Label>
            <Textarea
              id="edit-item-description"
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              placeholder="Describe the item..."
            />
          </div>

          <div>
            <Label htmlFor="edit-item-price">Price</Label>
            <Input
              id="edit-item-price"
              type="number"
              step="0.01"
              value={editData.price}
              onChange={(e) => setEditData({...editData, price: e.target.value})}
              placeholder="12.99"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="edit-item-available"
              checked={editData.available}
              onChange={(e) => setEditData({...editData, available: e.target.checked})}
              className="rounded"
            />
            <Label htmlFor="edit-item-available">Available</Label>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1" disabled={!editData.name.trim() || !editData.price.trim()}>
              Save Changes
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;

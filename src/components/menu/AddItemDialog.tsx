
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, X } from "lucide-react";
import { useState, useRef } from "react";

interface AddItemDialogProps {
  categories: Array<{ _id: string; category: string }>;
  onAddItem: (item: {
    name: string;
    description: string;
    price: string;
    categoryId: string;
    image: string;
  }) => void;
}

const AddItemDialog = ({ categories, onAddItem }: AddItemDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: ""
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setNewItem({ ...newItem, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewItem({ ...newItem, image: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.categoryId || !newItem.price.trim()) return;
    onAddItem(newItem);
    setNewItem({ name: "", description: "", price: "", categoryId: "", image: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
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
                <option key={category._id} value={category._id}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="item-image">Item Image</Label>
            <div className="space-y-2">
              {newItem.image ? (
                <div className="relative">
                  <img 
                    src={newItem.image} 
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
            <Label htmlFor="item-name">Item Name</Label>
            <Input
              id="item-name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              placeholder="e.g., Margherita Pizza"
            />
          </div>
          <div>
            <Label htmlFor="item-description">Description (Optional)</Label>
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
              type="number"
              step="0.01"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              placeholder="12.99"
            />
          </div>
          <Button onClick={handleAddItem} className="w-full" disabled={!newItem.name.trim() || !newItem.categoryId || !newItem.price.trim()}>
            Add Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;

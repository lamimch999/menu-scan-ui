
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AddCategoryDialogProps {
  onAddCategory: (categoryName: string) => void;
}

const AddCategoryDialog = ({ onAddCategory }: AddCategoryDialogProps) => {
  const [newCategory, setNewCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    onAddCategory(newCategory);
    setNewCategory("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <Button onClick={handleAddCategory} className="w-full">
            Add Category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;

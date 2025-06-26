
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { restaurantAPI } from "@/utils/api";

interface Restaurant {
  _id: string;
  name: string;
  subtitle?: string;
  description?: string;
  phone?: string;
  address?: string;
  operatingHours?: string;
  logo?: string;
  coverImage?: string;
  slug: string;
}

interface EditRestaurantDialogProps {
  restaurant: Restaurant;
  onClose: () => void;
  onSuccess: () => void;
}

const EditRestaurantDialog = ({ restaurant, onClose, onSuccess }: EditRestaurantDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: restaurant.name || "",
    slug: restaurant.slug || "",
    subtitle: restaurant.subtitle || "",
    operatingHours: restaurant.operatingHours || "",
    phone: restaurant.phone || "",
    description: restaurant.description || "",
    address: restaurant.address || "",
    logo: null as File | null,
    coverImage: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('slug', formData.slug);
      submitData.append('subtitle', formData.subtitle);
      submitData.append('operatingHours', formData.operatingHours);
      submitData.append('phone', formData.phone);
      submitData.append('description', formData.description);
      submitData.append('address', formData.address);
      
      if (formData.logo) {
        submitData.append('logo', formData.logo);
      }
      if (formData.coverImage) {
        submitData.append('coverImage', formData.coverImage);
      }

      await restaurantAPI.update(restaurant._id, submitData);
      
      toast({
        title: "Restaurant Updated Successfully!",
        description: `${formData.name} has been updated.`,
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast({
        title: "Error",
        description: "Failed to update restaurant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Restaurant</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Restaurant Name *</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter restaurant name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug *</Label>
              <Input
                id="edit-slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="restaurant-slug"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-subtitle">Subtitle</Label>
              <Input
                id="edit-subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="Brief description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-operatingHours">Operating Hours</Label>
              <Input
                id="edit-operatingHours"
                name="operatingHours"
                value={formData.operatingHours}
                onChange={handleInputChange}
                placeholder="e.g., 9:00 AM - 10:00 PM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your restaurant..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-address">Address</Label>
            <Textarea
              id="edit-address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Full restaurant address"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="edit-logo">Restaurant Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  {formData.logo ? formData.logo.name : "Click to upload new logo"}
                </p>
                <Input
                  id="edit-logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'logo')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('edit-logo')?.click()}
                >
                  Choose File
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cover">Cover Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  {formData.coverImage ? formData.coverImage.name : "Click to upload new cover"}
                </p>
                <Input
                  id="edit-cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'coverImage')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('edit-cover')?.click()}
                >
                  Choose File
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Updating..." : "Update Restaurant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRestaurantDialog;

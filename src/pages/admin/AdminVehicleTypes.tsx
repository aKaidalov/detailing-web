import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import {
  useAdminVehicleTypes,
  useCreateVehicleType,
  useUpdateVehicleType,
  useDeleteVehicleType,
} from '../../api/hooks';
import type { VehicleType, CreateVehicleTypeRequest } from '../../api/types';
import { Plus, Edit, Trash, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type FormData = {
  name: string;
  description: string;
  basePrice: string;
  isDeliverable: boolean;
  displayOrder: string;
  isActive: boolean;
};

const emptyForm: FormData = {
  name: '',
  description: '',
  basePrice: '',
  isDeliverable: true,
  displayOrder: '0',
  isActive: true,
};

type FormErrors = {
  name?: string;
  basePrice?: string;
};

export function AdminVehicleTypes() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VehicleType | null>(null);
  const [deletingItem, setDeletingItem] = useState<VehicleType | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { data: vehicleTypes, isLoading, error } = useAdminVehicleTypes();
  const createMutation = useCreateVehicleType();
  const updateMutation = useUpdateVehicleType();
  const deleteMutation = useDeleteVehicleType();

  const validateField = (field: keyof FormErrors, value: string): string | undefined => {
    if (field === 'name' && !value.trim()) return 'Name is required';
    if (field === 'basePrice' && (!value.trim() || parseFloat(value) < 0)) return 'Valid price is required';
    return undefined;
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = formData[field];
    setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setErrors({});
    setTouched({});
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: VehicleType) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      basePrice: item.basePrice.toString(),
      isDeliverable: item.isDeliverable,
      displayOrder: item.displayOrder.toString(),
      isActive: item.isActive,
    });
    setErrors({});
    setTouched({});
    setDialogOpen(true);
  };

  const handleOpenDelete = (item: VehicleType) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = () => {
    // Validate all fields
    const nameError = validateField('name', formData.name);
    const priceError = validateField('basePrice', formData.basePrice);

    if (nameError || priceError) {
      setErrors({ name: nameError, basePrice: priceError });
      setTouched({ name: true, basePrice: true });
      return;
    }

    const data: CreateVehicleTypeRequest = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      basePrice: parseFloat(formData.basePrice) || 0,
      isDeliverable: formData.isDeliverable,
      displayOrder: parseInt(formData.displayOrder) || 0,
      isActive: formData.isActive,
    };

    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data },
        {
          onSuccess: () => {
            toast.success('Vehicle type updated');
            setDialogOpen(false);
          },
          onError: (err) => toast.error(`Failed to update: ${err.message}`),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Vehicle type created');
          setDialogOpen(false);
        },
        onError: (err) => toast.error(`Failed to create: ${err.message}`),
      });
    }
  };

  const handleDelete = () => {
    if (!deletingItem) return;
    deleteMutation.mutate(deletingItem.id, {
      onSuccess: () => {
        toast.success('Vehicle type deleted');
        setDeleteDialogOpen(false);
        setDeletingItem(null);
      },
      onError: (err) => toast.error(`Failed to delete: ${err.message}`),
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-8">
        Failed to load vehicle types: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Vehicle Types</h2>
          <p className="text-muted-foreground mt-1">
            Manage vehicle categories and base pricing
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle Type
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {!vehicleTypes?.length ? (
            <div className="text-center text-muted-foreground py-8">
              No vehicle types found
            </div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead className="hidden md:table-cell">Deliverable</TableHead>
                  <TableHead className="hidden md:table-cell">Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicleTypes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate text-muted-foreground">
                      {item.description || '-'}
                    </TableCell>
                    <TableCell>€{item.basePrice.toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.isDeliverable ? (
                        <Badge className="bg-green-500/10 text-green-600">Yes</Badge>
                      ) : (
                        <Badge className="bg-gray-500/10 text-gray-600">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{item.displayOrder}</TableCell>
                    <TableCell>
                      {item.isActive ? (
                        <Badge className="bg-green-500/10 text-green-600">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-500/10 text-gray-600">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDelete(item)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Vehicle Type' : 'Add Vehicle Type'}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? 'Update vehicle type details'
                : 'Create a new vehicle category'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onBlur={() => handleBlur('name')}
                placeholder="e.g., Car, Van, Motorcycle"
                aria-invalid={touched.name && !!errors.name}
              />
              {touched.name && errors.name && (
                <p className="text-destructive text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price (€) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  onBlur={() => handleBlur('basePrice')}
                  placeholder="0.00"
                  aria-invalid={touched.basePrice && !!errors.basePrice}
                />
                {touched.basePrice && errors.basePrice && (
                  <p className="text-destructive text-sm">{errors.basePrice}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  min="0"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="isDeliverable"
                  checked={formData.isDeliverable}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, isDeliverable: checked })
                  }
                />
                <Label htmlFor="isDeliverable">Deliverable</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingItem?.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

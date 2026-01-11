import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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
  useAdminDeliveryTypes,
  useCreateDeliveryType,
  useUpdateDeliveryType,
  useDeleteDeliveryType,
} from '../../api/hooks';
import type { DeliveryType, CreateDeliveryTypeRequest } from '../../api/types';
import { Plus, Edit, Trash, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePagination } from '../../hooks/usePagination';
import { PaginationControls } from '../../components/PaginationControls';

type FormData = {
  name: string;
  icon: string;
  price: string;
  requiresAddress: boolean;
  isActive: boolean;
};

const emptyForm: FormData = {
  name: '',
  icon: '',
  price: '0',
  requiresAddress: false,
  isActive: true,
};

type FormErrors = {
  name?: string;
  icon?: string;
};

export function AdminDeliveryTypes() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DeliveryType | null>(null);
  const [deletingItem, setDeletingItem] = useState<DeliveryType | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { data: deliveryTypes, isLoading, error } = useAdminDeliveryTypes();
  const createMutation = useCreateDeliveryType();
  const updateMutation = useUpdateDeliveryType();
  const deleteMutation = useDeleteDeliveryType();

  const {
    paginatedData: paginatedDeliveryTypes,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setPage,
    setPageSize,
  } = usePagination({ data: deliveryTypes || [], defaultPageSize: 10 });

  const validateField = (field: keyof FormErrors, value: string): string | undefined => {
    if (field === 'name' && !value.trim()) return 'Name is required';
    if (field === 'icon' && !value.trim()) return 'Icon is required';
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

  const handleOpenEdit = (item: DeliveryType) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      icon: item.icon,
      price: item.price.toString(),
      requiresAddress: item.requiresAddress,
      isActive: item.isActive,
    });
    setErrors({});
    setTouched({});
    setDialogOpen(true);
  };

  const handleOpenDelete = (item: DeliveryType) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = () => {
    // Validate all fields
    const nameError = validateField('name', formData.name);
    const iconError = validateField('icon', formData.icon);

    if (nameError || iconError) {
      setErrors({ name: nameError, icon: iconError });
      setTouched({ name: true, icon: true });
      return;
    }

    const data: CreateDeliveryTypeRequest = {
      name: formData.name.trim(),
      icon: formData.icon.trim(),
      price: parseFloat(formData.price) || 0,
      requiresAddress: formData.requiresAddress,
      isActive: formData.isActive,
    };

    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data },
        {
          onSuccess: () => {
            toast.success('Delivery type updated');
            setDialogOpen(false);
          },
          onError: (err) => toast.error(`Failed to update: ${err.message}`),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Delivery type created');
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
        toast.success('Delivery type deleted');
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
        Failed to load delivery types: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Delivery Types</h2>
          <p className="text-muted-foreground mt-1">
            Manage delivery and pickup options
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Delivery Type
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {totalItems === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No delivery types found
            </div>
          ) : (
            <>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden md:table-cell">Requires Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDeliveryTypes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-2xl">{item.icon}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {item.price === 0 ? 'Free' : `€${item.price.toFixed(2)}`}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.requiresAddress ? (
                        <Badge className="bg-blue-500/10 text-blue-600">Yes</Badge>
                      ) : (
                        <Badge className="bg-gray-500/10 text-gray-600">No</Badge>
                      )}
                    </TableCell>
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
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Delivery Type' : 'Add Delivery Type'}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? 'Update delivery type details'
                : 'Create a new delivery or pickup option'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-[1fr,80px] gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onBlur={() => handleBlur('name')}
                  placeholder="e.g., Pickup, Home Delivery"
                  aria-invalid={touched.name && !!errors.name}
                />
                {touched.name && errors.name && (
                  <p className="text-destructive text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon *</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  onBlur={() => handleBlur('icon')}
                  className="text-center text-2xl"
                  aria-invalid={touched.icon && !!errors.icon}
                />
                {touched.icon && errors.icon && (
                  <p className="text-destructive text-sm">{errors.icon}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00 (free)"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="requiresAddress"
                  checked={formData.requiresAddress}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, requiresAddress: checked })
                  }
                />
                <Label htmlFor="requiresAddress">Requires Address</Label>
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
            <AlertDialogTitle>Delete Delivery Type</AlertDialogTitle>
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

import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
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
  useAdminPackages,
  useCreatePackage,
  useUpdatePackage,
  useDeletePackage,
  useAdminVehicleTypes,
} from '../../api/hooks';
import type { Package, CreatePackageRequest } from '../../api/types';
import { Plus, Edit, Trash, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePagination } from '../../hooks/usePagination';
import { PaginationControls } from '../../components/PaginationControls';

type FormData = {
  name: string;
  description: string;
  price: string;
  displayOrder: string;
  isActive: boolean;
  vehicleTypeIds: number[];
};

const emptyForm: FormData = {
  name: '',
  description: '',
  price: '',
  displayOrder: '0',
  isActive: true,
  vehicleTypeIds: [],
};

type FormErrors = {
  name?: string;
  price?: string;
  vehicleTypeIds?: string;
};

export function AdminPackages() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Package | null>(null);
  const [deletingItem, setDeletingItem] = useState<Package | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { data: packages, isLoading, error } = useAdminPackages();
  const { data: vehicleTypes } = useAdminVehicleTypes();
  const createMutation = useCreatePackage();
  const updateMutation = useUpdatePackage();
  const deleteMutation = useDeletePackage();

  const {
    paginatedData: paginatedPackages,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setPage,
    setPageSize,
  } = usePagination({ data: packages || [], defaultPageSize: 10 });

  const validateField = (field: keyof FormErrors, value: string | number[]): string | undefined => {
    if (field === 'name' && !(value as string).trim()) return 'Name is required';
    if (field === 'price' && (!(value as string).trim() || parseFloat(value as string) < 0)) return 'Valid price is required';
    if (field === 'vehicleTypeIds' && (value as number[]).length === 0) return 'Select at least one vehicle type';
    return undefined;
  };

  const handleBlur = (field: 'name' | 'price') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = formData[field];
    setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      ...emptyForm,
      vehicleTypeIds: vehicleTypes?.map((vt) => vt.id) || [],
    });
    setErrors({});
    setTouched({});
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: Package) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      displayOrder: item.displayOrder.toString(),
      isActive: item.isActive,
      vehicleTypeIds: item.vehicleTypeIds || [],
    });
    setErrors({});
    setTouched({});
    setDialogOpen(true);
  };

  const handleOpenDelete = (item: Package) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const toggleVehicleType = (vtId: number) => {
    setFormData((prev) => ({
      ...prev,
      vehicleTypeIds: prev.vehicleTypeIds.includes(vtId)
        ? prev.vehicleTypeIds.filter((id) => id !== vtId)
        : [...prev.vehicleTypeIds, vtId],
    }));
  };

  const handleSubmit = () => {
    // Validate all fields
    const nameError = validateField('name', formData.name);
    const priceError = validateField('price', formData.price);
    const vehicleTypesError = validateField('vehicleTypeIds', formData.vehicleTypeIds);

    if (nameError || priceError || vehicleTypesError) {
      setErrors({ name: nameError, price: priceError, vehicleTypeIds: vehicleTypesError });
      setTouched({ name: true, price: true, vehicleTypeIds: true });
      return;
    }

    const data: CreatePackageRequest = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      price: parseFloat(formData.price) || 0,
      displayOrder: parseInt(formData.displayOrder) || 0,
      isActive: formData.isActive,
      vehicleTypeIds: formData.vehicleTypeIds,
    };

    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data },
        {
          onSuccess: () => {
            toast.success('Package updated');
            setDialogOpen(false);
          },
          onError: (err) => toast.error(`Failed to update: ${err.message}`),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Package created');
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
        toast.success('Package deleted');
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
        Failed to load packages: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Packages</h2>
          <p className="text-muted-foreground mt-1">
            Manage service packages and pricing
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Package
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {totalItems === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No packages found
            </div>
          ) : (
            <>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden md:table-cell">Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPackages.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate text-muted-foreground">
                      {item.description || '-'}
                    </TableCell>
                    <TableCell>€{item.price.toFixed(2)}</TableCell>
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
              {editingItem ? 'Edit Package' : 'Add Package'}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? 'Update package details'
                : 'Create a new service package'}
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
                placeholder="e.g., Full Wash, Premium Detail"
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
                placeholder="Package description and included services"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  onBlur={() => handleBlur('price')}
                  placeholder="0.00"
                  aria-invalid={touched.price && !!errors.price}
                />
                {touched.price && errors.price && (
                  <p className="text-destructive text-sm">{errors.price}</p>
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

            <div className="space-y-2">
              <Label>Vehicle Types *</Label>
              <div className={`border rounded-md p-3 space-y-2 ${touched.vehicleTypeIds && errors.vehicleTypeIds ? 'border-destructive' : ''}`}>
                {vehicleTypes?.map((vt) => (
                  <div key={vt.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`vt-${vt.id}`}
                      checked={formData.vehicleTypeIds.includes(vt.id)}
                      onCheckedChange={() => toggleVehicleType(vt.id)}
                    />
                    <Label htmlFor={`vt-${vt.id}`} className="font-normal">
                      {vt.name}
                    </Label>
                  </div>
                ))}
                {!vehicleTypes?.length && (
                  <p className="text-sm text-muted-foreground">
                    No vehicle types available
                  </p>
                )}
              </div>
              {touched.vehicleTypeIds && errors.vehicleTypeIds && (
                <p className="text-destructive text-sm">{errors.vehicleTypeIds}</p>
              )}
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
            <AlertDialogTitle>Delete Package</AlertDialogTitle>
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

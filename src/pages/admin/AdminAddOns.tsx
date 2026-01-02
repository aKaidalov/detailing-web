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
  useAdminAddOns,
  useCreateAddOn,
  useUpdateAddOn,
  useDeleteAddOn,
  useAdminPackages,
} from '../../api/hooks';
import type { AddOn, CreateAddOnRequest } from '../../api/types';
import { Plus, Edit, Trash, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type FormData = {
  name: string;
  description: string;
  price: string;
  displayOrder: string;
  isActive: boolean;
  packageIds: number[];
};

const emptyForm: FormData = {
  name: '',
  description: '',
  price: '',
  displayOrder: '0',
  isActive: true,
  packageIds: [],
};

export function AdminAddOns() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AddOn | null>(null);
  const [deletingItem, setDeletingItem] = useState<AddOn | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  const { data: addOns, isLoading, error } = useAdminAddOns();
  const { data: packages } = useAdminPackages();
  const createMutation = useCreateAddOn();
  const updateMutation = useUpdateAddOn();
  const deleteMutation = useDeleteAddOn();

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      ...emptyForm,
      packageIds: packages?.map((p) => p.id) || [],
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: AddOn) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      displayOrder: item.displayOrder.toString(),
      isActive: item.isActive,
      packageIds: item.packageIds || [],
    });
    setDialogOpen(true);
  };

  const handleOpenDelete = (item: AddOn) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const togglePackage = (pkgId: number) => {
    setFormData((prev) => ({
      ...prev,
      packageIds: prev.packageIds.includes(pkgId)
        ? prev.packageIds.filter((id) => id !== pkgId)
        : [...prev.packageIds, pkgId],
    }));
  };

  const handleSubmit = () => {
    const data: CreateAddOnRequest = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      price: parseFloat(formData.price) || 0,
      displayOrder: parseInt(formData.displayOrder) || 0,
      isActive: formData.isActive,
      packageIds: formData.packageIds,
    };

    if (!data.name) {
      toast.error('Name is required');
      return;
    }

    if (formData.packageIds.length === 0) {
      toast.error('Select at least one package');
      return;
    }

    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data },
        {
          onSuccess: () => {
            toast.success('Add-on updated');
            setDialogOpen(false);
          },
          onError: (err) => toast.error(`Failed to update: ${err.message}`),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Add-on created');
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
        toast.success('Add-on deleted');
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
        Failed to load add-ons: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Add-ons</h2>
          <p className="text-muted-foreground mt-1">
            Manage optional add-on services
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Add-on
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {!addOns?.length ? (
            <div className="text-center text-muted-foreground py-8">
              No add-ons found
            </div>
          ) : (
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
                {addOns.map((item) => (
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
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Add-on' : 'Add Add-on'}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? 'Update add-on details'
                : 'Create a new optional add-on service'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Engine Cleaning, Ceramic Coating"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add-on description"
                rows={2}
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
                  placeholder="0.00"
                />
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
              <Label>Available for Packages *</Label>
              <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                {packages?.map((pkg) => (
                  <div key={pkg.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`pkg-${pkg.id}`}
                      checked={formData.packageIds.includes(pkg.id)}
                      onCheckedChange={() => togglePackage(pkg.id)}
                    />
                    <Label htmlFor={`pkg-${pkg.id}`} className="font-normal">
                      {pkg.name}
                    </Label>
                  </div>
                ))}
                {!packages?.length && (
                  <p className="text-sm text-muted-foreground">
                    No packages available
                  </p>
                )}
              </div>
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
            <AlertDialogTitle>Delete Add-on</AlertDialogTitle>
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

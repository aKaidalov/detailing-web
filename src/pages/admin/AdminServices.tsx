import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
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
  DialogTrigger,
} from '../../components/ui/dialog';
import { services } from '../../data/mockData';
import { Plus, Edit, Trash } from 'lucide-react';

export function AdminServices() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>{t('admin.services')}</h2>
          <p className="text-muted-foreground mt-1">
            Manage your service offerings and pricing
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('common.add')} Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Create a new service offering with pricing details
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name</Label>
                <Input id="serviceName" placeholder="e.g., Full Wash" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Service description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="motorcyclePrice">Motorcycle Price (€)</Label>
                  <Input id="motorcyclePrice" type="number" placeholder="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carPrice">Car Price (€)</Label>
                  <Input id="carPrice" type="number" placeholder="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vanPrice">Van Price (€)</Label>
                  <Input id="vanPrice" type="number" placeholder="70" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={() => setOpen(false)}>
                  {t('common.save')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Motorcycle</TableHead>
                <TableHead>Car</TableHead>
                <TableHead>Van</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{t(`service.${service.id}`)}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {t(`service.${service.id}.desc`)}
                  </TableCell>
                  <TableCell>
                    {service.prices.motorcycle
                      ? `€${service.prices.motorcycle}`
                      : '-'}
                  </TableCell>
                  <TableCell>€{service.prices.car}</TableCell>
                  <TableCell>€{service.prices.van}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

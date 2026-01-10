import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
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
} from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Edit, Loader2, Mail } from 'lucide-react';
import { useNotifications, useUpdateNotification } from '../../api/hooks';
import type { NotificationDto, NotificationType } from '../../api/types';

const typeLabels: Record<NotificationType, string> = {
  BOOKING_CREATED: 'Booking Created',
  BOOKING_CONFIRMED: 'Booking Confirmed',
  BOOKING_MODIFIED: 'Booking Modified',
  BOOKING_COMPLETED: 'Booking Completed',
  BOOKING_CANCELLED_BY_CUSTOMER: 'Cancelled by Customer',
  BOOKING_CANCELLED_BY_ADMIN: 'Cancelled by Admin',
};

export function AdminNotifications() {
  const { data: notifications, isLoading, error } = useNotifications();
  const updateMutation = useUpdateNotification();

  const [editingNotification, setEditingNotification] = useState<NotificationDto | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    body: '',
    isActive: true,
  });

  const handleEdit = (notification: NotificationDto) => {
    setEditingNotification(notification);
    setFormData({
      subject: notification.subject,
      body: notification.body,
      isActive: notification.isActive,
    });
  };

  const handleSave = async () => {
    if (!editingNotification) return;

    await updateMutation.mutateAsync({
      type: editingNotification.type,
      request: formData,
    });
    setEditingNotification(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Notifications</h2>
        <p className="text-muted-foreground mt-1">
          Manage email notification templates
        </p>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load notifications. Please try again.</p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Templates
            </CardTitle>
            <CardDescription>
              Configure email templates for booking notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications?.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">
                      {typeLabels[notification.type]}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {notification.subject}
                    </TableCell>
                    <TableCell>
                      <Badge variant={notification.isActive ? 'default' : 'secondary'}>
                        {notification.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(notification)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!notifications || notifications.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No notification templates found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Variable Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Template Variables</CardTitle>
          <CardDescription>
            Use these placeholders in your email templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <code className="text-sm">{'{{firstName}}'}</code>
              <p className="text-xs text-muted-foreground mt-1">Customer first name</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <code className="text-sm">{'{{lastName}}'}</code>
              <p className="text-xs text-muted-foreground mt-1">Customer last name</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <code className="text-sm">{'{{reference}}'}</code>
              <p className="text-xs text-muted-foreground mt-1">Booking reference</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <code className="text-sm">{'{{date}}'}</code>
              <p className="text-xs text-muted-foreground mt-1">Appointment date</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <code className="text-sm">{'{{time}}'}</code>
              <p className="text-xs text-muted-foreground mt-1">Appointment time</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <code className="text-sm">{'{{package}}'}</code>
              <p className="text-xs text-muted-foreground mt-1">Service package</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <code className="text-sm">{'{{totalPrice}}'}</code>
              <p className="text-xs text-muted-foreground mt-1">Total price</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <code className="text-sm">{'{{vehicleType}}'}</code>
              <p className="text-xs text-muted-foreground mt-1">Vehicle type</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingNotification} onOpenChange={() => setEditingNotification(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit {editingNotification && typeLabels[editingNotification.type]}
            </DialogTitle>
            <DialogDescription>
              Update the email template for this notification type
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Enable this notification</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="Email subject line"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, body: e.target.value }))
                }
                rows={10}
                placeholder="Email body content (HTML supported)"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditingNotification(null)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

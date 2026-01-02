import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Calendar } from '../../components/ui/calendar';
import {
  useAdminTimeSlotTemplates,
  useCreateTimeSlotTemplate,
  useUpdateTimeSlotTemplate,
  useDeleteTimeSlotTemplate,
  useAdminTimeSlots,
  useCreateTimeSlot,
  useUpdateTimeSlot,
  useDeleteTimeSlot,
} from '../../api/hooks';
import type { TimeSlotTemplate, TimeSlot, TimeSlotStatus } from '../../api/types';
import { Plus, Edit, Trash, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';

// Helper to format time (remove seconds for display)
function formatTime(time: string): string {
  return time.slice(0, 5); // "09:00:00" -> "09:00"
}

// Helper to format date to ISO string (using local date, not UTC)
function toISODateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Template Form Types
type TemplateFormData = {
  startTime: string;
  endTime: string;
  isActive: boolean;
};

const emptyTemplateForm: TemplateFormData = {
  startTime: '09:00',
  endTime: '11:00',
  isActive: true,
};

// Slot Form Types
type SlotFormData = {
  date: string;
  timeSlotTemplateId: number | null;
  status: TimeSlotStatus;
};

export function AdminTimeSlots() {
  // Templates state
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateDeleteDialogOpen, setTemplateDeleteDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TimeSlotTemplate | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<TimeSlotTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState<TemplateFormData>(emptyTemplateForm);

  // Slots state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slotDialogOpen, setSlotDialogOpen] = useState(false);
  const [slotDeleteDialogOpen, setSlotDeleteDialogOpen] = useState(false);
  const [deletingSlot, setDeletingSlot] = useState<TimeSlot | null>(null);
  const [slotForm, setSlotForm] = useState<SlotFormData>({
    date: toISODateString(new Date()),
    timeSlotTemplateId: null,
    status: 'AVAILABLE',
  });

  // Compute date range for current month view
  const { from, to } = useMemo(() => {
    const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    return {
      from: toISODateString(start),
      to: toISODateString(end),
    };
  }, [selectedDate]);

  // Queries
  const { data: templates, isLoading: templatesLoading } = useAdminTimeSlotTemplates();
  const { data: slots, isLoading: slotsLoading } = useAdminTimeSlots(from, to);

  // Template mutations
  const createTemplateMutation = useCreateTimeSlotTemplate();
  const updateTemplateMutation = useUpdateTimeSlotTemplate();
  const deleteTemplateMutation = useDeleteTimeSlotTemplate();

  // Slot mutations
  const createSlotMutation = useCreateTimeSlot();
  const updateSlotMutation = useUpdateTimeSlot();
  const deleteSlotMutation = useDeleteTimeSlot();

  // Filter slots for selected date
  const slotsForDate = slots?.filter(
    (slot) => slot.date === toISODateString(selectedDate)
  ) || [];

  // Template handlers
  const handleOpenCreateTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm(emptyTemplateForm);
    setTemplateDialogOpen(true);
  };

  const handleOpenEditTemplate = (item: TimeSlotTemplate) => {
    setEditingTemplate(item);
    setTemplateForm({
      startTime: formatTime(item.startTime),
      endTime: formatTime(item.endTime),
      isActive: item.isActive,
    });
    setTemplateDialogOpen(true);
  };

  const handleOpenDeleteTemplate = (item: TimeSlotTemplate) => {
    setDeletingTemplate(item);
    setTemplateDeleteDialogOpen(true);
  };

  const handleSubmitTemplate = () => {
    const data = {
      startTime: templateForm.startTime + ':00',
      endTime: templateForm.endTime + ':00',
      isActive: templateForm.isActive,
    };

    if (editingTemplate) {
      updateTemplateMutation.mutate(
        { id: editingTemplate.id, data },
        {
          onSuccess: () => {
            toast.success('Template updated');
            setTemplateDialogOpen(false);
          },
          onError: (err) => toast.error(`Failed to update: ${err.message}`),
        }
      );
    } else {
      createTemplateMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Template created');
          setTemplateDialogOpen(false);
        },
        onError: (err) => toast.error(`Failed to create: ${err.message}`),
      });
    }
  };

  const handleDeleteTemplate = () => {
    if (!deletingTemplate) return;
    deleteTemplateMutation.mutate(deletingTemplate.id, {
      onSuccess: () => {
        toast.success('Template deleted');
        setTemplateDeleteDialogOpen(false);
        setDeletingTemplate(null);
      },
      onError: (err) => toast.error(`Failed to delete: ${err.message}`),
    });
  };

  // Slot handlers
  const handleOpenCreateSlot = () => {
    setSlotForm({
      date: toISODateString(selectedDate),
      timeSlotTemplateId: templates?.[0]?.id || null,
      status: 'AVAILABLE',
    });
    setSlotDialogOpen(true);
  };

  const handleOpenDeleteSlot = (item: TimeSlot) => {
    setDeletingSlot(item);
    setSlotDeleteDialogOpen(true);
  };

  const handleSubmitSlot = () => {
    if (!slotForm.timeSlotTemplateId) {
      toast.error('Please select a template');
      return;
    }

    createSlotMutation.mutate(
      {
        date: slotForm.date,
        timeSlotTemplateId: slotForm.timeSlotTemplateId,
        status: slotForm.status,
      },
      {
        onSuccess: () => {
          toast.success('Time slot created');
          setSlotDialogOpen(false);
        },
        onError: (err) => toast.error(`Failed to create: ${err.message}`),
      }
    );
  };

  const handleDeleteSlot = () => {
    if (!deletingSlot) return;
    deleteSlotMutation.mutate(deletingSlot.id, {
      onSuccess: () => {
        toast.success('Time slot deleted');
        setSlotDeleteDialogOpen(false);
        setDeletingSlot(null);
      },
      onError: (err) => toast.error(`Failed to delete: ${err.message}`),
    });
  };

  const handleToggleSlotStatus = (slot: TimeSlot) => {
    const newStatus: TimeSlotStatus =
      slot.status === 'AVAILABLE' ? 'BLOCKED' : 'AVAILABLE';
    updateSlotMutation.mutate(
      { id: slot.id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(`Slot ${newStatus.toLowerCase()}`);
        },
        onError: (err) => toast.error(`Failed to update: ${err.message}`),
      }
    );
  };

  const isTemplatePending =
    createTemplateMutation.isPending || updateTemplateMutation.isPending;
  const isSlotPending = createSlotMutation.isPending;

  const getStatusBadge = (status: TimeSlotStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge className="bg-green-500/10 text-green-600">Available</Badge>;
      case 'BOOKED':
        return <Badge className="bg-blue-500/10 text-blue-600">Booked</Badge>;
      case 'BLOCKED':
        return <Badge className="bg-gray-500/10 text-gray-600">Blocked</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Time Slots</h2>
        <p className="text-muted-foreground mt-1">
          Manage time slot templates and availability
        </p>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </CardTitle>
                <Button onClick={handleOpenCreateSlot} disabled={!templates?.length}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slot
                </Button>
              </CardHeader>
              <CardContent>
                {slotsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : slotsForDate.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No time slots for this date
                  </p>
                ) : (
                  <div className="space-y-3">
                    {slotsForDate
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(slot.status)}
                            <div className="flex gap-2">
                              {slot.status !== 'BOOKED' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleSlotStatus(slot)}
                                  disabled={updateSlotMutation.isPending}
                                >
                                  {slot.status === 'AVAILABLE' ? 'Block' : 'Unblock'}
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenDeleteSlot(slot)}
                                disabled={slot.status === 'BOOKED'}
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Time Slot Templates</CardTitle>
              <Button onClick={handleOpenCreateTemplate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Template
              </Button>
            </CardHeader>
            <CardContent>
              {templatesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : !templates?.length ? (
                <p className="text-muted-foreground text-center py-8">
                  No templates found. Create a template to define available time slots.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {formatTime(item.startTime)}
                        </TableCell>
                        <TableCell>{formatTime(item.endTime)}</TableCell>
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
                              onClick={() => handleOpenEditTemplate(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenDeleteTemplate(item)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Create/Edit Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? 'Update the time slot template'
                : 'Create a new time slot template'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={templateForm.startTime}
                  onChange={(e) =>
                    setTemplateForm({ ...templateForm, startTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={templateForm.endTime}
                  onChange={(e) =>
                    setTemplateForm({ ...templateForm, endTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={templateForm.isActive}
                onCheckedChange={(checked: boolean) =>
                  setTemplateForm({ ...templateForm, isActive: checked })
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitTemplate} disabled={isTemplatePending}>
              {isTemplatePending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingTemplate ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Delete Dialog */}
      <AlertDialog
        open={templateDeleteDialogOpen}
        onOpenChange={setTemplateDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template (
              {deletingTemplate && formatTime(deletingTemplate.startTime)} -{' '}
              {deletingTemplate && formatTime(deletingTemplate.endTime)})? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTemplate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteTemplateMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Slot Create Dialog */}
      <Dialog open={slotDialogOpen} onOpenChange={setSlotDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Time Slot</DialogTitle>
            <DialogDescription>
              Add a new time slot for{' '}
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Template</Label>
              <Select
                value={slotForm.timeSlotTemplateId?.toString() || ''}
                onValueChange={(value: string) =>
                  setSlotForm({ ...slotForm, timeSlotTemplateId: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates
                    ?.filter((t) => t.isActive)
                    .map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {formatTime(t.startTime)} - {formatTime(t.endTime)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={slotForm.status}
                onValueChange={(value: TimeSlotStatus) =>
                  setSlotForm({ ...slotForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSlotDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitSlot} disabled={isSlotPending}>
              {isSlotPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Slot Delete Dialog */}
      <AlertDialog open={slotDeleteDialogOpen} onOpenChange={setSlotDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Time Slot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this time slot (
              {deletingSlot && formatTime(deletingSlot.startTime)} -{' '}
              {deletingSlot && formatTime(deletingSlot.endTime)})? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSlot}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteSlotMutation.isPending && (
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

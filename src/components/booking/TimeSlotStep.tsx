import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Calendar } from '../ui/calendar';
import { CheckCircle, Clock } from 'lucide-react';
import { useTimeSlots } from '../../api/hooks';

interface TimeSlotStepProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function TimeSlotStep({ selectedId, onSelect }: TimeSlotStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Format date as YYYY-MM-DD for API (using local date, not UTC)
  const dateString = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : null;

  const { data: timeSlots, isLoading, error } = useTimeSlots(dateString);

  // Filter to show only available slots
  const availableSlots = timeSlots?.filter((slot) => slot.status === 'AVAILABLE') || [];

  return (
    <div>
      <h3 className="mb-6">Choose Time</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center md:items-start">
          <h4 className="mb-4">Select Date</h4>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date()}
            className="rounded-md border max-w-sm"
          />
        </div>
        <div>
          <h4 className="mb-4">Select Time</h4>
          {!selectedDate ? (
            <p className="text-muted-foreground">Please select a date first</p>
          ) : isLoading ? (
            <p className="text-muted-foreground">Loading available times...</p>
          ) : error ? (
            <p className="text-destructive">Failed to load time slots. Please try again.</p>
          ) : availableSlots.length === 0 ? (
            <p className="text-muted-foreground">No available time slots for this date. Please select another date.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map((slot) => (
                <Card
                  key={slot.id}
                  className={`cursor-pointer transition-all ${
                    selectedId === slot.id
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => onSelect(slot.id)}
                >
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}</span>
                      </div>
                      {selectedId === slot.id && (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

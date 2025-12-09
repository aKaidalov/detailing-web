import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent } from '../ui/card';
import { Calendar } from '../ui/calendar';
import { generateTimeSlots } from '../../data/mockData';
import { CheckCircle, Clock } from 'lucide-react';

interface TimeSlotStepProps {
  selected: string;
  onSelect: (timeSlot: string) => void;
}

export function TimeSlotStep({ selected, onSelect }: TimeSlotStepProps) {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());

  const availableSlotsForDate = selectedDate
    ? timeSlots.filter(
        (slot) => slot.date === selectedDate.toISOString().split('T')[0]
      )
    : [];

  return (
    <div>
      <h3 className="mb-6">{t('booking.step.time')}</h3>
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
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {availableSlotsForDate.map((slot) => (
                <Card
                  key={slot.id}
                  className={`cursor-pointer transition-all ${
                    !slot.available
                      ? 'opacity-50 cursor-not-allowed'
                      : selected === slot.id
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => slot.available && onSelect(slot.id)}
                >
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{slot.time}</span>
                      </div>
                      {selected === slot.id && (
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

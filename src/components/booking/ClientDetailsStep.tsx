import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface ClientDetailsStepProps {
  data: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
  };
  onChange: (updates: Partial<ClientDetailsStepProps['data']>) => void;
}

export function ClientDetailsStep({ data, onChange }: ClientDetailsStepProps) {
  return (
    <div>
      <h3 className="mb-6">Your Details</h3>
      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="clientName">Full Name</Label>
          <Input
            id="clientName"
            type="text"
            value={data.clientName}
            onChange={(e) => onChange({ clientName: e.target.value })}
            required
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientEmail">Email</Label>
          <Input
            id="clientEmail"
            type="email"
            value={data.clientEmail}
            onChange={(e) => onChange({ clientEmail: e.target.value })}
            required
            placeholder="your@email.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientPhone">Phone Number</Label>
          <Input
            id="clientPhone"
            type="tel"
            value={data.clientPhone}
            onChange={(e) => onChange({ clientPhone: e.target.value })}
            required
            placeholder="+372 5555 5555"
          />
        </div>
      </div>
    </div>
  );
}

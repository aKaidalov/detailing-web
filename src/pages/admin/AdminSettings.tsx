import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Building, Loader2 } from 'lucide-react';
import { useBusinessSettings, useUpdateBusinessSettings } from '../../api/hooks';

export function AdminSettings() {
  const { data: settings, isLoading, error } = useBusinessSettings();
  const updateMutation = useUpdateBusinessSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean }>({});

  // Populate form when data loads - setState is valid here for form initialization
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        phone: settings.phone || '',
        email: settings.email || '',
        address: settings.address || '',
      });
      setIsDirty(false);
    }
  }, [settings]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const validateName = (value: string): string | undefined => {
    if (!value.trim()) return 'Business name is required';
    return undefined;
  };

  const handleBlur = (field: 'name') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'name') {
      setErrors(prev => ({ ...prev, name: validateName(formData.name) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateName(formData.name);
    if (nameError) {
      setErrors({ name: nameError });
      setTouched({ name: true });
      return;
    }
    await updateMutation.mutateAsync(formData);
    setIsDirty(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Settings</h2>
        <p className="text-muted-foreground mt-1">
          Configure your business settings
        </p>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load settings. Please try again.</p>
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
              <Building className="w-5 h-5" />
              Business Information
            </CardTitle>
            <CardDescription>
              Update your business contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="Your business name"
                  aria-invalid={touched.name && !!errors.name}
                />
                {touched.name && errors.name && (
                  <p className="text-destructive text-sm">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+372 5555 5555"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="info@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={3}
                  placeholder="Business address"
                />
              </div>
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending || !isDirty}
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
              {updateMutation.isSuccess && (
                <p className="text-sm text-green-600">Settings saved successfully!</p>
              )}
              {updateMutation.isError && (
                <p className="text-sm text-destructive">Failed to save settings. Please try again.</p>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

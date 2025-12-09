import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Settings, Globe, Building } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

const translationKeys = [
  { key: 'landing.hero.title', en: 'Professional Car Detailing Services', et: 'Professionaalne Autopesula Teenus', ru: 'Профессиональная детейлинг услуга' },
  { key: 'landing.hero.subtitle', en: 'Premium care for your vehicle', et: 'Kvaliteetne hooldus teie sõidukile', ru: 'Качественный уход за вашим автомобилем' },
  { key: 'service.fullWash', en: 'Full Wash', et: 'Täispesu', ru: 'Полная мойка' },
];

export function AdminSettings() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h2>{t('admin.settings')}</h2>
        <p className="text-muted-foreground mt-1">
          Configure application settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="business">
            <Building className="w-4 h-4 mr-2" />
            Business Info
          </TabsTrigger>
          <TabsTrigger value="localization">
            <Globe className="w-4 h-4 mr-2" />
            Localization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="appName">Application Name</Label>
                <Input id="appName" defaultValue="ADetailing" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <Input id="defaultLanguage" defaultValue="English" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="Europe/Tallinn" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" defaultValue="EUR (€)" />
              </div>
              <Button>{t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" defaultValue="ADetailing" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="+372 5555 5555" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" defaultValue="info@adetailing.ee" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  defaultValue="Tallinn, Estonia"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  defaultValue="Professional car detailing and valeting services in Tallinn"
                  rows={4}
                />
              </div>
              <Button>{t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Localization Editor</CardTitle>
              <CardDescription>
                Manage translations for all supported languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input placeholder="Search translation keys..." />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>English</TableHead>
                    <TableHead>Estonian</TableHead>
                    <TableHead>Russian</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {translationKeys.map((translation) => (
                    <TableRow key={translation.key}>
                      <TableCell className="font-mono text-sm">
                        {translation.key}
                      </TableCell>
                      <TableCell>{translation.en}</TableCell>
                      <TableCell>{translation.et}</TableCell>
                      <TableCell>{translation.ru}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

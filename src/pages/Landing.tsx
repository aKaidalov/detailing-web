import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Car, Sparkles, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
import { services } from '../data/mockData';

export function Landing() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="mb-4 max-w-3xl mx-auto">
            {t('landing.hero.title')}
          </h1>
          <p className="mb-8 max-w-2xl mx-auto text-muted-foreground">
            {t('landing.hero.subtitle')}
          </p>
          <Button size="lg" onClick={() => navigate('/booking')}>
            <Car className="w-5 h-5 mr-2" />
            {t('landing.hero.cta')}
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-center mb-12">{t('landing.services.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle>{t(`service.${service.id}`)}</CardTitle>
                  <CardDescription>{t(`service.${service.id}.desc`)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {service.prices.motorcycle && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('vehicle.motorcycle')}</span>
                        <span>€{service.prices.motorcycle}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('vehicle.car')}</span>
                      <span>€{service.prices.car}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('vehicle.van')}</span>
                      <span>€{service.prices.van}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => navigate('/booking')}>
                    {t('landing.hero.cta')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-2">Professional Service</h3>
              <p className="text-muted-foreground">
                Expert detailing with premium products
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-2">Convenient Booking</h3>
              <p className="text-muted-foreground">
                Easy online scheduling system
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-2">Quality Guarantee</h3>
              <p className="text-muted-foreground">
                100% satisfaction guaranteed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-center mb-12">{t('landing.contact.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <Phone className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h4 className="mb-2">{t('landing.contact.phone')}</h4>
                <p className="text-muted-foreground">+372 5555 5555</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h4 className="mb-2">{t('landing.contact.email')}</h4>
                <p className="text-muted-foreground">info@adetailing.ee</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h4 className="mb-2">{t('landing.contact.address')}</h4>
                <p className="text-muted-foreground">Tallinn, Estonia</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

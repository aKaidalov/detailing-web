import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Car, Sparkles, CheckCircle, Phone, Mail, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useVehicleTypes, usePackages } from '../api/hooks';

export function Landing() {
  const navigate = useNavigate();
  const [expandedPackageId, setExpandedPackageId] = useState<number | null>(null);

  // Fetch vehicle types and packages from API
  const { data: vehicleTypes, isLoading: vehicleTypesLoading } = useVehicleTypes();
  const firstVehicleTypeId = vehicleTypes?.[0]?.id ?? null;
  const { data: packages, isLoading: packagesLoading } = usePackages(firstVehicleTypeId);

  // Calculate minimum base price across all vehicle types
  const minBasePrice = vehicleTypes?.reduce(
    (min, vt) => Math.min(min, vt.basePrice),
    Infinity
  ) ?? 0;

  const isLoading = vehicleTypesLoading || packagesLoading;

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
            Professional Car Detailing Services
          </h1>
          <p className="mb-8 max-w-2xl mx-auto text-muted-foreground">
            Premium care for your vehicle with convenient online booking
          </p>
          <Button size="lg" onClick={() => navigate('/booking')}>
            <Car className="w-5 h-5 mr-2" />
            Book Now
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-center mb-12">Our Services</h2>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading services...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages?.map((pkg) => {
                const isExpanded = expandedPackageId === pkg.id;
                const toggleExpand = () => setExpandedPackageId(isExpanded ? null : pkg.id);

                return (
                  <Card key={pkg.id}>
                    <CardHeader>
                      <CardTitle>{pkg.name}</CardTitle>
                      {pkg.description && (
                        <div>
                          <button
                            type="button"
                            onClick={toggleExpand}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-none bg-transparent p-0 focus:outline-none"
                          >
                            <span>Description</span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                          {isExpanded && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {pkg.description}
                            </p>
                          )}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold mb-4">
                        From €{minBasePrice + pkg.price}
                      </p>
                      <Button className="w-full" onClick={() => navigate('/booking')}>
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
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
          <h2 className="text-center mb-12">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <Phone className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h4 className="mb-2">Phone</h4>
                <p className="text-muted-foreground">+372 5555 5555</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h4 className="mb-2">Email</h4>
                <p className="text-muted-foreground">info@adetailing.ee</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h4 className="mb-2">Address</h4>
                <p className="text-muted-foreground">Tallinn, Estonia</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-brand-orange" />,
      title: "Phone",
      details: ["+966 11 234 5678", "+966 50 123 4567"]
    },
    {
      icon: <Mail className="w-6 h-6 text-brand-orange" />,
      title: "Email",
      details: ["info@abccourier.com", "support@abccourier.com"]
    },
    {
      icon: <MapPin className="w-6 h-6 text-brand-orange" />,
      title: "Address",
      details: ["Al Olaya District", "Riyadh 12333, Saudi Arabia"]
    },
    {
      icon: <Clock className="w-6 h-6 text-brand-orange" />,
      title: "Working Hours",
      details: ["Sun - Thu: 8:00 AM - 8:00 PM", "Fri - Sat: 9:00 AM - 6:00 PM"]
    }
  ];

  return (
    <section id="contact" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch with us for all your shipping and logistics needs. We're here to help you 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-brand-blue">
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <Input placeholder="Enter your first name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <Input placeholder="Enter your last name" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input type="email" placeholder="Enter your email" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </label>
                <Input type="tel" placeholder="Enter your phone number" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Service Type
                </label>
                <select className="w-full p-3 border border-input rounded-md bg-background text-foreground">
                  <option>Select a service</option>
                  <option>Cargo Shipping</option>
                  <option>Courier Service</option>
                  <option>Express Delivery</option>
                  <option>International Shipping</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea 
                  placeholder="Tell us about your shipping requirements"
                  rows={4}
                />
              </div>
              
              <Button className="w-full bg-brand-orange hover:bg-brand-orange-light text-white font-medium py-3">
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-brand-blue to-brand-blue-light rounded-lg p-8 text-white mb-8">
              <h3 className="text-2xl font-bold mb-4">Get Free Quote</h3>
              <p className="text-lg opacity-90 mb-6">
                Contact us today for a personalized quote for your shipping needs. Our team will get back to you within 24 hours.
              </p>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-brand-blue font-medium px-8 py-3"
              >
                Get Quote Now
              </Button>
            </div>

            {contactInfo.map((info, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {info.title}
                      </h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
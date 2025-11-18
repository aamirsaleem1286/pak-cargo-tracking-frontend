import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
// import { Button } from "@/components/ui/button";
import TrackingModal from "./TrackingModal";
import Logo from "@/assets/logo.jpg";

const Footer = () => {
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isContactExpanded, setIsContactExpanded] = useState(false);

  const services = [
    "Cargo Shipping",
    "Courier Service",
    "Express Delivery",
    "International Shipping",
    "Door-to-Door Service",
    "Package Tracking",
  ];

  const quickLinks = [
    // "About Us",
    "Our Services",
    "Track Package",
    "Get Quote",
    // "Contact Us",
    "Terms & Conditions",
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center justify-center">
                <img
                  src={Logo}
                  alt="Professional delivery service"
                  className="w-28 rounded-2xl pt-2 pb-2"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">PCC</h3>
                <p className="text-sm text-gray-300 -mt-1">
                  Pak Chinar Int'I Cargo
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner for reliable cargo and courier services
              across Saudi Arabia and beyond. Fast, secure, and efficient
              delivery solutions.
            </p>
            
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-orange transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-orange transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-orange mt-0.5 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>Main Office</p>
                  <p>
                    Dammam Al-Khaleej, Street 22,<br/>Double Road Opposite Boys
                    School
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-orange flex-shrink-0" />
                <div className="text-gray-300">
                  <p>+966 591 080611</p>
                  <p>+966 590 878234</p>
                  <p>+966 590 056199</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-brand-orange flex-shrink-0" />
                <div className="text-gray-300">
                  <p>info@pakchinarcargo.com</p>
                  {/* <p>support@pakchinarcargo.com</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Track Package and Contact Toggle Section */}
        {/* <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <Button 
              onClick={() => setIsTrackingModalOpen(true)}
              className="bg-brand-blue hover:bg-brand-blue-light text-white px-6 py-2"
            >
              📦 Track Package
            </Button>
            
            <div className="relative">
              <Button
                onClick={() => setIsContactExpanded(!isContactExpanded)}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
              >
                Contact Us
                {isContactExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
              
              {isContactExpanded && (
                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl p-4 min-w-[200px]">
                  <div className="space-y-3">
                    <a 
                      // href="https://wa.me/966501234567"
                      href="#"
                      className="flex items-center space-x-3 p-2 rounded hover:bg-green-50 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">WhatsApp</span>
                    </a>
                    <a 
                      href="mailto:info@abccourier.com"
                      className="flex items-center space-x-3 p-2 rounded hover:bg-blue-50 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">Email</span>
                    </a>
                    <a 
                      href="tel:+966112345678"
                      className="flex items-center space-x-3 p-2 rounded hover:bg-orange-50 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-orange-500" />
                      <span className="text-gray-700">Call</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div> */}

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Pak Chinar Int'I Cargo. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-brand-orange text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-brand-orange text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-brand-orange text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Modal */}
      <TrackingModal
        open={isTrackingModalOpen}
        onOpenChange={setIsTrackingModalOpen}
      />
    </footer>
  );
};

export default Footer;

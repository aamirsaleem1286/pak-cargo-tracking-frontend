// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Package, Clock, Shield, MapPin, Headphones } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: <Truck className="w-16 h-16 text-white" />,
      title: "Cargo",
      description: "Our experienced team is committed to providing timely and efficient cargo delivery, no matter where you need to ship. With state-of-the-art equipment and a dedication to customer satisfaction, we make shipping your goods a breeze.",
      bgColor: "bg-brand-blue",
      textColor: "text-white"
    },
    {
      icon: <Package className="w-16 h-16 text-white" />,
      title: "Courier",
      description: "The trusted door-to-door courier service in the Kingdom of Saudi Arabia. Ensuring fast, secure and efficient delivery from Saudi to India and other parts of the world. Make the perfect choice for all your courier needs.",
      bgColor: "bg-brand-orange",
      textColor: "text-white"
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-12 h-12 text-brand-blue" />,
      title: "Fast & Efficient",
      description: "We ensure that the delivery of your package arrives on time without any delay."
    },
    {
      icon: <MapPin className="w-12 h-12 text-brand-blue" />,
      title: "Real-time Tracking",
      description: "Reliable tracking and real-time updates on your shipment status"
    },
    {
      icon: <Shield className="w-12 h-12 text-brand-blue" />,
      title: "Finest Cargo Handling Service",
      description: "Professional handling of your valuable items with utmost care and security"
    },
    {
      icon: <Headphones className="w-12 h-12 text-brand-blue" />,
      title: "24/7 Customer Support",
      description: "Round-the-clock customer service to assist you with all your shipping needs"
    }
  ];

  return (
    <section id="services" className="py-16 lg:py-10 xl:mt-80 2xl:mt-96 sm:mt-10 md:mt-60 ">
      <div className="container mx-auto px-4 md:mt-20 lg:px-8">
        {/* Main Services */}
        {/* <div className="grid lg:grid-cols-2 gap-0 mb-16 lg:mb-24">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`${service.bgColor} p-8 lg:p-12 flex flex-col justify-center min-h-[400px]`}
            >
              <div className="mb-6">
                {service.icon}
              </div>
              <h2 className={`text-3xl lg:text-4xl font-bold mb-6 ${service.textColor}`}>
                {service.title}
              </h2>
              <p className={`text-lg mb-8 ${service.textColor} opacity-90`}>
                {service.description}
              </p>
              <div>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-brand-blue font-medium px-8 py-3"
                >
                  ENQUIRE NOW
                </Button>
              </div>
            </div>
          ))}
        </div> */}

        {/* Service Benefits */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Service Benefits
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <Card key={benefit.title} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Users, Award, Zap } from "lucide-react";

const AboutSection = () => {
  const stats = [
    {
      icon: <Globe className="w-8 h-8 text-brand-orange" />,
      number: "50+",
      label: "Countries Served"
    },
    {
      icon: <Users className="w-8 h-8 text-brand-orange" />,
      number: "10,000+",
      label: "Happy Customers"
    },
    {
      icon: <Award className="w-8 h-8 text-brand-orange" />,
      number: "15+",
      label: "Years Experience"
    },
    {
      icon: <Zap className="w-8 h-8 text-brand-orange" />,
      number: "99.9%",
      label: "On-Time Delivery"
    }
  ];

  return (
    <section id="about" className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* About Content */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              About ABC Courier & Logistics
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              ABC Courier & Logistics is your trusted partner for all cargo and courier needs across Saudi Arabia and beyond. With over 15 years of experience in the logistics industry, we have built a reputation for reliable, fast, and secure delivery services.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our commitment to excellence and customer satisfaction has made us the preferred choice for thousands of individuals and businesses. From small packages to large cargo shipments, we handle everything with the utmost care and professionalism.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-4">
                  <CardContent className="pt-4">
                    <div className="flex justify-center mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-brand-blue mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* About Image/Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-brand-blue to-brand-blue-light rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg opacity-90 mb-6">
                To provide world-class logistics solutions that connect people and businesses across the globe, ensuring every package reaches its destination safely and on time.
              </p>
              
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg opacity-90">
                To be the leading courier and logistics company in the Middle East, known for innovation, reliability, and exceptional customer service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
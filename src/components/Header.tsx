import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "@/assets/logo.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SocialMedia from "./SocialMedia";

const Header = () => {
    const role = sessionStorage.getItem("role") || "user"; 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/login");
    setIsMenuOpen(false);
  };

    const adminLinks  = [
    // { label: "Home", path: "/" },
    // { label: "Booking", path: "/add-booking" },
    { label: "Container", path: "/container" },
    { label: "All Bookings", path: "/all-bookings" },
    { label: "All Containers", path: "/all-containers" },
    { label: "Services", path: "/services" },
  ];

 const commonLinks = [
      { label: "Home", path: "/" },
    { label: "Booking", path: "/add-booking" },

  ];



  // Decide which links to show
  const linksToShow =
    role === "admin" ? [...commonLinks,...adminLinks ] : commonLinks;




  const guestLinks = [
    // { label: "User Login", path: "/user-login" },
     { label: "Home", path: "/" },
    { label: "Contact Us", path: "/contact" },
    { label: "Login", path: "/login" },
    // { label: "Privacy Policy", path: "/privacy-policy" },
    // { label: "Terms of Services", path: "/terms-of-services" },
    ,
  ];
  const goBackButton = (
    <button
      onClick={() => {
        navigate(-1);
        setIsMenuOpen(false);
      }}
      className="text-gray-800 font-medium underline hover:text-gray-600 cursor-pointer"
    >
      Go Back
    </button>
  );
  const logoutButton = (
    <button
      onClick={handleLogout}
      className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md"
    >
      Logout
    </button>
  );

  const renderLinks = () => {
      if (!user && location.pathname === "/") { 
        
        return(
          <>
            {guestLinks.map((item, index) => {
  return (
    <>
      <Link
        key={item.path}
        to={item.path}
        onClick={() => setIsMenuOpen(false)}
        className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md"
      >
        {item.label}
      </Link>

      {/* 👇 Add Services just after Home (index 0) */}
      {index === 0 && (
        
        <a
          href="#services"
          onClick={() => setIsMenuOpen(false)}
          className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md"
        >
          Services
        </a>
      
      )}
    </>
  );
})}
          </>
          
        )
        
        
      }
  
      if (user && location.pathname === "/") {
        return (
          <>
            <Link
              to="/services"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md"
            >
              Services
            </Link>
            {logoutButton}
          </>
        );
      }
  
      if (user && location.pathname === "/services") {
        return (
          <>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md"
            >
              Home
            </Link>
            {logoutButton}
          </>
        );
      }
  
      if (!user && location.pathname === "/login") {
        return (
          <>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md"
            >
              Home
            </Link>
            <Link
              to="/privacy-policy"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-services"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md"
            >
              Terms of Services
            </Link>
          </>
        );
      }
  
      if (!user && location.pathname === "/user-login") {
        return (
          <>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md"
            >
              Home
            </Link>
            <Link
              to="/privacy-policy"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-services"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md"
            >
              Terms of Services
            </Link>
          </>
        );
      }
  
      if (!user && location.pathname === "/privacy-policy") {
        return (
          <>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md">Home</Link>
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md">
              Login
            </Link>
            <Link to="/terms-of-services" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md">Terms of Services</Link>
          </>
        );
      }
  
      if (!user && location.pathname === "/terms-of-services") {
        return (
          <>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md">Home</Link>
            
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md">
            Login
            </Link>
            <Link to="/privacy-policy" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md">Privacy Policy</Link>
          </>
        );
      }
  
      if (user && location.pathname === "/add-booking") {
        return (
          <>
            {goBackButton}
            {logoutButton}
          </>
        );
      }
  
      if (user && location.pathname === "/container") {
        return (
          <>
            {goBackButton}
            <Link to="/add-booking" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md">
              Invoice
            </Link>
            {logoutButton}
          </>
        );
      }
  
      if (user && location.pathname.includes("update-container")) {
        return (
          <>
            {goBackButton}
            <Link to="/add-booking" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md">
              Inv
            </Link>
            {logoutButton}
          </>
        );
      }
  
      if (user && location.pathname === "/admin-pannel") {
        return (
          <>
            {goBackButton}
            <Link to="/add-booking" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md">
              Inv
            </Link>
            {logoutButton}
          </>
        );
      }
  
      if (user) {
        return (
          <>
            {linksToShow.map((m) => (
              <Link
                key={m.path}
                to={m.path}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md"
              >
                {m.label}
              </Link>
            ))}
            {logoutButton}
          </>
        );
      }
  
      return guestLinks.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setIsMenuOpen(false)}
          className="block px-3 py-2 text-sm font-medium text-foreground hover:text-brand-blue hover:bg-secondary rounded-md"
        >
          {item.label}
        </Link>
      ));
    };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      {!user ? <SocialMedia />:""}
      <div className={`mx-auto px-4 lg:px-8 ${user ? 'lg:mt-10' : 'lg:mt-0'}`}>
        <div className="flex items-center justify-between h-16 lg:h-10">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">

              <div className="flex flex-1 items-center ">
                <Link to={'/'}>
                <img
                  src={Logo}
                  alt="Professional delivery service"
                  className="w-14  rounded-2xl lg:w-16 lg:mt-[-40px]"
                />
                </Link>
                <div className="pl-3">
                  <h3 className="text-red-700 text-xl font-bold lg:mt-[-40px]">PCC</h3>
                  <p className="text-sm text-red-700 -mt-1">
                    Pak Chinar Int'I Cargo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {renderLinks()}
          </nav>

          {/* CTA Button */}
          {/* <div className="hidden lg:block">
            <Button className="bg-brand-orange hover:bg-brand-orange-light text-white font-medium px-6 py-2">
              Free Quote
            </Button>
          </div> */}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-foreground hover:text-brand-blue"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {renderLinks()}
              <div className="px-3 py-2">
                <Button className="w-full bg-brand-orange hover:bg-brand-orange-light text-white font-medium">
                  Free Quote
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
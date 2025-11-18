import React from 'react';
import Header from '../components/Header';

const PrivacyPolicy = () => {
  return (
    <div >
      <Header />

          <div className='p-6 max-w-5xl mx-auto'>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
              
      
        <h2 className="text-2xl font-semibold mt-6 mb-2">1. Introduction</h2>
        <p className='mb-4'>
          Cargo cares deeply about the privacy of its visitors and users. This Privacy Policy
          describes how Cargo (cargo.site, cargocollective.com, persona.co) collects, uses, and
          shares your personal information. It applies to all Cargo services, including websites,
          apps, and subdomains. If you disagree with this policy, you must stop using our services.
          Questions? Contact us at support@cargo.site.
        </p>
      

      
        <h2 className="text-2xl font-semibold mt-6 mb-2">2. What Personal Information We Collect</h2>
        <h3 className="font-semibold">2.1 User Information</h3>
        <ul className="list-disc pl-6">
          <li>Information you provide: name, email, phone, payment, ID documents, etc.</li>
          <li>Information we collect via usage: clicks, heatmaps, IP, device, OS, etc.</li>
          <li>Info from third parties: social media, marketing, fraud detection, etc.</li>
        </ul>

        <h3 className="font-semibold mt-2">2.2 Users of Users</h3>
        <p className='mb-4'>
          We collect data of end users (visitors of user websites) solely on behalf of our users.
        </p>
      

      
        <h2 className="text-2xl font-semibold mt-6 mb-2">3. Why We Collect Your Data</h2>
        <ul className="list-disc pl-6">
          <li>To provide, improve and personalize our services</li>
          <li>To support users and send service notifications</li>
          <li>To comply with legal obligations</li>
        </ul>
      

      
        <h2 className="text-2xl font-semibold mt-6 mb-2">4. How We Share Your Data</h2>
        <p className='mb-4'>
          We may share data with trusted third-party service providers (hosting, payments, fraud
          detection, etc.). We may also disclose info to law enforcement when legally required.
        </p>
      

      
        <h2 className="text-2xl font-semibold mt-6 mb-2">5. Where We Store Your Data</h2>
        <p className='mb-4'>
          Data is stored primarily in the U.S., and transferred under standard contractual clauses
          for EU residents when necessary.
        </p>
      

      
        <h2 className="text-2xl font-semibold mt-6 mb-2">6. Users-of-Users’ Data</h2>
        <p className='mb-4'>
          Cargo acts as a data processor on behalf of its users. Users are responsible for compliance
          with data regulations for data they collect from their own visitors.
        </p>
      

      
        <h2 className="text-2xl font-semibold mt-6 mb-2">7. Cookies</h2>
        <p className='mb-4'>
          Cargo uses cookies to provide service, remember preferences, analyze usage, and enhance
          experience. Disabling cookies may limit functionality.
        </p>
      

      
        <h2 className="text-2xl font-semibold mt-6 mb-2">8. Your Rights</h2>
        <p className='mb-4'>
          You may request access, correction, or deletion of your data. Contact
          support@cargo.site. We may verify your identity before proceeding.
        </p>
      

      
        <h2 className="text-2xl font-semibold mt-6 mb-2">9. California Residents</h2>
        <p className='mb-4'>
          Under CCPA, California users can request access and deletion of data. Cargo does not sell
          your information.
        </p>
      

      
        <h2 className="text-2xl font-semibold mt-6 mb-2">10. Questions & Complaints</h2>
        <p className='mb-4'>
          Contact us at support@cargo.site if you believe your privacy rights have been violated.
        </p>
      

      
        <h2 className="text-2xl font-semibold mt-6 mb-2">11. Data Retention</h2>
        <p className='mb-4'>
          We retain data as long as needed to provide service or comply with legal requirements.
        </p>
      

      
        <h2 className="text-2xl font-semibold mt-6 mb-2">12. Security</h2>
        <p className='mb-4'>
          We use standard measures (SSL, encryption, monitoring) to protect data but cannot
          guarantee absolute security. Use strong passwords and avoid sharing sensitive data.
        </p>
      
     </div>
    </div>
  );
};

export default PrivacyPolicy;

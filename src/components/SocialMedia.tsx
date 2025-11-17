import React from 'react'
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
const SocialMedia = () => {
  return (
    <div>
      <div className="flex gap-4 mt-4 justify-end mr-20">
              <a
                href="#"
                className="text-red-600 hover:text-brand-orange transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-red-600 hover:text-brand-orange transition-colors"
              >
                <FontAwesomeIcon icon={faXTwitter} size="xl" />
              </a>
              <a
                href="#"
                className="text-red-600 hover:text-brand-orange transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-red-600 hover:text-brand-orange transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div> 
    </div>
  )
}

export default SocialMedia

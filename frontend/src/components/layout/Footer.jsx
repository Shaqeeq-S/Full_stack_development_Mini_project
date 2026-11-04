import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Phone, Mail, MapPin, Heart, ShieldAlert, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md">
                <Droplet className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Blood<span className="text-red-500">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              BloodConnect is an emergency blood donor discovery platform bridging the gap between volunteer donors and patients in critical medical need.
            </p>
            <div className="flex items-center gap-2 text-xs text-red-400 font-semibold bg-red-950/50 border border-red-900/60 p-2.5 rounded-lg">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>24/7 Emergency Blood Matching Network</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Platform Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-red-400 transition">
                  Home Landing
                </Link>
              </li>
              <li>
                <Link to="/find-donors" className="hover:text-red-400 transition">
                  Find Blood Donors
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-red-400 transition">
                  Join as Blood Donor
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-red-400 transition">
                  Sign In to Dashboard
                </Link>
              </li>
              <li>
                <Link to="/create-request" className="hover:text-red-400 transition">
                  Post Emergency Blood Request
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Blood Groups & Compatibility */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Blood Groups Covered
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <div
                  key={bg}
                  className="bg-slate-800 text-center py-1.5 rounded-md text-xs font-bold text-slate-200 border border-slate-700 hover:border-red-500 hover:text-red-400 transition cursor-default"
                >
                  {bg}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400 leading-normal">
              O- is the Universal Donor type. AB+ is the Universal Recipient.
            </p>
          </div>

          {/* Col 4: Emergency Contacts & Disclaimer */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Emergency Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span>National Helpline: 104 / 108</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <span>support@bloodconnect.org</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Central Medical Hub, New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical disclaimer */}
        <div className="pt-8 border-t border-slate-800/80 text-center space-y-3">
          <p className="text-xs text-slate-400 max-w-4xl mx-auto leading-relaxed">
            <strong className="text-slate-300">Medical Disclaimer:</strong> BloodConnect is an information facilitator connecting voluntary blood donors and patients. Final blood cross-matching, screening for transfusion-transmissible infections (TTI), and donor clinical eligibility must always be performed strictly by qualified hospital staff or certified blood banks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-4">
            <p>© {new Date().getFullYear()} BloodConnect Emergency Donor Platform. All rights reserved.</p>
            <p className="flex items-center gap-1 mt-2 sm:mt-0">
              Built with care for humanity <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

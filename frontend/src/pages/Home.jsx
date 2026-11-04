import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { requestService } from '../services/api';
import {
  Droplet,
  Search,
  Heart,
  Users,
  Clock,
  ShieldCheck,
  CheckCircle,
  Activity,
  ArrowRight,
  AlertTriangle,
  Hospital,
  Sparkles
} from 'lucide-react';
import backgroundImg from '../assets/background.jpg';

const Home = () => {
  const [stats, setStats] = useState({
    totalDonors: 0,
    availableDonors: 0,
    totalRequests: 0,
    successfulRequests: 0,
    emergencyRequests: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const res = await requestService.getPublicStats();
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (error) {
        console.error('Error fetching statistics from backend:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchPublicStats();
  }, []);

  const bloodGroups = [
    { group: 'O-', role: 'Universal Donor', givesTo: 'All Blood Types', receivesFrom: 'O-' },
    { group: 'O+', role: 'Most Common', givesTo: 'O+, A+, B+, AB+', receivesFrom: 'O+, O-' },
    { group: 'A-', role: 'Rare Type', givesTo: 'A-, A+, AB-, AB+', receivesFrom: 'A-, O-' },
    { group: 'A+', role: 'High Demand', givesTo: 'A+, AB+', receivesFrom: 'A+, A-, O+, O-' },
    { group: 'B-', role: 'Rare Type', givesTo: 'B-, B+, AB-, AB+', receivesFrom: 'B-, O-' },
    { group: 'B+', role: 'High Demand', givesTo: 'B+, AB+', receivesFrom: 'B+, B-, O+, O-' },
    { group: 'AB-', role: 'Extremely Rare', givesTo: 'AB-, AB+', receivesFrom: 'AB-, A-, B-, O-' },
    { group: 'AB+', role: 'Universal Recipient', givesTo: 'AB+ only', receivesFrom: 'All Blood Types' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Emergency Callout Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 px-4 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-inner">
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <span>Urgent Blood Required in multiple cities! If you are eligible, please donate today.</span>
        <Link to="/find-donors" className="underline font-bold hover:text-red-100 ml-1">
          Explore Requests &rarr;
        </Link>
      </div>

      {/* Hero Section with Background Image */}
      <section
        className="relative overflow-hidden border-b border-slate-200/70 py-16 sm:py-24"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* ECG Heartbeat (Lifeline) Wave Animation */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none opacity-40">
          <svg
            className="w-full h-28 text-red-600"
            viewBox="0 0 1200 120"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60 L200 60 L220 60 L235 25 L250 100 L265 40 L280 75 L295 60 L500 60 L520 60 L535 20 L550 105 L565 35 L580 80 L595 60 L800 60 L820 60 L835 25 L850 100 L865 40 L880 75 L895 60 L1200 60"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-ecg"
            />
          </svg>
        </div>

        {/* Floating Red Blood Cell (Erythrocyte) Graphics */}
        {/* Cell 1: Top Left */}
        <div className="absolute top-12 left-[8%] hidden sm:block pointer-events-none animate-float-slow">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30 opacity-80 flex items-center justify-center p-3 border-2 border-red-300/60">
            <div className="w-7 h-7 rounded-full bg-red-800/70 shadow-inner"></div>
          </div>
        </div>

        {/* Cell 2: Top Right */}
        <div className="absolute top-16 right-[10%] hidden sm:block pointer-events-none animate-float-reverse">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-rose-700 shadow-xl shadow-red-500/25 opacity-75 flex items-center justify-center p-3.5 border-2 border-red-300/50">
            <div className="w-9 h-9 rounded-full bg-red-900/60 shadow-inner"></div>
          </div>
        </div>

        {/* Cell 3: Bottom Left */}
        <div className="absolute bottom-20 left-[14%] hidden md:block pointer-events-none animate-float-drift">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-red-600 shadow-md shadow-red-400/30 opacity-70 flex items-center justify-center p-2.5 border border-red-200">
            <div className="w-5 h-5 rounded-full bg-red-800/60 shadow-inner"></div>
          </div>
        </div>

        {/* Cell 4: Bottom Right */}
        <div className="absolute bottom-16 right-[15%] hidden md:block pointer-events-none animate-float-slow">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-800 shadow-lg shadow-red-500/30 opacity-80 flex items-center justify-center p-3 border-2 border-red-300/60">
            <div className="w-6 h-6 rounded-full bg-red-900/70 shadow-inner"></div>
          </div>
        </div>

        {/* Floating Thematic Blood Badges (Universal Types) */}
        {/* O- Floating Badge (Left) */}
        <div className="absolute top-1/2 left-[3%] -translate-y-1/2 hidden xl:flex items-center gap-2 p-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-red-200 shadow-lg shadow-red-100 pointer-events-none animate-float-slow">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-extrabold flex items-center justify-center text-sm shadow">
            O-
          </div>
          <div className="text-left pr-2">
            <p className="text-[11px] font-extrabold text-slate-900 leading-tight">Universal Donor</p>
            <p className="text-[10px] text-red-600 font-semibold">Can save all types</p>
          </div>
        </div>

        {/* AB+ Floating Badge (Right) */}
        <div className="absolute top-1/2 right-[3%] -translate-y-1/2 hidden xl:flex items-center gap-2 p-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-red-200 shadow-lg shadow-red-100 pointer-events-none animate-float-reverse">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm shadow">
            AB+
          </div>
          <div className="text-left pr-2">
            <p className="text-[11px] font-extrabold text-slate-900 leading-tight">Universal Recipient</p>
            <p className="text-[10px] text-emerald-600 font-semibold">Accepts all groups</p>
          </div>
        </div>

        {/* Floating Blood Drop Particle 1 */}
        <div className="absolute top-28 left-[22%] hidden lg:block pointer-events-none animate-float-drift opacity-60">
          <Droplet className="w-6 h-6 text-red-500 fill-red-400 drop-shadow-sm" />
        </div>

        {/* Floating Blood Drop Particle 2 */}
        <div className="absolute bottom-28 right-[24%] hidden lg:block pointer-events-none animate-float-slow opacity-60">
          <Droplet className="w-7 h-7 text-red-600 fill-red-500 drop-shadow-sm" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold tracking-wide uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              <Droplet className="w-3.5 h-3.5 fill-red-600 text-red-600" />
              Verified Emergency Blood Donor Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Donate Blood. <span className="text-red-400 drop-shadow-sm">Save Lives.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
              BloodConnect connects voluntary blood donors with patients and hospitals in real time during life-critical emergencies. Find compatible donors or register to be someone’s hero today.
            </p>

            {/* Hero CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/find-donors"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-base shadow-lg shadow-red-200 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Find Blood Donors
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border-2 border-slate-200 shadow-sm transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5 text-red-600 fill-red-100" />
                Become a Donor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Database Statistics Section */}
      <section className="py-12 bg-slate-900 text-white relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-red-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-rose-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-red-400">
              Live Platform Metrics
            </h3>
            <p className="text-sm text-slate-400 mt-1">Real-time data fetched directly from MongoDB database</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {loadingStats ? '...' : stats.totalDonors}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Total Registered Donors
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
                <Activity className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {loadingStats ? '...' : stats.availableDonors}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Active Available Donors
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {loadingStats ? '...' : stats.totalRequests}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Total Blood Requests
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {loadingStats ? '...' : stats.successfulRequests}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Successful Transfusions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-red-600 uppercase tracking-widest">
              Simple & Rapid Process
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
              How BloodConnect Works
            </h3>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              Connecting donors and recipients in 4 streamlined, transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-red-300 transition group">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-105 transition">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Search or Post</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Filter by blood group, city, and pincode or post an emergency request detailing patient and hospital info.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-red-300 transition group">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-105 transition">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Compatibility Matching</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our red blood cell engine instantly identifies exact and compatible donor groups (such as O- universal donors).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-red-300 transition group">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-105 transition">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Donor Response</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Available donors receive the alert and can accept or reject requests directly from their dashboard.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-red-300 transition group">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-105 transition">
                4
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Safe Hospital Transfer</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Donors proceed to the specified hospital blood bank where certified cross-matching and transfusion take place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Blood Groups & Compatibility Section */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-red-600 uppercase tracking-widest">
              Medical Reference
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
              Available Blood Groups & Compatibility
            </h3>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              Learn about RBC antigen matching. Click any blood group to search available donors instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bloodGroups.map((bg) => (
              <div
                key={bg.group}
                onClick={() => navigate(`/find-donors?bloodGroup=${encodeURIComponent(bg.group)}`)}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-red-300 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-12 h-12 rounded-xl bg-red-50 text-red-600 font-extrabold text-xl flex items-center justify-center border border-red-100">
                      {bg.group}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {bg.role}
                    </span>
                  </div>
                  <div className="space-y-2 mt-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Can Donate To:</span>
                      <span className="font-semibold text-slate-800">{bg.givesTo}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Can Receive From:</span>
                      <span className="font-semibold text-slate-800">{bg.receivesFrom}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-600">
                  <span>Find {bg.group} Donors</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose BloodConnect Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
                Why Choose BloodConnect
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Built specifically for urgent, critical emergencies
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Traditional blood banks can sometimes run low on specific rare types. BloodConnect bridges that critical hour by empowering families and hospitals to discover active, voluntary local donors rapidly.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">RBC Compatibility Engine</h5>
                    <p className="text-xs text-slate-500">
                      Smart matching ensures you don't miss out on compatible blood types (such as O- universal donors).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Privacy-First Architecture</h5>
                    <p className="text-xs text-slate-500">
                      Donors' residential addresses and personal phone numbers remain confidential and protected from public scrapers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Hospital className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Direct Hospital Geolocation</h5>
                    <p className="text-xs text-slate-500">
                      Requests clearly pinpoint hospital facilities and wards, eliminating confusion in the golden hour.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Card / Highlights */}
            <div className="bg-gradient-to-br from-red-50 to-rose-100/50 p-8 rounded-3xl border border-red-200/80 shadow-md">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Active Emergency Transfusion</span>
                  </div>
                  <span className="bg-red-100 text-red-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                    High Priority
                  </span>
                </div>

                <div className="border-t border-b border-slate-100 py-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Patient:</span>
                    <span className="font-bold text-slate-800">Critical ICU Care</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Required Group:</span>
                    <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      O- (Universal)
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Hospital:</span>
                    <span className="font-bold text-slate-800">Central Trauma Care Centre</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 pt-1">
                  <span>Donor Responses: 2 Donors Confirmed</span>
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">
                    <CheckCircle className="w-3.5 h-3.5" /> En Route
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-slate-600 font-medium">
                  "A single blood donation can save up to 3 individual lives."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Call to Action Banner */}
      <section className="py-16 bg-red-600 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Need Blood Immediately for an Emergency?
          </h2>
          <p className="text-base sm:text-lg text-red-100 max-w-2xl mx-auto">
            Search our network of verified donors or post an emergency request with all hospital details right now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/create-request"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-red-600 font-bold hover:bg-red-50 shadow-lg transition"
            >
              Post Emergency Request
            </Link>
            <Link
              to="/find-donors"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-700 text-white font-bold hover:bg-red-800 border border-red-500 transition"
            >
              Search Available Donors
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* BLOOD COMPATIBILITY CHART — Full Reference Table          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-red-600 uppercase tracking-widest">Complete Reference</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">Blood Compatibility Chart</h3>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              Understanding which blood types are compatible is critical during emergencies. Here is the complete red blood cell (RBC) compatibility matrix.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">Blood Type</th>
                  <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">Can Donate To</th>
                  <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-wider">Can Receive From</th>
                  <th className="px-4 py-3 text-center font-bold text-xs uppercase tracking-wider">Population %</th>
                  <th className="px-4 py-3 text-center font-bold text-xs uppercase tracking-wider">Rarity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { type: 'O-', donateTo: 'All Blood Types', receiveFrom: 'O-', pop: '~2.5%', rarity: 'Universal Donor', color: 'bg-red-600 text-white' },
                  { type: 'O+', donateTo: 'O+, A+, B+, AB+', receiveFrom: 'O+, O-', pop: '~36.5%', rarity: 'Most Common', color: 'bg-emerald-100 text-emerald-800' },
                  { type: 'A-', donateTo: 'A-, A+, AB-, AB+', receiveFrom: 'A-, O-', pop: '~6.3%', rarity: 'Rare', color: 'bg-amber-100 text-amber-800' },
                  { type: 'A+', donateTo: 'A+, AB+', receiveFrom: 'A+, A-, O+, O-', pop: '~22.8%', rarity: 'Common', color: 'bg-emerald-100 text-emerald-800' },
                  { type: 'B-', donateTo: 'B-, B+, AB-, AB+', receiveFrom: 'B-, O-', pop: '~2.0%', rarity: 'Rare', color: 'bg-amber-100 text-amber-800' },
                  { type: 'B+', donateTo: 'B+, AB+', receiveFrom: 'B+, B-, O+, O-', pop: '~24.0%', rarity: 'Common', color: 'bg-emerald-100 text-emerald-800' },
                  { type: 'AB-', donateTo: 'AB-, AB+', receiveFrom: 'AB-, A-, B-, O-', pop: '~0.5%', rarity: 'Extremely Rare', color: 'bg-red-100 text-red-800' },
                  { type: 'AB+', donateTo: 'AB+ only', receiveFrom: 'All Blood Types', pop: '~5.4%', rarity: 'Universal Recipient', color: 'bg-blue-600 text-white' },
                ].map((row) => (
                  <tr key={row.type} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600 font-extrabold text-base border border-red-100">
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{row.donateTo}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{row.receiveFrom}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-700">{row.pop}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${row.color}`}>{row.rarity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="text-sm font-bold text-red-800 mb-1">🩸 Whole Blood Donation</h4>
              <p className="text-xs text-red-700">Donating 1 unit (~450 ml) of whole blood. Can be repeated every 12 weeks (males) or 16 weeks (females).</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="text-sm font-bold text-amber-800 mb-1">🔬 Platelet Donation (Apheresis)</h4>
              <p className="text-xs text-amber-700">Platelets are separated from blood using a machine. A single platelet donation can help 3 patients. Can be repeated every 2 weeks.</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-sm font-bold text-blue-800 mb-1">💧 Plasma Donation</h4>
              <p className="text-xs text-blue-700">Plasma is the liquid part of blood containing proteins, antibodies, and clotting factors. Essential for burn and trauma patients.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* BLOOD DONATION FACTS IN INDIA                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest">Did You Know?</h2>
            <h3 className="text-3xl font-extrabold text-white mt-2">Blood Donation Facts — India</h3>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              India requires approximately 5 crore (50 million) units of blood annually, yet collects only about 80% of the demand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🏥', title: 'Annual Demand', desc: 'India needs ~5 crore units of blood per year. Only ~80% is collected through voluntary and replacement donations.' },
              { icon: '⏳', title: 'Shelf Life', desc: 'Whole blood can be stored for up to 35–42 days. Platelets last only 5 days. This makes continuous donation essential.' },
              { icon: '❤️', title: 'Save 3 Lives', desc: 'A single whole blood donation is separated into Red Blood Cells, Platelets and Plasma — potentially saving up to 3 lives.' },
              { icon: '🩺', title: 'Health Benefits', desc: 'Regular blood donation reduces iron overload, lowers heart attack risk by up to 88%, and stimulates new blood cell production.' },
              { icon: '🧬', title: 'Blood Composition', desc: 'Blood makes up ~7% of body weight. An average adult has 4.7 to 5.5 litres. It contains 55% plasma, 44% RBCs, and 1% WBCs and platelets.' },
              { icon: '🌍', title: 'Universal Donor', desc: 'Only ~2.5% of the Indian population has O- blood (universal donor). AB+ (universal recipient) is found in ~5.4% of Indians.' },
              { icon: '⚖️', title: 'Eligibility Criteria', desc: 'Donors must be 18–65 years old, weigh ≥45 kg, have haemoglobin ≥12.5 g/dL, and must not have donated in the last 3 months.' },
              { icon: '📊', title: 'Voluntary vs. Replacement', desc: 'WHO recommends 100% voluntary blood donation. India currently has ~72% voluntary donation rate, up from 54% a decade ago.' },
              { icon: '🕐', title: 'Donation Duration', desc: 'The actual blood draw takes only 8–12 minutes. With registration, screening and rest, the entire process takes about 30–45 minutes.' },
            ].map((fact) => (
              <div key={fact.title} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-red-500/50 transition">
                <span className="text-2xl block mb-2">{fact.icon}</span>
                <h4 className="text-sm font-bold text-white mb-1.5">{fact.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{fact.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* INDIAN GOVERNMENT SCHEMES & POLICIES                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-red-600 uppercase tracking-widest">Government Initiatives</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">Indian Government Schemes &amp; Policies</h3>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              The Government of India and NACO (National AIDS Control Organisation) regulate blood banking and promote voluntary blood donation through several key initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">🇮🇳</span>
                <div>
                  <h4 className="text-base font-bold text-slate-900">National Blood Transfusion Council (NBTC)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Under Ministry of Health & Family Welfare</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                NBTC coordinates all activities related to blood transfusion services in India. It formulates policies for safe blood, ensures quality standards at blood banks, and promotes 100% voluntary blood donation as per WHO guidelines.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">🏛️</span>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Drugs & Cosmetics Act, 1940</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Blood Banks Regulation</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Blood banks in India are licensed and regulated under the Drugs & Cosmetics Act. They must comply with strict quality standards for collection, storage, testing (HIV, Hepatitis B/C, Syphilis, Malaria) and distribution of blood and blood components.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">🎗️</span>
                <div>
                  <h4 className="text-base font-bold text-slate-900">National Voluntary Blood Donation Day</h4>
                  <p className="text-xs text-slate-500 mt-0.5">October 1 — Celebrated Every Year</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                October 1 is observed as National Voluntary Blood Donation Day in India to honor Mrs. & Mr. V. Mahalingam who donated blood on this date in 1942. Blood donation camps and awareness drives are organized across the country.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">🆓</span>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Free Blood for Thalassemia & Haemophilia</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Supreme Court of India Directive</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                The Supreme Court of India has directed that blood banks cannot charge for blood provided to Thalassemia and Haemophilia patients. Government blood banks provide free blood, and private banks may charge only a nominal processing fee (₹50–₹1,050 depending on component).
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Mandatory Testing (5 TTIs)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">NACO / CDSCO Guidelines</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Every unit of donated blood in India must be tested for 5 Transfusion Transmitted Infections (TTIs): HIV-1 & 2, Hepatitis B (HBsAg), Hepatitis C (anti-HCV), Syphilis (VDRL), and Malaria (antigen/smear). NAT (Nucleic Acid Testing) is also encouraged.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="text-base font-bold text-slate-900">eRaktkosh — Digital Blood Bank Portal</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Government of India Initiative</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                eRaktkosh (<a href="https://www.eraktkosh.in" target="_blank" rel="noreferrer" className="text-red-600 underline font-semibold">eraktkosh.in</a>) is the centralized blood bank management system connecting 3,500+ blood banks across India. It provides real-time blood availability, donor database management, and inter-bank blood exchange.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* BLOOD SCIENCE — Scientific Information                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-red-600 uppercase tracking-widest">Science of Blood</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">Understanding Blood — A Scientific Overview</h3>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              Blood is the lifeline of the human body. Here's a deeper look at its components, the ABO/Rh system, and why compatibility matters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Components */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-red-600 fill-red-200" /> Blood Components
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 text-sm font-bold">RBC</span>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Red Blood Cells (Erythrocytes)</h5>
                    <p className="text-xs text-slate-600">Carry oxygen from lungs to tissues via haemoglobin. Make up ~44% of blood volume. Lifespan: ~120 days. Stored at 1–6°C for up to 42 days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-sm font-bold">PLT</span>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Platelets (Thrombocytes)</h5>
                    <p className="text-xs text-slate-600">Essential for blood clotting. Normal count: 1.5–4.0 lakh/µL. Stored at 20–24°C with agitation. Shelf life: only 5 days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-sm font-bold">PLS</span>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Plasma</h5>
                    <p className="text-xs text-slate-600">Liquid component (~55% of blood). Contains water, proteins (albumin, globulins, fibrinogen), electrolytes, and clotting factors. Frozen at −18°C and stored up to 1 year.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-sm font-bold">WBC</span>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">White Blood Cells (Leukocytes)</h5>
                    <p className="text-xs text-slate-600">Part of the immune system. Normal count: 4,000–11,000/µL. Includes neutrophils, lymphocytes, monocytes, eosinophils, and basophils.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ABO & Rh System */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-600" /> ABO & Rh Blood Group System
              </h4>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h5 className="text-sm font-bold text-slate-900 mb-1">ABO System</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Discovered by Karl Landsteiner in 1901. Based on the presence of <strong>A antigen</strong>, <strong>B antigen</strong>, both (AB), or neither (O) on red blood cell surfaces. Type O has <strong>anti-A and anti-B antibodies</strong> in plasma; Type AB has <strong>neither antibody</strong>.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h5 className="text-sm font-bold text-slate-900 mb-1">Rh Factor</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The Rh (Rhesus) system is defined by the <strong>D antigen</strong>. If present → Rh+ (positive); if absent → Rh− (negative). Rh incompatibility is critical during pregnancy and can cause <strong>Haemolytic Disease of the Newborn (HDN)</strong>.
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <h5 className="text-sm font-bold text-red-900 mb-1">⚠️ Transfusion Reactions</h5>
                  <p className="text-xs text-red-800 leading-relaxed">
                    Mismatched transfusions trigger <strong>acute haemolytic reactions</strong> where recipient antibodies attack donor RBCs, causing agglutination, haemolysis, kidney failure, and potentially death. This is why <strong>cross-matching</strong> is mandatory before every transfusion.
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <h5 className="text-sm font-bold text-emerald-900 mb-1">✅ Crossmatch Test</h5>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Before transfusion, donor RBCs are mixed with recipient's plasma (major crossmatch) and donor plasma with recipient's RBCs (minor crossmatch) to ensure no adverse reaction will occur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA — Become a Donor */}
      <section className="py-16 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Join the BloodConnect Community Today
          </h2>
          <p className="text-base sm:text-lg text-red-100 max-w-2xl mx-auto">
            Register as a voluntary blood donor or create a blood request. Every drop counts in saving a life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-red-600 font-bold hover:bg-red-50 shadow-lg transition flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-red-100" />
              Register as Donor
            </Link>
            <Link
              to="/find-donors"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-800 text-white font-bold hover:bg-red-900 border border-red-600 transition"
            >
              Search Donors Near You
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

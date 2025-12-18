import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, CreditCard, Search, Star, 
  ShieldCheck, Fuel, X, Check,
  MessageCircle, Phone, Image as ImageIcon,
  Smartphone, Send, Menu, Filter, ChevronDown,
  Upload, User, FileText, Info, Loader2, Clock, 
  History, LogOut, Shield, Calendar, Map as MapIcon,
  Navigation, CheckCircle2, AlertCircle
} from 'lucide-react';

/**
 * RentNGo - UPDATED PROFILE WITH CURRENT & PAST TRIPS
 * Features: Dynamic duration, Real-time pricing, KYC, and Trip status management.
 */

const COLORS = {
  primary: '#0B1C2D',
  accent: '#1FA2FF',
  gradient: 'bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364]',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20',
  text: '#FFFFFF',
  textMuted: '#BFD7ED',
  success: '#22C55E',
  error: '#EF4444'
};

const INITIAL_VEHICLES = [
  {
    id: 1,
    name: "Tesla Model 3",
    category: "Luxury",
    type: "CAR",
    pricePerHour: 2500,
    image: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=800",
    transmission: "Automatic",
    fuel: "Electric",
    seats: 5,
    rating: 4.8,
    available: true,
    location: "Mumbai",
  },
  {
    id: 2,
    name: "Royal Enfield Classic",
    category: "Cruiser",
    type: "BIKE",
    pricePerHour: 800,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800",
    transmission: "Manual",
    fuel: "Petrol",
    seats: 2,
    rating: 4.6,
    available: true,
    location: "Pune",
  },
  {
    id: 3,
    name: "Mahindra Thar",
    category: "SUV",
    type: "CAR",
    pricePerHour: 1500,
    image: "https://images.unsplash.com/photo-1632245889029-e413c634e321?auto=format&fit=crop&q=80&w=800",
    transmission: "Manual",
    fuel: "Diesel",
    seats: 4,
    rating: 4.7,
    available: true,
    location: "Mumbai",
  },
  {
    id: 4,
    name: "KTM Duke 390",
    category: "Sports",
    type: "BIKE",
    pricePerHour: 1200,
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800",
    transmission: "Manual",
    fuel: "Petrol",
    seats: 2,
    rating: 4.7,
    available: true,
    location: "Bangalore",
  },
];

const MOCK_USER = {
  id: 'u1',
  name: 'Aditya Kumar',
  email: 'aditya.k@rentngo.com',
  phone: '+91 98765 43210',
  avatar: 'https://i.pravatar.cc/150?u=u1',
  kycVerified: true
};

const LOCATIONS = ["Mumbai", "Pune", "Bangalore", "Delhi"];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const Navbar = ({ user, setView }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0B1C2D]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('HOME')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1FA2FF] to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            R
          </div>
          <span className="font-bold text-white text-xl tracking-wide hidden sm:block">RentNGo</span>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => setView('LISTING')} className="text-gray-300 hover:text-white text-sm font-medium">Browse</button>
          {user ? (
            <button onClick={() => setView('PROFILE')} className="flex items-center gap-2 group">
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] text-gray-500 font-bold uppercase">Profile</p>
                 <p className="text-xs text-white font-bold">{user.name}</p>
              </div>
              <img src={user.avatar} className="w-9 h-9 rounded-full border-2 border-white/10 group-hover:border-[#1FA2FF] transition-all" alt="User" />
            </button>
          ) : (
            <button onClick={() => setView('LOGIN')} className="bg-[#1FA2FF] px-5 py-2 rounded-full text-white font-bold text-sm shadow-lg shadow-blue-500/20">Login</button>
          )}
        </div>
      </div>
    </nav>
  );
};

const ProfileView = ({ user, bookings, setView }) => {
  const currentTime = new Date().getTime();
  
  const currentTrips = bookings.filter(b => new Date(b.dropoffTime).getTime() > currentTime);
  const pastTrips = bookings.filter(b => new Date(b.dropoffTime).getTime() <= currentTime);

  const TripCard = ({ booking, isCurrent }) => (
    <div className={`bg-[#0B1C2D] border ${isCurrent ? 'border-[#1FA2FF]/40' : 'border-white/10'} rounded-2xl p-4 flex gap-4 hover:border-[#1FA2FF]/60 transition-all group relative overflow-hidden`}>
      {isCurrent && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-[#1FA2FF] text-white text-[9px] font-black tracking-widest uppercase">
          Active Now
        </div>
      )}
      <img src={booking.vehicle.image} className="w-24 h-24 rounded-xl object-cover" alt="Ride" />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-white group-hover:text-[#1FA2FF] transition-colors">{booking.vehicle.name}</h4>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-[10px] text-gray-300 font-medium">
                {booking.duration} hours
              </p>
              <span className="text-gray-600">•</span>
              <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                <MapPin size={10} /> {booking.vehicle.location}
              </p>
            </div>
            <p className="text-[9px] text-gray-500 uppercase font-bold mt-2 flex items-center gap-1">
              <Clock size={10}/> {new Date(booking.pickupTime).toLocaleDateString()} - {new Date(booking.dropoffTime).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-white">{formatCurrency(booking.totalPrice)}</p>
            <p className={`text-[9px] font-bold ${isCurrent ? 'text-blue-400 bg-blue-400/10' : 'text-green-400 bg-green-400/10'} px-2 py-0.5 rounded-full inline-block mt-1`}>
              {isCurrent ? 'Ongoing' : 'Completed'}
            </p>
          </div>
        </div>
        
        {isCurrent && (
          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white hover:bg-white/10 transition-colors">
              Track Location
            </button>
            <button className="flex-1 py-1.5 bg-[#1FA2FF] rounded-lg text-[10px] font-bold text-white shadow-lg shadow-blue-500/20">
              Extend Trip
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pt-24 px-4 pb-12 ${COLORS.gradient}`}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
             <div className="bg-[#0B1C2D] border border-white/10 rounded-3xl p-6 text-center shadow-xl sticky top-24">
                <div className="relative inline-block mb-4">
                  <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-[#1FA2FF]/20 mx-auto" alt="Avatar" />
                  <div className="absolute bottom-1 right-1 bg-green-500 p-1.5 rounded-full border-4 border-[#0B1C2D]">
                    <Check size={12} className="text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-gray-500 text-xs mb-6">{user.email}</p>
                <div className="space-y-3 text-left">
                   <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Phone</p>
                      <p className="text-sm text-white">{user.phone}</p>
                   </div>
                   <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-gray-500 font-bold uppercase">KYC Status</p>
                      <p className="text-sm text-green-400 font-bold flex items-center gap-1">
                        <ShieldCheck size={14}/> Verified
                      </p>
                   </div>
                </div>
                <button onClick={() => window.location.reload()} className="w-full mt-6 py-3 rounded-xl border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/10 flex items-center justify-center gap-2">
                  <LogOut size={14}/> Logout
                </button>
             </div>
          </div>

          <div className="md:col-span-3 space-y-10">
            {/* Ongoing Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                   <Navigation size={24} className="text-[#1FA2FF] animate-pulse" />
                   Current Trips
                 </h2>
                 <span className="bg-blue-500/10 px-3 py-1 rounded-full text-xs font-bold text-[#1FA2FF] border border-blue-500/20">
                   {currentTrips.length} Active
                 </span>
              </div>
              <div className="space-y-4">
                {currentTrips.length > 0 ? currentTrips.map((booking, idx) => (
                  <TripCard key={`current-${idx}`} booking={booking} isCurrent={true} />
                )) : (
                  <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 text-center">
                    <AlertCircle size={32} className="mx-auto text-gray-600 mb-2" />
                    <p className="text-gray-500 text-sm">No active trips at the moment.</p>
                  </div>
                )}
              </div>
            </div>

            {/* History Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                   <History size={24} className="text-gray-400" />
                   Past Journeys
                 </h2>
                 <span className="bg-white/5 px-3 py-1 rounded-full text-xs font-bold text-gray-400 border border-white/10">
                   {pastTrips.length} Completed
                 </span>
              </div>
              <div className="space-y-4">
                {pastTrips.length > 0 ? pastTrips.map((booking, idx) => (
                  <TripCard key={`past-${idx}`} booking={booking} isCurrent={false} />
                )) : (
                  <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 text-center">
                    <p className="text-gray-500 text-sm">No trip history available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentModal = ({ vehicle, bookingData, onComplete, onCancel }) => {
  const [step, setStep] = useState('INIT');

  const handlePay = () => {
    setStep('PROCESSING');
    setTimeout(() => {
      setStep('SUCCESS');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="bg-[#0B1C2D] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        {step === 'INIT' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Secure Payment</h2>
            <p className="text-gray-500 text-sm mb-8">Confirm your booking for {vehicle.name}</p>
            
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-6 space-y-3">
               <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Duration ({bookingData.duration} hrs)</span>
                  <span className="text-white font-bold">{formatCurrency(vehicle.pricePerHour * bookingData.duration)}</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Security Deposit (Refundable)</span>
                  <span className="text-white font-bold">{formatCurrency(2500)}</span>
               </div>
               <div className="border-t border-white/5 pt-3 flex justify-between">
                  <span className="text-white font-bold">Total Amount</span>
                  <span className="text-[#1FA2FF] font-black text-xl">{formatCurrency((vehicle.pricePerHour * bookingData.duration) + 2500)}</span>
               </div>
            </div>

            <div className="space-y-3">
              <button onClick={handlePay} className="w-full py-4 bg-[#1FA2FF] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                <Shield size={18}/> Pay {formatCurrency((vehicle.pricePerHour * bookingData.duration) + 2500)}
              </button>
              <button onClick={onCancel} className="w-full py-3 text-gray-500 font-bold text-sm">Cancel Transaction</button>
            </div>
          </div>
        )}

        {step === 'PROCESSING' && (
          <div className="p-12 text-center">
            <Loader2 size={48} className="mx-auto text-[#1FA2FF] animate-spin mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Processing Payment</h2>
            <p className="text-gray-500 text-sm">Contacting your bank...</p>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="p-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
               <Check size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Ride Booked!</h2>
            <p className="text-gray-500 text-sm mb-8">Your transaction was successful. Pickup instructions sent to {bookingData.phone}.</p>
            <button onClick={onComplete} className="w-full py-4 bg-white text-[#0B1C2D] rounded-2xl font-black text-sm tracking-widest">
              VIEW IN PROFILE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ListingView = ({ vehicles, filters, setFilters, handleBookNow }) => {
  const filtered = useMemo(() => {
    return vehicles.filter(v => {
      const matchLoc = filters.location === 'ALL' || v.location === filters.location;
      const matchType = filters.type === 'ALL' || v.type === filters.type;
      const matchSearch = v.name.toLowerCase().includes(filters.search.toLowerCase());
      return matchLoc && matchType && matchSearch;
    });
  }, [vehicles, filters]);

  return (
    <div className={`min-h-screen pt-20 px-4 pb-12 ${COLORS.gradient}`}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0B1C2D]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-500" />
            <input 
              type="text" placeholder="Search model..." 
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full bg-[#0F2027] text-white border border-white/10 rounded-lg pl-9 p-2 text-sm outline-none"
            />
          </div>
          <select 
            value={filters.location} 
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="bg-[#0F2027] text-white border border-white/10 rounded-lg p-2 text-sm outline-none"
          >
            <option value="ALL">All Cities</option>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <div className="flex bg-[#0F2027] rounded-lg p-1 border border-white/10">
            {['ALL', 'CAR', 'BIKE'].map(t => (
              <button 
                key={t}
                onClick={() => setFilters({...filters, type: t})}
                className={`flex-1 text-xs font-bold py-1.5 rounded-md ${filters.type === t ? 'bg-[#1FA2FF] text-white' : 'text-gray-400'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(v => (
            <div key={v.id} className="bg-[#0B1C2D] border border-white/10 rounded-2xl overflow-hidden hover:border-[#1FA2FF]/50 transition-all group">
              <div className="relative h-48 overflow-hidden">
                <img src={v.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={v.name} />
                <div className="absolute bottom-3 right-3 bg-white text-[#0B1C2D] px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {formatCurrency(v.pricePerHour)}/hr
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white">{v.name}</h3>
                <p className="text-gray-500 text-xs mb-4">{v.location}</p>
                <button onClick={() => handleBookNow(v)} className="w-full py-2 bg-[#1FA2FF] text-white rounded-lg text-sm font-bold">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VehicleDetails = ({ selectedVehicle, setView, kycData, setKycData, handleFileUpload, onConfirm }) => {
  const [bookingMeta, setBookingMeta] = useState({
    pickup: '',
    dropoff: ''
  });

  const duration = useMemo(() => {
    if (!bookingMeta.pickup || !bookingMeta.dropoff) return 0;
    const start = new Date(bookingMeta.pickup);
    const end = new Date(bookingMeta.dropoff);
    const diffMs = end - start;
    const diffHrs = diffMs / (1000 * 60 * 60);
    return diffHrs > 0 ? Math.ceil(diffHrs) : 0;
  }, [bookingMeta]);

  const totalRentalPrice = duration * selectedVehicle.pricePerHour;
  const isFormComplete = kycData.fullName && kycData.phone && kycData.licenseNumber && kycData.licenseFront && kycData.aadharFront && duration > 0;

  return (
    <div className={`min-h-screen pt-20 px-4 pb-12 ${COLORS.gradient}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="bg-[#0B1C2D] border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl">
            <button onClick={() => setView('LISTING')} className="absolute top-4 left-4 z-10 p-2 bg-black/40 text-white rounded-full"><X size={20}/></button>
            <img src={selectedVehicle.image} className="w-full h-[450px] object-cover" alt="Main" />
            <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white">{selectedVehicle.name}</h1>
                    <p className="text-[#1FA2FF] text-sm font-bold mt-1">{selectedVehicle.location} • {formatCurrency(selectedVehicle.pricePerHour)}/hr</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated Total</p>
                    <p className="text-2xl font-black text-white">{formatCurrency(totalRentalPrice)}</p>
                </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-[#0B1C2D] border border-white/10 rounded-2xl p-6">
                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block flex items-center gap-1"><Calendar size={12}/> Pickup Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={bookingMeta.pickup}
                  onChange={(e) => setBookingMeta({...bookingMeta, pickup: e.target.value})}
                  className="w-full bg-[#0F2027] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#1FA2FF]" 
                />
             </div>
             <div className="bg-[#0B1C2D] border border-white/10 rounded-2xl p-6">
                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block flex items-center gap-1"><Calendar size={12}/> Dropoff Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={bookingMeta.dropoff}
                  onChange={(e) => setBookingMeta({...bookingMeta, dropoff: e.target.value})}
                  className="w-full bg-[#0F2027] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#1FA2FF]" 
                />
             </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-[#0B1C2D] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2"><ShieldCheck className="text-green-400"/> KYC Verification</span>
                {duration > 0 && <span className="text-xs bg-blue-500/20 text-[#1FA2FF] px-2 py-1 rounded-md">{duration} Hours</span>}
            </h3>
            <div className="space-y-4">
              <input 
                type="text" placeholder="Full Name (As per DL)" 
                value={kycData.fullName}
                onChange={(e) => setKycData({...kycData, fullName: e.target.value})}
                className="w-full bg-[#0F2027] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#1FA2FF]"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="tel" placeholder="Phone" 
                  value={kycData.phone}
                  onChange={(e) => setKycData({...kycData, phone: e.target.value})}
                  className="w-full bg-[#0F2027] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#1FA2FF]"
                />
                <input 
                  type="text" placeholder="License No." 
                  value={kycData.licenseNumber}
                  onChange={(e) => setKycData({...kycData, licenseNumber: e.target.value})}
                  className="w-full bg-[#0F2027] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#1FA2FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="aspect-[3/2] border-2 border-dashed border-gray-700 bg-[#0F2027] rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors hover:border-[#1FA2FF]/50">
                   <input type="file" className="hidden" onChange={(e) => handleFileUpload('licenseFront', e.target.files[0])} />
                   {kycData.licenseFront ? <img src={kycData.licenseFront} className="w-full h-full object-cover" /> : <span className="text-[10px] text-gray-500 font-bold">DL FRONT</span>}
                </label>
                <label className="aspect-[3/2] border-2 border-dashed border-gray-700 bg-[#0F2027] rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors hover:border-[#1FA2FF]/50">
                   <input type="file" className="hidden" onChange={(e) => handleFileUpload('licenseBack', e.target.files[0])} />
                   {kycData.licenseBack ? <img src={kycData.licenseBack} className="w-full h-full object-cover" /> : <span className="text-[10px] text-gray-500 font-bold">DL BACK</span>}
                </label>
                <label className="col-span-2 h-16 border-2 border-dashed border-gray-700 bg-[#0F2027] rounded-2xl flex items-center justify-center gap-3 cursor-pointer transition-colors hover:border-[#1FA2FF]/50">
                   <input type="file" className="hidden" onChange={(e) => handleFileUpload('aadharFront', e.target.files[0])} />
                   {kycData.aadharFront ? <span className="text-green-400 font-bold text-xs flex items-center gap-1"><Check size={14}/> National ID Linked</span> : <span className="text-[10px] text-gray-500 font-bold">UPLOAD NATIONAL ID</span>}
                </label>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400 text-sm">Total Rental Duration</span>
                    <span className="text-white font-bold">{duration} Hours</span>
                </div>
                <button 
                    disabled={!isFormComplete}
                    onClick={() => onConfirm(duration, bookingMeta.pickup, bookingMeta.dropoff)}
                    className={`w-full py-4 rounded-2xl font-black text-sm transition-all transform active:scale-95 ${isFormComplete ? 'bg-[#1FA2FF] text-white shadow-xl shadow-blue-500/20' : 'bg-gray-800 text-gray-600'}`}
                >
                    {duration <= 0 ? 'SELECT TIMES' : isFormComplete ? 'PROCEED TO PAYMENT' : 'COMPLETE KYC'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('HOME');
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [vehicles] = useState(INITIAL_VEHICLES);
  const [filters, setFilters] = useState({ type: 'ALL', search: '', location: 'ALL' });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [activeBookingDetails, setActiveBookingDetails] = useState(null);
  const [kycData, setKycData] = useState({ fullName: '', phone: '', licenseNumber: '', licenseFront: null, licenseBack: null, aadharFront: null });

  const handleLogin = () => { setUser(MOCK_USER); setView('HOME'); };
  const handleBookNow = (v) => { if (!user) setView('LOGIN'); else { setSelectedVehicle(v); setView('DETAILS'); } };
  const handleFileUpload = (field, file) => { if (file) setKycData(prev => ({ ...prev, [field]: URL.createObjectURL(file) })); };

  const startPayment = (duration, pickup, dropoff) => {
    setActiveBookingDetails({ duration, pickup, dropoff });
    setShowPayment(true);
  };

  const onPaymentComplete = () => {
    const newBooking = {
      vehicle: selectedVehicle,
      date: new Date(),
      duration: activeBookingDetails.duration,
      pickupTime: activeBookingDetails.pickup,
      dropoffTime: activeBookingDetails.dropoff,
      totalPrice: (selectedVehicle.pricePerHour * activeBookingDetails.duration),
      status: 'PAID',
      phone: kycData.phone
    };
    setBookings([newBooking, ...bookings]);
    setShowPayment(false);
    setView('PROFILE');
  };

  return (
    <div className="font-sans antialiased text-white">
      <Navbar user={user} setView={setView} />
      
      {view === 'HOME' || view === 'LISTING' ? (
        <ListingView vehicles={vehicles} filters={filters} setFilters={setFilters} handleBookNow={handleBookNow} />
      ) : view === 'DETAILS' ? (
        <VehicleDetails 
          selectedVehicle={selectedVehicle} 
          setView={setView} 
          kycData={kycData} 
          setKycData={setKycData} 
          handleFileUpload={handleFileUpload}
          onConfirm={startPayment}
        />
      ) : view === 'PROFILE' ? (
        <ProfileView user={user} bookings={bookings} setView={setView} />
      ) : view === 'LOGIN' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1C2D] p-8 rounded-3xl border border-white/10 text-center shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Join RentNGo</h2>
            <p className="text-gray-400 text-sm mb-6">Experience the future of vehicle rentals.</p>
            <button onClick={handleLogin} className="bg-[#1FA2FF] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">Sign in with Google</button>
          </div>
        </div>
      )}

      {showPayment && (
        <PaymentModal 
          vehicle={selectedVehicle} 
          bookingData={{ duration: activeBookingDetails.duration, phone: kycData.phone }}
          onCancel={() => setShowPayment(false)}
          onComplete={onPaymentComplete}
        />
      )}
    </div>
  );
}
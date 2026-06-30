import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, Wrench, Zap, AlertTriangle, Activity, ShieldCheck, 
  MapPin, Radio, CheckCircle, Server,
  HeartPulse, UserX, AlertOctagon, RefreshCcw, Database, Lock, Search, Share2, Bell, Users, Hand
} from 'lucide-react';

const RANDOM_ISSUES = [
  { icon: <Wrench className="w-5 h-5"/>, text: "Engine Failure" },
  { icon: <AlertTriangle className="w-5 h-5"/>, text: "Tyre Burst" },
  { icon: <Activity className="w-5 h-5"/>, text: "Mechanical Failure" },
  { icon: <AlertTriangle className="w-5 h-5"/>, text: "Engine Overheating" },
  { icon: <Car className="w-5 h-5"/>, text: "Vehicle Breakdown" },
  { icon: <AlertOctagon className="w-5 h-5"/>, text: "Accident" },
  { icon: <Zap className="w-5 h-5"/>, text: "Battery Failure" },
  { icon: <AlertTriangle className="w-5 h-5"/>, text: "Unsafe Vehicle Condition" },
  { icon: <HeartPulse className="w-5 h-5"/>, text: "Driver Suddenly Feels Sick" },
  { icon: <Activity className="w-5 h-5"/>, text: "Medical Emergency" },
  { icon: <UserX className="w-5 h-5"/>, text: "Driver Unable To Continue" },
  { icon: <ShieldCheck className="w-5 h-5"/>, text: "Safety Emergency" },
  { icon: <Hand className="w-5 h-5"/>, text: "Driver Requests Emergency Transfer" }
];

const PASSENGER_EXPERIENCE = [
  "No Rebooking Required",
  "No Extra Charges",
  "Same Booking Continues",
  "Same Fare Guaranteed",
  "Same Destination",
  "Seat Reservation Preserved",
  "Live Tracking Continues",
  "Payment Remains Consistent",
  "Better Passenger Experience"
];

const TECH_STACK = [
  { name: "Tracking Service", desc: "Live GPS via WebSockets", icon: <MapPin /> },
  { name: "Redis GEOSEARCH", desc: "Finds Nearby Available Ride", icon: <Search /> },
  { name: "Matching Service", desc: "Route Validation & Seat Validation", icon: <Activity /> },
  { name: "Redis Distributed Lock", desc: "Prevents duplicate transfers", icon: <Lock /> },
  { name: "Saga Pattern", desc: "Distributed transaction consistency", icon: <RefreshCcw /> },
  { name: "Kafka", desc: "Event Streaming & Broadcasting", icon: <Share2 /> },
  { name: "RabbitMQ", desc: "Passenger notifications & jobs", icon: <RefreshCcw /> },
  { name: "Notification Service", desc: "Real-time journey updates", icon: <Bell /> },
  { name: "Cassandra", desc: "Recovery persistence & history", icon: <Database /> },
  { name: "WebSockets", desc: "Live frontend state sync", icon: <Radio /> }
];

export default function AutoShiftShowcase() {
  const [step, setStep] = useState(0);
  const [issue, setIssue] = useState(RANDOM_ISSUES[0]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    const advance = () => {
      setStep(s => {
        const next = s + 1;
        if (next > 12) {
          setIssue(RANDOM_ISSUES[Math.floor(Math.random() * RANDOM_ISSUES.length)]);
          return 0;
        }
        return next;
      });
    };

    let delay = 3000; 
    
    switch(step) {
      case 0: delay = 3000; break; 
      case 1: delay = 3000; break; 
      case 2: delay = 2500; break; 
      case 3: delay = 2500; break; 
      case 4: delay = 3000; break; 
      case 5: delay = 3500; break; 
      case 6: delay = 3000; break; 
      case 7: delay = 5000; break; 
      case 8: delay = 4000; break; 
      case 9: delay = 2500; break; 
      case 10: delay = 3000; break; 
      case 11: delay = 3000; break; 
      case 12: delay = 5000; break; 
    }

    timeout = setTimeout(advance, delay);
    return () => clearTimeout(timeout);
  }, [step]);

  return (
    <section id="autoshift" className="py-24 bg-app-bg text-app-text relative z-10 font-sans border-t border-app-border transition-colors">
      <div className="max-w-screen-xl mx-auto px-6 relative z-10 space-y-24">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-xs font-semibold text-blue-500 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            RideSync Exclusive
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-app-text mb-6 transition-colors"
          >
            AutoShift™ Recovery
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-app-muted leading-relaxed max-w-2xl mx-auto transition-colors"
          >
            Intelligent journey recovery system that seamlessly transfers passengers to a nearby available ride if the current vehicle cannot continue.
          </motion.p>
        </div>

        {/* The Massive Interactive Animation Block */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-app-text tracking-tight transition-colors">Live Recovery Simulation</h3>
            <div className="flex items-center gap-2 text-sm font-semibold text-app-muted transition-colors">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Auto-playing
            </div>
          </div>
          
          <div className="relative w-full h-[500px] md:h-[600px] rounded-[24px] bg-app-surface border border-app-border shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex items-center justify-center transition-colors">
            {/* Map Background */}
            <div className="absolute inset-0 bg-app-bg opacity-50 transition-colors" style={{ backgroundImage: 'radial-gradient(var(--border-app) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            {/* Progress Bar Top */}
            <div className="absolute top-0 left-0 h-1 bg-app-border w-full z-50 transition-colors">
              <motion.div 
                className="h-full bg-blue-600"
                animate={{ width: `${(step / 12) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Central Stage */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
              <AnimatePresence mode="wait">
                
                {/* STEP 0: Normal Ride */}
                {step === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-6 relative shadow-sm">
                      <motion.div animate={{ scale: [1, 1.3, 1.6], opacity: [0.3, 0.1, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-blue-400 rounded-full" />
                      <Car className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-app-text mb-2 tracking-tight transition-colors">Ride in Progress</h3>
                    <p className="text-app-muted font-medium text-lg transition-colors">Live tracking is active. Passengers are safely aboard.</p>
                  </motion.div>
                )}

                {/* STEP 1: Incident */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                      <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 0.2, repeat: Infinity }} className="text-red-500">
                        {issue.icon}
                      </motion.div>
                    </div>
                    <h3 className="text-2xl font-bold text-red-500 mb-2 tracking-tight">Unexpected Incident</h3>
                    <p className="text-app-text text-xl font-bold transition-colors">{issue.text}</p>
                    <p className="text-app-muted mt-2 font-medium transition-colors">Vehicle stopped. Live tracking alerts anomaly.</p>
                  </motion.div>
                )}

                {/* STEP 2: Driver Activates */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="flex flex-col items-center text-center">
                    <div className="bg-app-bg border border-app-border p-6 rounded-[20px] mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden transition-colors">
                      <div className="flex items-center gap-4 mb-6 opacity-30">
                        <div className="w-10 h-10 bg-app-border rounded-full transition-colors" />
                        <div className="w-32 h-4 bg-app-border rounded transition-colors" />
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-blue-600 px-8 py-3.5 rounded-xl text-white font-bold text-lg flex items-center gap-3 shadow-md"
                      >
                        <Zap className="w-5 h-5" /> Activate AutoShift™
                      </motion.button>
                      <motion.div 
                        initial={{ top: "100%" }} animate={{ top: "0%" }} transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        className="absolute inset-0 bg-blue-600/95 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg"
                      >
                        Emergency Protocol Initiated
                      </motion.div>
                    </div>
                    <p className="text-app-muted font-medium text-lg transition-colors">👤 Current Driver manually clicks "Activate AutoShift™" from Driver Web.</p>
                  </motion.div>
                )}

                {/* STEP 3: Tracking Service */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 mb-6">
                      <MapPin className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-app-text mb-3 tracking-tight transition-colors">Tracking Service</h3>
                    <div className="bg-app-surface border border-app-border px-6 py-2.5 rounded-lg text-app-text font-mono text-sm mb-4 font-medium transition-colors">
                      📍 GPS Coordinates Captured
                    </div>
                    <p className="text-app-muted font-medium transition-colors">📍 Tracking Service sends the current GPS location.</p>
                  </motion.div>
                )}

                {/* STEP 4: Redis GEOSEARCH */}
                {step === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center w-full">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 mb-4">
                      <Server className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-app-text mb-2 tracking-tight transition-colors">Redis GEOSEARCH</h3>
                    <p className="text-red-500 font-bold mb-8">🔍 Searching for a Nearby Available Ride...</p>
                    <div className="relative w-64 h-64 border border-app-border rounded-full flex items-center justify-center bg-app-bg shadow-sm transition-colors">
                      <motion.div animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 bg-red-500/10 rounded-full" />
                      <div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)] z-10" />
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-t-2 border-red-500/40 rounded-full opacity-50" />
                      <Car className="absolute top-6 left-6 w-5 h-5 text-app-muted" />
                      <Car className="absolute bottom-12 right-12 w-5 h-5 text-app-muted" />
                      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 }} className="absolute top-12 right-6 z-20">
                        <Car className="w-6 h-6 text-green-500" />
                        <span className="absolute -top-7 -left-4 text-[10px] font-bold text-white bg-green-500 px-2 py-0.5 rounded shadow-sm">Match!</span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: Matching Validation */}
                {step === 5 && (
                  <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 mb-6">
                      <Activity className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-app-text mb-6 tracking-tight transition-colors">Matching Service</h3>
                    <div className="space-y-3 text-left bg-app-bg border border-app-border p-6 rounded-2xl w-full max-w-sm shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-colors">
                      <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500"/> <span className="text-app-text font-medium transition-colors">Route Intersects</span></motion.div>
                      <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500"/> <span className="text-app-text font-medium transition-colors">Distance &lt; 5km</span></motion.div>
                      <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }} className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500"/> <span className="text-app-text font-medium transition-colors">Empty Seats Available</span></motion.div>
                      <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 }} className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-500"/> <span className="text-app-text font-medium transition-colors">Vehicle Capacity Valid</span></motion.div>
                    </div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.0 }} className="mt-6 text-lg font-bold text-green-600 bg-green-500/10 px-6 py-2 rounded-xl border border-green-500/20 shadow-sm">
                      Nearby Ride Found!
                    </motion.div>
                  </motion.div>
                )}

                {/* STEP 6: Driver Accepts */}
                {step === 6 && (
                  <motion.div key="step6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                    <div className="bg-app-bg border border-app-border p-8 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden w-full max-w-sm transition-colors">
                      <div className="flex items-center justify-center w-12 h-12 bg-orange-500/10 rounded-full mb-4 mx-auto border border-orange-500/20">
                        <AlertTriangle className="w-6 h-6 text-orange-500" />
                      </div>
                      <h3 className="text-xl font-bold text-app-text mb-2 transition-colors">Incoming AutoShift Request</h3>
                      <p className="text-sm text-app-muted mb-8 font-medium transition-colors">A nearby RideSync vehicle has broken down. 2 passengers need a ride on your route.</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="bg-app-surface text-app-text py-3 rounded-xl font-bold hover:bg-app-surface-hover border border-app-border transition-colors">Decline</button>
                        <motion.button 
                          initial={{ backgroundColor: "#3b82f6" }} animate={{ backgroundColor: "#16a34a" }} transition={{ delay: 1 }}
                          className="bg-blue-600 text-white py-3 rounded-xl font-bold shadow-sm"
                        >
                          Accept
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 7: Backend Processing */}
                {step === 7 && (
                  <motion.div key="step7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full">
                    <h3 className="text-2xl font-bold text-app-text mb-8 tracking-tight transition-colors">Orchestrating Transfer</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                      {[
                        { name: "Redis Distributed Lock Activated", icon: <Lock className="w-4 h-4"/>, delay: 0 },
                        { name: "Saga Pattern Started", icon: <RefreshCcw className="w-4 h-4"/>, delay: 0.6 },
                        { name: "Passenger Transfer Processing", icon: <Users className="w-4 h-4"/>, delay: 1.2 },
                        { name: "Notification Service Updates", icon: <Bell className="w-4 h-4"/>, delay: 1.8 },
                        { name: "Kafka Broadcasting Event", icon: <Share2 className="w-4 h-4"/>, delay: 2.4 },
                        { name: "RabbitMQ Background Notifications", icon: <Server className="w-4 h-4"/>, delay: 3.0 }
                      ].map((item, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: item.delay }}
                          className="flex items-center gap-3 bg-app-bg border border-app-border p-4 rounded-xl shadow-sm transition-colors"
                        >
                          <div className="text-blue-500 bg-blue-500/10 border border-blue-500/20 p-2 rounded-lg">{item.icon}</div>
                          <span className="text-sm font-bold text-app-text transition-colors">{item.name}</span>
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: item.delay + 0.3 }} className="ml-auto">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 8: Passenger Transfer Animation */}
                {step === 8 && (
                  <motion.div key="step8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full">
                    <h3 className="text-xl font-bold text-app-text mb-12 tracking-tight transition-colors">Seamless Passenger Transfer</h3>
                    
                    <div className="flex items-center justify-between w-full max-w-2xl relative mt-4">
                      {/* Old Car */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center relative shadow-sm">
                          <Car className="w-10 h-10 text-red-500 opacity-50" />
                          <motion.div animate={{ opacity: [1, 0] }} transition={{ duration: 1 }} className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white"><Users className="w-4 h-4"/></motion.div>
                        </div>
                        <span className="text-red-500 font-bold text-xs">Original Ride</span>
                      </div>

                      {/* The Transfer Path */}
                      <div className="flex-1 relative h-20 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full border-t-[2px] border-dashed border-app-border transition-colors" />
                        </div>
                        <motion.div 
                          initial={{ x: "-150%" }} animate={{ x: "150%" }} transition={{ duration: 2, ease: "easeInOut" }}
                          className="w-12 h-12 bg-blue-600 rounded-full shadow-[0_4px_15px_rgba(37,99,235,0.3)] flex items-center justify-center z-10 border-2 border-app-bg transition-colors"
                        >
                          <Users className="w-5 h-5 text-white" />
                        </motion.div>
                      </div>

                      {/* New Car */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center relative shadow-sm">
                          <Car className="w-10 h-10 text-green-500" />
                          <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8 }} className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md border-2 border-app-bg transition-colors"><Users className="w-4 h-4"/></motion.div>
                        </div>
                        <span className="text-green-500 font-bold text-xs">Replacement Ride</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 9: Ride Switch */}
                {step === 9 && (
                  <motion.div key="step9" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                      <Radio className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-app-text mb-6 tracking-tight transition-colors">Live Tracking Switched</h3>
                    <div className="bg-app-bg p-6 rounded-2xl border border-app-border shadow-sm w-full max-w-sm transition-colors">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-app-muted font-bold text-sm transition-colors">Old Ride</span>
                        <span className="text-red-500 font-bold bg-red-500/10 px-3 py-1 rounded border border-red-500/20 text-[10px]">Inactive</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-app-muted font-bold text-sm transition-colors">New Ride</span>
                        <span className="text-green-500 font-bold bg-green-500/10 px-3 py-1 rounded border border-green-500/20 text-[10px]">Active</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 10: Journey Continues */}
                {step === 10 && (
                  <motion.div key="step10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 relative mb-6">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-[3px] border-dashed border-blue-500/30 rounded-full" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }}><Car className="w-10 h-10 text-blue-500" /></motion.div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-app-text mb-2 tracking-tight transition-colors">Journey Continues</h3>
                    <p className="text-blue-500 text-xs font-bold bg-blue-500/10 px-5 py-2 rounded-full border border-blue-500/20 mb-4 shadow-sm">ETA Updated • Distance Updated</p>
                    <p className="text-app-muted font-medium text-sm transition-colors">Route continues normally on the map without interruption.</p>
                  </motion.div>
                )}

                {/* STEP 11: Destination Reached */}
                {step === 11 && (
                  <motion.div key="step11" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1 }} className="w-20 h-20 bg-green-500/10 border-[3px] border-green-500/50 rounded-full flex items-center justify-center mb-6 shadow-[0_4px_20px_rgba(34,197,94,0.2)]">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-app-text mb-2 tracking-tight transition-colors">Journey Completed</h3>
                    <p className="text-app-muted font-medium text-base transition-colors">Successfully reached destination despite the incident.</p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Passenger Experience */}
        <div className="max-w-5xl mx-auto pt-8">
          <h3 className="text-xl font-bold mb-8 text-app-text tracking-tight transition-colors">The Passenger Experience</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PASSENGER_EXPERIENCE.map((exp, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02, y: -2 }}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 bg-app-surface border border-app-border p-4 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all cursor-default"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm font-bold text-app-text transition-colors">{exp}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technical Backbone */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-app-border flex items-center justify-center border border-app-border transition-colors">
              <Server className="w-4 h-4 text-app-muted transition-colors"/>
            </div>
            <h3 className="text-xl font-bold text-app-text tracking-tight transition-colors">Technical Architecture</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TECH_STACK.map((tech, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02, y: -2 }}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                className="bg-app-surface border border-app-border p-5 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-blue-500/50 transition-all cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-app-bg flex items-center justify-center text-blue-500 mb-5 border border-app-border transition-colors [&>svg]:w-6 [&>svg]:h-6">
                  {tech.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-app-text mb-1 transition-colors">{tech.name}</h4>
                  <p className="text-sm text-app-muted leading-relaxed transition-colors">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

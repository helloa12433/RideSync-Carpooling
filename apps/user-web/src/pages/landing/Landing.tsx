import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Car, Search, Zap, CheckCircle
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

import MapboxHero from './MapboxHero';
import ArchitectureShowcase from './ArchitectureShowcase';
import FeaturesShowcase from './FeaturesShowcase';
import WorkflowShowcase from './WorkflowShowcase';
import AutoShiftShowcase from './AutoShiftShowcase';
import HelpCenter from './HelpCenter';
import Footer from '../../components/Footer';

export default function Landing() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-app-bg text-app-text font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900 transition-colors duration-300">



      <main className="relative z-10">

        {/* Hero Section */}
        <section className="pt-24 pb-12 px-6 max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-stretch gap-12 min-h-[85vh]">

          {/* Left Text */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-10">
            
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-app-text"
              >
                Share Rides.<br />
                Save Money.<br />
                Travel Together.
              </motion.h1>

              {/* Benefit Chips */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="flex flex-wrap gap-3 pt-2"
              >
                {[
                  { icon: "🌱", text: "Eco Friendly" },
                  { icon: "⛽", text: "Save Fuel" },
                  { icon: "♻️", text: "Lower CO₂ Emissions" },
                  { icon: "🚦", text: "Reduce Traffic" },
                  { icon: "💰", text: "Lower Travel Cost" },
                ].map((chip, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-4 py-2 bg-app-surface/60 backdrop-blur-md border border-app-border rounded-full text-sm font-semibold text-app-text shadow-sm transition-colors">
                    <span>{chip.icon}</span> {chip.text}
                  </div>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-lg text-app-muted font-medium leading-relaxed max-w-2xl pt-2 transition-colors"
              >
                Production-grade distributed carpooling platform powered by intelligent ride matching, live tracking and AutoShift recovery.
              </motion.p>
            </div>

            {/* Premium Vertical Workflow Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="bg-app-surface/80 backdrop-blur-xl border border-app-border p-6 md:p-8 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-50/10 border border-blue-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-app-text tracking-tight">AutoShift™ Recovery Workflow</h3>
              </div>

              <div className="relative pl-4 space-y-4">
                {/* Vertical Progress Line */}
                <div className="absolute top-2 bottom-2 left-[11px] w-[2px] bg-app-border transition-colors" />
                <motion.div 
                  className="absolute top-2 left-[11px] w-[2px] bg-blue-500 rounded-full z-0"
                  initial={{ height: "0%" }}
                  whileInView={{ height: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 4, ease: "linear" }}
                />

                {[
                  "Driver Activates AutoShift™",
                  "Emergency Recovery Started",
                  "Tracking Service Shares Live GPS",
                  "Redis GEOSEARCH Finds Nearby Available Ride",
                  "Replacement Driver Accepts",
                  "Passengers Shift Automatically",
                  "Journey Continues",
                  "₹0 Extra Cost",
                  "No Rebooking Required"
                ].map((step, idx) => (
                  <div key={idx} className="relative z-10 flex items-center gap-4 group">
                    <motion.div 
                      initial={{ scale: 0, backgroundColor: "var(--bg-surface)", borderColor: "var(--border-app)", color: "var(--border-app)" }}
                      whileInView={{ scale: 1, backgroundColor: "#3b82f6", borderColor: "#3b82f6", color: "#fff" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: (idx * 0.45), type: "spring" }}
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-sm shrink-0"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </motion.div>
                    <motion.span 
                      initial={{ opacity: 0.3, x: -5, color: "var(--text-muted)" }}
                      whileInView={{ opacity: 1, x: 0, color: "var(--text-main)" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: (idx * 0.45) }}
                      className="text-sm font-semibold tracking-tight transition-colors"
                    >
                      {step}
                    </motion.span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Link to="/search" className="px-8 py-3.5 bg-app-text text-app-bg font-semibold rounded-full text-center hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2">
                <Search className="w-4 h-4" /> Find a Ride
              </Link>
              <a href={import.meta.env.VITE_DRIVER_WEB_URL || "http://localhost:5174"} className="px-8 py-3.5 bg-app-surface text-app-text border border-app-border font-semibold rounded-full text-center hover:bg-app-surface-hover transition-colors shadow-sm flex items-center justify-center gap-2">
                <Car className="w-4 h-4" /> Offer a Ride
              </a>
            </motion.div>

          </div>

          {/* Right Map Animation (Mapbox GL JS 3D Experience) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 flex min-h-[400px]"
          >
            <div className="w-full h-full flex flex-col items-stretch">
              <MapboxHero />
            </div>
          </motion.div>
        </section>

        {/* Features Showcase */}
        <FeaturesShowcase />

        {/* Workflow Showcase */}
        <WorkflowShowcase />

        {/* Premium AutoShift Presentation */}
        <AutoShiftShowcase />

        {/* Architecture Showcase */}
        <ArchitectureShowcase />

        {/* Help Center */}
        <HelpCenter />

        {/* Footer */}
        <Footer />

      </main>
    </div>
  );
}

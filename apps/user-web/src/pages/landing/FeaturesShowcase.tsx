import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, Search, Ticket, Navigation, Zap, RefreshCcw, 
  CreditCard, Bell, ShieldCheck, Activity, Database, Server
} from 'lucide-react';

const FEATURES_DATA = [
  {
    title: "Ride Publishing",
    icon: <Car />,
    desc: "Drivers can publish rides by selecting source, destination, date, time, price and available seats."
  },
  {
    title: "Smart Ride Matching",
    icon: <Search />,
    desc: "Automatically matches passengers with nearby rides using Redis GEOSEARCH and intelligent route matching."
  },
  {
    title: "Instant Ride Booking",
    icon: <Ticket />,
    desc: "Book seats instantly with distributed seat reservation and real-time availability."
  },
  {
    title: "Live Ride Tracking",
    icon: <Navigation />,
    desc: "Track your driver's live location with smooth vehicle animation and live ETA."
  },
  {
    title: "AutoShift",
    icon: <Zap />,
    desc: "If a driver's vehicle breaks down, RideSync automatically finds another nearby driver and transfers passengers."
  },
  {
    title: "Saga Transactions",
    icon: <RefreshCcw />,
    desc: "Ensures booking, payment and seat reservation remain consistent across distributed microservices."
  },
  {
    title: "Secure Payments",
    icon: <CreditCard />,
    desc: "Fast payment processing with refund support and Saga coordination."
  },
  {
    title: "Real-Time Notifications",
    icon: <Bell />,
    desc: "Receive instant booking confirmations, ride updates, AutoShift alerts and payment notifications."
  },
  {
    title: "Secure Authentication",
    icon: <ShieldCheck />,
    desc: "Google Authentication with JWT authorization and protected APIs."
  },
  {
    title: "Event-Driven Communication",
    icon: <Activity />,
    desc: "Kafka and RabbitMQ enable reliable communication between distributed microservices."
  },
  {
    title: "High Performance Storage",
    icon: <Database />,
    desc: "Apache Cassandra and Redis provide scalable storage with ultra-fast data access."
  },
  {
    title: "Distributed Architecture",
    icon: <Server />,
    desc: "RideSync is built using scalable microservices capable of handling thousands of concurrent users."
  }
];

export default function FeaturesShowcase() {
  return (
    <section id="features" className="py-32 bg-app-bg relative z-10 overflow-hidden font-sans border-t border-app-border transition-colors">
      <div className="max-w-screen-2xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-xs font-semibold text-blue-500 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Platform Features
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-app-text mb-6 transition-colors"
          >
            Engineering Excellence
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-app-muted leading-relaxed transition-colors"
          >
            RideSync combines real-time tracking, distributed microservices and intelligent ride management to deliver a seamless carpooling experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES_DATA.map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.02, y: -2 }}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (idx % 4) * 0.05 }}
              className="bg-app-surface border border-app-border p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-blue-500/50 transition-all cursor-default flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-app-bg flex items-center justify-center text-blue-500 mb-5 border border-app-border transition-colors shrink-0 [&>svg]:w-6 [&>svg]:h-6">
                {item.icon}
              </div>
              <h4 className="text-base font-bold text-app-text mb-2 transition-colors">{item.title}</h4>
              <p className="text-sm text-app-muted font-medium leading-relaxed transition-colors">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

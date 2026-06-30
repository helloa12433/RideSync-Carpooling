import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Network, Key, Activity, Rabbit, RefreshCcw, 
  Database, Zap, MapPin, Lock, Webhook, Globe, Car, ShieldAlert,
  Archive, FileJson, BarChart3, Stethoscope, Eye, ArrowUpRight,
  SplitSquareHorizontal, Layers, Server, ShieldCheck, Filter, Shield, 
  Settings, Users, CreditCard, Bell, RotateCcw
} from 'lucide-react';

const ARCHITECTURE_CATEGORIES = [
  {
    title: "Core Architecture",
    items: [
      { name: "Microservices Architecture", icon: <Building2 />, desc: "Independent services for Authentication, Users, Drivers, Vehicles, Rides, Matching, Booking, Tracking, Payments, Notifications and AutoShift." },
      { name: "API Gateway", icon: <Network />, desc: "Central entry point responsible for routing, authentication, authorization, request validation and rate limiting." },
      { name: "Google Auth + JWT", icon: <Key />, desc: "Secure authentication using Google OAuth with JWT access tokens for users and drivers." }
    ]
  },
  {
    title: "Distributed Communication",
    items: [
      { name: "Apache Kafka", icon: <Activity />, desc: "Real-time event streaming between Ride, Booking, Tracking, Payment and Notification services." },
      { name: "RabbitMQ", icon: <Rabbit />, desc: "Reliable asynchronous processing for notifications, retries and background jobs." },
      { name: "Saga Pattern", icon: <RefreshCcw />, desc: "Maintains distributed transaction consistency across Booking, Payment and related services." }
    ]
  },
  {
    title: "Databases & Storage",
    items: [
      { name: "Apache Cassandra", icon: <Database />, desc: "Highly scalable distributed NoSQL database for rides, bookings, tracking and historical records." },
      { name: "Redis Cache", icon: <Zap />, desc: "Stores frequently accessed ride, booking and session data for low latency." },
      { name: "Redis GEOSEARCH", icon: <MapPin />, desc: "Performs millisecond-level nearby driver searches for Ride Matching and AutoShift." },
      { name: "Redis Distributed Lock", icon: <Lock />, desc: "Prevents multiple passengers from booking the same seat simultaneously." },
      { name: "Redis Session Store", icon: <Archive />, desc: "Stores active authenticated user sessions." }
    ]
  },
  {
    title: "Real-Time Communication",
    items: [
      { name: "WebSockets", icon: <Webhook />, desc: "Provides real-time driver location, ride status and booking updates." },
      { name: "Mapbox + OpenStreetMap", icon: <Globe />, desc: "Interactive maps, live navigation, source/destination selection and animated vehicle tracking." }
    ]
  },
  {
    title: "Reliability & Recovery",
    items: [
      { name: "AutoShift Engine", icon: <Car />, desc: "Automatically transfers passengers to another nearby driver if the current vehicle breaks down." },
      { name: "Retry Worker", icon: <RotateCcw />, desc: "Automatically retries failed background operations." },
      { name: "Dead Letter Queue (DLQ)", icon: <ShieldAlert />, desc: "Stores permanently failed events for later inspection and recovery." }
    ]
  },
  {
    title: "Logging & Monitoring",
    items: [
      { name: "Centralized Logging", icon: <FileJson />, desc: "Every microservice generates structured logs for requests, responses and errors." },
      { name: "Request Logging", icon: <Activity />, desc: "Tracks every API request with request ID, response time and status code." },
      { name: "Error Logging", icon: <ShieldAlert />, desc: "Captures application errors with stack traces." },
      { name: "Performance Monitoring", icon: <BarChart3 />, desc: "Measures latency, throughput and service health." },
      { name: "Health Check Endpoints", icon: <Stethoscope />, desc: "Every microservice exposes health status for monitoring." },
      { name: "Observability", icon: <Eye />, desc: "Track distributed requests across all microservices for debugging and performance analysis." }
    ]
  },
  {
    title: "Scalability",
    items: [
      { name: "Horizontal Scaling", icon: <ArrowUpRight />, desc: "Each microservice can scale independently." },
      { name: "Database Partitioning", icon: <SplitSquareHorizontal />, desc: "Improves read/write performance." },
      { name: "Database Sharding", icon: <Layers />, desc: "Distributes data across multiple nodes for high scalability." },
      { name: "Load Balancing", icon: <Server />, desc: "Distributes incoming requests across service instances." }
    ]
  },
  {
    title: "Security",
    items: [
      { name: "JWT Authorization", icon: <ShieldCheck />, desc: "Stateless and secure access control." },
      { name: "Rate Limiting", icon: <Activity />, desc: "Prevents abuse by limiting requests per IP/user." },
      { name: "Input Validation", icon: <Filter />, desc: "Ensures incoming payloads are strictly verified." },
      { name: "Request Sanitization", icon: <Shield />, desc: "Protects against injection and malicious payloads." }
    ]
  }
];

const PLATFORM_SERVICES = [
  { name: "API Gateway", icon: <Network />, desc: "Routes requests, authentication, rate limiting and load balancing.", badges: ["Load Balancer", "JWT", "Rate Limiter"] },
  { name: "Auth Service", icon: <Key />, desc: "Google OAuth, JWT authentication and role-based authorization.", badges: ["OAuth", "JWT", "Cassandra"] },
  { name: "User Service", icon: <Users />, desc: "User profiles, ride history and account management.", badges: ["Node.js", "Cassandra"] },
  { name: "Driver Service", icon: <Car />, desc: "Driver onboarding, verification and ride management.", badges: ["Node.js", "Cassandra"] },
  { name: "Vehicle Service", icon: <Settings />, desc: "Vehicle registration, verification and seat management.", badges: ["Node.js", "Cassandra"] },
  { name: "Ride Service", icon: <MapPin />, desc: "Publish, update, cancel and manage rides.", badges: ["Cassandra", "Kafka"] },
  { name: "Matching Service", icon: <Globe />, desc: "Smart ride matching using Redis GEOSEARCH and route optimization.", badges: ["Redis GEOSEARCH", "Kafka"] },
  { name: "Booking Service", icon: <Database />, desc: "Seat reservation, booking lifecycle and Saga transactions.", badges: ["Saga", "Cassandra"] },
  { name: "Tracking Service", icon: <Webhook />, desc: "Live GPS tracking using Redis, WebSockets and location streaming.", badges: ["Redis", "WebSocket"] },
  { name: "Payment Service", icon: <CreditCard />, desc: "Secure payments, refunds and distributed Saga transactions.", badges: ["Saga", "Kafka"] },
  { name: "Notification Service", icon: <Bell />, desc: "Real-time notifications using Kafka, RabbitMQ and WebSockets.", badges: ["RabbitMQ", "Kafka", "WebSocket"] },
  { name: "AutoShift Service", icon: <RefreshCcw />, desc: "Automatic driver replacement and ride transfer using Redis GEOSEARCH.", badges: ["Redis GEOSEARCH", "Kafka"] }
];

function TechCard({ item, delayIdx = 0 }: { item: { name: string, icon: React.ReactNode, desc: string, badges?: string[] }, delayIdx?: number }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (delayIdx % 4) * 0.05 }}
      className="bg-app-surface border border-app-border p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-blue-500/50 transition-all cursor-default flex flex-col"
    >
      <div className="w-12 h-12 rounded-xl bg-app-bg flex items-center justify-center text-blue-500 mb-5 border border-app-border transition-colors shrink-0 [&>svg]:w-6 [&>svg]:h-6">
        {item.icon}
      </div>
      <h4 className="text-base font-bold text-app-text mb-2 transition-colors">{item.name}</h4>
      <p className="text-sm text-app-muted font-medium leading-relaxed transition-colors mb-3 flex-1">{item.desc}</p>
      
      {item.badges && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-app-border mt-auto transition-colors">
          {item.badges.map((badge, i) => (
            <span key={i} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-app-bg text-app-muted rounded border border-app-border transition-colors">
              {badge}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function ArchitectureShowcase() {
  return (
    <section id="tech" className="py-32 bg-app-bg relative z-10 overflow-hidden font-sans border-t border-app-border transition-colors">
      <div className="max-w-screen-2xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-app-text mb-6 transition-colors">Engineering RideSync</h2>
          <p className="text-xl md:text-2xl text-app-muted leading-relaxed transition-colors">
            A premium architecture showcase detailing the complete distributed backend system that powers our real-time carpooling platform.
          </p>
        </div>

        <div className="space-y-32">
          {ARCHITECTURE_CATEGORIES.map((category, idx) => (
            <div key={idx}>
              <h3 className="text-3xl font-bold text-app-text mb-8 flex items-center gap-3 transition-colors">
                <div className="w-2 h-8 bg-blue-600 rounded-full" />
                {category.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.items.map((item, i) => (
                  <TechCard key={i} item={item} delayIdx={i} />
                ))}
              </div>
            </div>
          ))}

          {/* Platform Services Section */}
          <div className="pt-16 border-t border-app-border transition-colors">
            <h3 className="text-4xl font-bold text-app-text mb-4 text-center transition-colors">RideSync Microservices Architecture</h3>
            <p className="text-lg text-center text-app-muted mb-12 max-w-2xl mx-auto transition-colors">
              Production-ready backend microservices powering RideSync's distributed carpooling platform.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PLATFORM_SERVICES.map((service, idx) => (
                <TechCard key={idx} item={service} delayIdx={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

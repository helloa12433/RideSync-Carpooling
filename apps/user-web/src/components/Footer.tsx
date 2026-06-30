import { Github, Linkedin, Twitter, Mail, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

const TECH_BADGES = [
  "Kafka", "RabbitMQ", "Redis", "Cassandra", 
  "Saga Pattern", "WebSockets", "Microservices"
];

export default function Footer() {
  return (
    <footer className="bg-app-bg border-t border-app-border transition-colors font-sans pt-20 pb-10">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Car className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-app-text tracking-tight transition-colors">RideSync</span>
            </Link>
            <p className="text-app-muted leading-relaxed mb-8 max-w-sm transition-colors text-sm">
              RideSync is a production-grade distributed carpooling platform focused on safe, affordable and intelligent ride sharing with real-time tracking and AutoShift™ recovery.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-app-surface border border-app-border flex items-center justify-center text-app-muted hover:text-blue-500 hover:border-blue-500 transition-all shadow-sm">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-app-surface border border-app-border flex items-center justify-center text-app-muted hover:text-blue-500 hover:border-blue-500 transition-all shadow-sm">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-app-surface border border-app-border flex items-center justify-center text-app-muted hover:text-blue-500 hover:border-blue-500 transition-all shadow-sm">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-app-surface border border-app-border flex items-center justify-center text-app-muted hover:text-blue-500 hover:border-blue-500 transition-all shadow-sm">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-app-text font-bold mb-6 transition-colors">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/search" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">Find Ride</Link></li>
              <li><a href={import.meta.env.VITE_DRIVER_WEB_URL || 'http://localhost:5174'} className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">Offer Ride</a></li>
              <li><a href={import.meta.env.VITE_DRIVER_WEB_URL || 'http://localhost:5174'} className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">Driver Portal</a></li>
              <li><a href="#autoshift" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">AutoShift™</a></li>
              <li><a href="#features" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">Live Tracking</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-app-text font-bold mb-6 transition-colors">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">About</a></li>
              <li><a href="#features" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">Features</a></li>
              <li><a href="#tech" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">Technology</a></li>
              <li><a href="#how-it-works" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">How It Works</a></li>
              <li><a href="#help-center" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">Help Center</a></li>
              <li><a href="#" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">Privacy Policy</a></li>
              <li><a href="#" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="text-app-text font-bold mb-6 transition-colors">Support</h4>
            <ul className="space-y-4">
              <li><a href="#help-center" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">Contact Support</a></li>
              <li><a href="#help-center" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">FAQs</a></li>
              <li><a href="#" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">Report an Issue</a></li>
              <li><a href="#" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium flex items-center gap-2">Emergency Assistance <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span></a></li>
              <li><a href="mailto:support@ridesync.com" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">Email Support</a></li>
              <li><a href="#" className="text-app-muted hover:text-blue-500 transition-colors text-sm font-medium">Community Guidelines</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-app-border transition-colors flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-app-text font-bold text-sm mb-1 transition-colors">© 2026 RideSync Platform</p>
            <p className="text-app-muted text-xs transition-colors">Made for Distributed Systems Engineering</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-app-muted font-medium mr-2">Built with</span>
            {TECH_BADGES.map((badge, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-app-surface border border-app-border text-app-muted text-[10px] uppercase tracking-wider font-bold transition-colors">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

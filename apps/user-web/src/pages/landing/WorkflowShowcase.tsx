import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Car, Search, Ticket, CreditCard, 
  MapPin, AlertTriangle, RefreshCcw, CarFront, CheckCircle, Target, ArrowRight
} from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    title: "Driver Publishes Ride",
    desc: "Driver enters source, destination, schedule, and seat availability.",
    icon: <Car className="w-5 h-5" />,
  },
  {
    title: "Passenger Searches Ride",
    desc: "Passenger provides their desired route requirements.",
    icon: <Search className="w-5 h-5" />,
  },
  {
    title: "Matching Service",
    subtitle: "(Redis GEOSEARCH)",
    desc: "Scans for the nearest active drivers using intelligent route matching.",
    icon: <Target className="w-5 h-5" />,
  },
  {
    title: "Booking Service",
    subtitle: "(Saga + Seat Lock)",
    desc: "Instantly reserves the matching seats using distributed locking.",
    icon: <Ticket className="w-5 h-5" />,
  },
  {
    title: "Payment Service",
    desc: "Secure payment processing handled via Saga orchestration.",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    title: "Live Tracking",
    subtitle: "(WebSockets + Mapbox)",
    desc: "Real-time GPS updates stream to the passenger's interactive map.",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    title: "Journey Starts",
    desc: "Driver picks up passenger and the trip begins.",
    icon: <Car className="w-5 h-5" />,
  },
  {
    title: "Vehicle Breakdown?",
    desc: "An unexpected failure occurs mid-journey. An emergency event is triggered.",
    icon: <AlertTriangle className="w-5 h-5" />,
    isAlert: true
  },
  {
    title: "AutoShift",
    subtitle: "(Redis GEOSEARCH)",
    desc: "Automatically activated. Instantly scans for the nearest available RideSync driver to rescue passengers.",
    icon: <RefreshCcw className="w-5 h-5" />,
    isAlert: true
  },
  {
    title: "Nearby Driver Assigned",
    desc: "Passengers are transferred seamlessly without creating a new booking.",
    icon: <CarFront className="w-5 h-5" />,
  },
  {
    title: "Journey Completed",
    desc: "Destination reached successfully. Ratings unlocked.",
    icon: <CheckCircle className="w-5 h-5" />,
    isSuccess: true
  }
];

export default function WorkflowShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="py-32 bg-app-bg relative z-10 overflow-hidden font-sans border-t border-app-border transition-colors">

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-xs font-semibold text-blue-500 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Interactive Workflow
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-app-text mb-4 transition-colors"
          >
            How RideSync Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-app-muted leading-relaxed max-w-2xl mx-auto transition-colors"
          >
            A step-by-step journey of a distributed carpooling experience, from publishing a ride to our automatic AutoShift recovery.
          </motion.p>
        </div>

        <div ref={containerRef} className="relative">
          {/* Static vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-app-border -translate-x-1/2 transition-colors" />

          {/* Animated progress line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-8 md:left-1/2 top-0 w-px bg-blue-500 -translate-x-1/2 origin-top"
          />

          {/* Scroll car indicator */}
          <motion.div
            style={{ top: lineHeight }}
            className="absolute left-8 md:left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-app-bg border-2 border-blue-500 rounded-full flex items-center justify-center z-20 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-colors"
          >
            <Car className="w-5 h-5" />
          </motion.div>

          <div className="space-y-12">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Center dot on line */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-app-bg border-2 border-blue-500 z-10 transition-colors" />

                  {/* Spacer */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Card */}
                  <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pr-14' : 'md:pl-14'}`}>
                    <div className={`
                      relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                      ${step.isAlert
                        ? 'bg-red-500/10 border-red-500/20 hover:border-red-500/50 hover:shadow-[0_8px_30px_rgba(239,68,68,0.1)]'
                        : step.isSuccess
                          ? 'bg-green-500/10 border-green-500/20 hover:border-green-500/50 hover:shadow-[0_8px_30px_rgba(34,197,94,0.1)]'
                          : 'bg-app-surface border-app-border hover:border-blue-500/30 hover:shadow-[0_8px_30px_rgba(59,130,246,0.06)]'}
                    `}>
                      {/* Step number */}
                      <div className={`
                        absolute -top-3 ${isEven ? 'md:-right-3 md:left-auto left-4' : 'left-4'} 
                        w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm
                        ${step.isAlert ? 'bg-red-500' : step.isSuccess ? 'bg-green-500' : 'bg-blue-600'}
                      `}>
                        {idx + 1}
                      </div>

                      <div className={`flex items-start gap-4 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                        {/* Icon */}
                        <div className={`
                          shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                          ${step.isAlert ? 'bg-red-500/10 text-red-500 border border-red-500/20' : step.isSuccess ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}
                        `}>
                          {step.icon}
                        </div>

                        <div className={`flex-1 min-w-0 ${isEven ? 'md:text-right text-left' : 'text-left'}`}>
                          {step.subtitle && (
                            <span className={`text-xs font-bold uppercase tracking-widest mb-2 block ${step.isAlert ? 'text-red-500' : 'text-blue-500'}`}>
                              {step.subtitle}
                            </span>
                          )}
                          <h3 className="text-xl font-bold text-app-text mb-2 leading-tight transition-colors">
                            {step.title}
                          </h3>
                          <p className="text-app-muted text-base leading-relaxed transition-colors">
                            {step.desc}
                          </p>
                        </div>
                      </div>

                      {/* Arrow to line */}
                      <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 ${isEven ? '-right-9' : '-left-9'} text-app-muted transition-colors`}>
                        <ArrowRight className={`w-5 h-5 ${isEven ? '' : 'rotate-180'}`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

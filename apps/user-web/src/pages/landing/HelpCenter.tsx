import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, Wrench, Phone, Handshake, Scale, Lock } from 'lucide-react';

type FAQType = {
  question: string;
  answer: React.ReactNode;
};

const FAQS: FAQType[] = [
  {
    question: "What is RideSync?",
    answer: "RideSync is a production-grade distributed carpooling platform that connects drivers and passengers travelling on similar routes. It offers real-time ride tracking, intelligent ride matching and our exclusive AutoShift™ recovery system for uninterrupted journeys."
  },
  {
    question: "How do I book a ride?",
    answer: "Simply search your departure and destination, choose a suitable ride, review available seats, confirm your booking and complete the payment. Your ride is instantly reserved and you'll receive live tracking once the journey starts."
  },
  {
    question: "How do I publish a ride?",
    answer: "Drivers can sign in with Google, register and verify their vehicle, then publish a ride by selecting the route, departure time, optional return trip, available seats and fare. Once published, passengers can discover and book the ride."
  },
  {
    question: "What is AutoShift™?",
    answer: "AutoShift™ is RideSync's exclusive journey recovery system. If a driver cannot continue because of a vehicle or personal emergency, the platform helps passengers continue their trip by transferring them to another compatible nearby ride without creating a new booking."
  },
  {
    question: "When is AutoShift™ triggered?",
    answer: (
      <>
        AutoShift™ is manually triggered by the affected driver from the Driver Portal whenever the current ride cannot continue.
        <br /><br />
        Supported situations include:
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Vehicle accident</li>
          <li>Engine failure</li>
          <li>Mechanical breakdown</li>
          <li>Flat tyre</li>
          <li>Battery failure</li>
          <li>Brake malfunction</li>
          <li>Overheating</li>
          <li>Fuel leakage</li>
          <li>Electrical failure</li>
          <li>Severe weather damage</li>
          <li>Driver illness</li>
          <li>Medical emergency</li>
          <li>Driver safety issue</li>
          <li>Driver unable to continue the trip</li>
          <li>Any verified emergency that interrupts the journey</li>
        </ul>
      </>
    )
  },
  {
    question: "Do I have to pay again after AutoShift™?",
    answer: "No. Your original booking remains valid. Passengers are transferred to another compatible ride without creating a new booking or paying any additional charges."
  },
  {
    question: "Is live tracking really real-time?",
    answer: "Yes. RideSync streams live GPS updates using WebSockets, allowing passengers to monitor the driver's location continuously throughout the journey."
  },
  {
    question: "Are my payments secure?",
    answer: "Yes. RideSync protects distributed transactions using the Saga Pattern. If any step fails during booking or payment, compensation events automatically restore system consistency and prevent partial transactions."
  },
  {
    question: "How does RideSync find another available ride?",
    answer: "RideSync uses Redis GEOSEARCH to discover nearby compatible rides, while the Matching Service validates the route, destination, seat availability and journey compatibility before suggesting a replacement ride."
  },
  {
    question: "Can I cancel a booking?",
    answer: "Yes. Bookings can be cancelled before the journey begins according to the platform's cancellation policy. Any eligible refund is processed automatically through the payment workflow."
  },
  {
    question: "How do refunds work?",
    answer: "Refunds are handled automatically by the Payment Service. If a booking is cancelled or a distributed transaction fails, Saga compensation ensures eligible payments are safely refunded."
  },
  {
    question: "Is RideSync environmentally friendly?",
    answer: "Yes. RideSync encourages carpooling, helping reduce fuel consumption, lower carbon emissions, decrease traffic congestion and make daily travel more sustainable."
  },
  {
    question: "How are drivers verified?",
    answer: "Every driver signs in securely using Google authentication and completes vehicle registration before publishing rides. Vehicle information and driver details are securely maintained within the platform before ride publication."
  },
  {
    question: "Which technologies power RideSync?",
    answer: (
      <>
        RideSync is built on a production-grade microservices architecture using:
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>API Gateway</li>
          <li>Microservices</li>
          <li>Kafka</li>
          <li>RabbitMQ</li>
          <li>Cassandra Database</li>
          <li>Redis Cache</li>
          <li>Redis GEOSEARCH</li>
          <li>Redis Distributed Lock</li>
          <li>Saga Pattern</li>
          <li>WebSockets</li>
          <li>Mapbox</li>
          <li>Docker</li>
          <li>Kubernetes Ready Architecture</li>
          <li>Event-Driven Communication</li>
          <li>Real-Time Notifications</li>
        </ul>
      </>
    )
  },
  {
    question: "How can I contact support?",
    answer: (
      <>
        Our support team is available to help with booking issues, payments, AutoShift™, ride tracking and technical assistance.
        <br /><br />
        📧 support@ridesync.com<br />
        💬 Live Chat (24×7)<br />
        🚨 Emergency Assistance for active rides<br />
        🛠 Technical Support for application issues
      </>
    )
  }
];

const SUPPORT_CARDS = [
  {
    title: "Support",
    subtitle: "support@ridesync.com",
    icon: <Mail className="w-6 h-6 text-blue-500" />,
  },
  {
    title: "Technical Support",
    subtitle: "tech@ridesync.com",
    icon: <Wrench className="w-6 h-6 text-purple-500" />,
  },
  {
    title: "Emergency Assistance",
    subtitle: "emergency@ridesync.com",
    icon: <Phone className="w-6 h-6 text-red-500" />,
  },
  {
    title: "Business Enquiries",
    subtitle: "partnerships@ridesync.com",
    icon: <Handshake className="w-6 h-6 text-green-500" />,
  },
  {
    title: "Legal",
    subtitle: "legal@ridesync.com",
    icon: <Scale className="w-6 h-6 text-amber-500" />,
  },
  {
    title: "Privacy",
    subtitle: "privacy@ridesync.com",
    icon: <Lock className="w-6 h-6 text-teal-500" />,
  }
];

function AccordionItem({ faq, isOpen, onToggle }: { faq: FAQType, isOpen: boolean, onToggle: () => void }) {
  return (
    <motion.div 
      initial={false}
      className="bg-app-surface border border-app-border rounded-2xl overflow-hidden transition-colors"
    >
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-app-bg transition-colors outline-none focus:ring-2 focus:ring-blue-500 inset-0"
      >
        <span className="text-base md:text-lg font-bold text-app-text transition-colors">{faq.question}</span>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-8 h-8 rounded-full bg-app-bg border border-app-border flex items-center justify-center shrink-0 transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-app-muted transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-2">
              <div className="text-base text-app-muted leading-relaxed transition-colors border-t border-app-border pt-4">{faq.answer}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HelpCenter() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="help-center" className="py-32 bg-app-bg relative z-10 overflow-hidden font-sans border-t border-app-border transition-colors">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-xs font-semibold text-blue-500 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Support & FAQs
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-app-text mb-6 transition-colors"
          >
            Help Center
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-app-muted leading-relaxed transition-colors"
          >
            Everything you need to know about RideSync, AutoShift, and our real-time carpooling platform.
          </motion.p>
        </div>

        {/* FAQs */}
        <div className="space-y-4 mb-32">
          {FAQS.map((faq, idx) => (
            <AccordionItem 
              key={idx} 
              faq={faq} 
              isOpen={openIdx === idx} 
              onToggle={() => setOpenIdx(openIdx === idx ? null : idx)} 
            />
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-app-text mb-4 transition-colors">Need More Help?</h3>
          <p className="text-lg text-app-muted max-w-2xl mx-auto transition-colors">
            Our team is here to help you with rides, payments, AutoShift, bookings and technical issues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUPPORT_CARDS.map((card, idx) => (
            <motion.a
              key={idx}
              href={`mailto:${card.subtitle}`}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-app-surface border border-app-border p-6 rounded-2xl flex items-center gap-4 group hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all overflow-hidden"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-app-bg flex items-center justify-center shrink-0 border border-app-border transition-colors group-hover:scale-105 duration-300">
                {card.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base md:text-lg font-bold text-app-text mb-0.5 transition-colors group-hover:text-blue-500 truncate">{card.title}</h4>
                <p className="text-sm text-app-muted transition-colors truncate">{card.subtitle}</p>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}

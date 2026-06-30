import { Users, Car, AlertTriangle, Activity } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto mt-16 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-4xl font-extrabold text-text tracking-tight">Admin Control Center</h1>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-bold text-green-700">All Microservices Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm font-medium">Total Users</p>
            <h3 className="text-3xl font-bold text-text mt-1">12,405</h3>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm font-medium">Active Rides</p>
            <h3 className="text-3xl font-bold text-text mt-1">842</h3>
          </div>
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
            <Car className="w-6 h-6 text-secondary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm font-medium">AutoShifts Today</p>
            <h3 className="text-3xl font-bold text-text mt-1">14</h3>
          </div>
          <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm font-medium">Transactions</p>
            <h3 className="text-3xl font-bold text-text mt-1">$45K</h3>
          </div>
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-text">Recent Kafka Events Stream</h2>
          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">Live</span>
        </div>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-green-600 font-bold w-24">[20:41:03]</span>
            <span className="font-bold w-40">payment-success</span>
            <span className="text-gray-600">Booking b-789 confirmed</span>
          </div>
          <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-blue-600 font-bold w-24">[20:40:15]</span>
            <span className="font-bold w-40">ride-published</span>
            <span className="text-gray-600">Ride r-456 route SF -&gt; LA</span>
          </div>
          <div className="flex gap-4 p-4 bg-red-50 text-red-800 rounded-xl border border-red-100">
            <span className="text-red-500 font-bold w-24">[20:39:42]</span>
            <span className="font-bold w-40">driver-emergency</span>
            <span className="text-red-600">AutoShift triggered for Ride r-123</span>
          </div>
          <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-gray-500 font-bold w-24">[20:38:10]</span>
            <span className="font-bold w-40">user-registered</span>
            <span className="text-gray-600">New driver joined: Michael Chen</span>
          </div>
        </div>
      </div>
    </div>
  );
}

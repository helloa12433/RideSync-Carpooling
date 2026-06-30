import { Link } from 'react-router-dom';
import { Search, CreditCard, Clock, Calendar, ChevronRight, Car, User as UserIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export default function UserDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock Data
  const ongoingRide = {
    id: "BKG-9821A",
    status: "IN_PROGRESS",
    driverName: "Sarah Jenkins",
    car: "Tesla Model 3 - Black",
    rating: 4.9,
    pickup: "123 Tech Blvd, San Francisco",
    dropoff: "SFO Airport Terminal 2",
    eta: "14 mins away",
    price: "$24.50"
  };

  const rideHistory = [
    {
      id: "BKG-7712C",
      date: "Yesterday, 4:30 PM",
      driverName: "Michael Chen",
      pickup: "Downtown Station",
      dropoff: "123 Tech Blvd, San Francisco",
      status: "COMPLETED",
      price: "$18.00"
    },
    {
      id: "BKG-6509D",
      date: "Mon, Oct 12, 9:15 AM",
      driverName: "David Miller",
      pickup: "Home",
      dropoff: "Downtown Station",
      status: "COMPLETED",
      price: "$15.50"
    },
    {
      id: "BKG-4410E",
      date: "Fri, Oct 9, 8:00 PM",
      driverName: "Emma Davis",
      pickup: "SFO Airport",
      dropoff: "Home",
      status: "COMPLETED",
      price: "$32.00"
    }
  ];

  return (
    <div className="min-h-screen bg-app-bg pb-32 pt-8 transition-colors duration-300">
      {/* Top Welcome Section */}
      <div className="bg-app-surface border-b border-app-border py-16 px-8 transition-colors duration-300">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-app-text tracking-tight">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-app-muted mt-4 text-lg">Where would you like to go today?</p>
          </div>
          
          <Link 
            to="/search" 
            className="inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Search className="w-6 h-6" />
            Find a Ride
          </Link>
        </div>
      </div>

      <div className="p-8 max-w-screen-2xl mx-auto space-y-12 mt-8">
        
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/payments" className="p-6 bg-app-surface border border-app-border rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <CreditCard className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-app-text">Payment Methods</h2>
                <p className="text-app-muted text-base">Manage cards & billing</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-app-muted group-hover:text-app-text transition-colors" />
          </Link>

          <Link to="/profile" className="p-6 bg-app-surface border border-app-border rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <UserIcon className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-app-text">Profile Settings</h2>
                <p className="text-app-muted text-base">Update your personal info</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-app-muted group-hover:text-app-text transition-colors" />
          </Link>
        </div>

        {/* Ongoing Ride Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-app-text flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              Ongoing Ride
            </h2>
          </div>
          
          <div className="bg-app-surface border border-app-border rounded-2xl p-8 shadow-sm relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 rounded-bl-full -z-10" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <Car className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-app-text text-xl">{ongoingRide.driverName}</span>
                    <span className="px-2.5 py-1 rounded bg-app-surface-hover text-app-text text-sm font-semibold">★ {ongoingRide.rating}</span>
                  </div>
                  <p className="text-app-muted text-base">{ongoingRide.car}</p>
                </div>
              </div>

              <div className="flex-1 max-w-xl bg-app-bg rounded-xl p-5 border border-app-border relative transition-colors">
                <div className="absolute left-[31px] top-[32px] bottom-[32px] w-px bg-app-border border-dashed" />
                <div className="flex gap-5 items-start mb-5">
                  <div className="w-6 h-6 rounded-full border-4 border-blue-500 bg-app-surface shrink-0 mt-0.5 relative z-10" />
                  <div>
                    <p className="text-sm font-semibold text-app-muted uppercase tracking-wider mb-1">Pickup</p>
                    <p className="text-base font-medium text-app-text">{ongoingRide.pickup}</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-600 shrink-0 mt-0.5 relative z-10" />
                  <div>
                    <p className="text-sm font-semibold text-app-muted uppercase tracking-wider mb-1">Dropoff</p>
                    <p className="text-base font-medium text-app-text">{ongoingRide.dropoff}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-center gap-4">
                <div className="text-left md:text-right">
                  <p className="text-base text-app-muted font-medium">Arriving in</p>
                  <p className="text-3xl font-black text-blue-600">{ongoingRide.eta}</p>
                </div>
                <Link to={`/live/${ongoingRide.id}`} className="w-full md:w-auto text-center bg-app-text text-app-bg px-6 py-3 rounded-xl text-base font-medium hover:opacity-90 transition-opacity shadow-sm">
                  View Live Map
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Ride History Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-app-text flex items-center gap-3">
              <Clock className="w-6 h-6 text-app-muted" />
              Recent Rides
            </h2>
            <button className="text-base font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>

          <div className="bg-app-surface border border-app-border rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
            {rideHistory.map((ride, idx) => (
              <div key={ride.id} className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-app-surface-hover transition-colors ${idx !== rideHistory.length - 1 ? 'border-b border-app-border' : ''}`}>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-app-bg rounded-full flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-app-muted" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-app-text">{ride.date}</p>
                    <p className="text-base text-app-muted">{ride.driverName}</p>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-start md:justify-center gap-4 px-4">
                  <span className="text-base text-app-muted max-w-[150px] truncate">{ride.pickup}</span>
                  <div className="w-10 h-px bg-app-border" />
                  <span className="text-base font-medium text-app-text max-w-[150px] truncate">{ride.dropoff}</span>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
                  <div className="text-right">
                    <p className="text-lg font-bold text-app-text">{ride.price}</p>
                    <p className="text-sm font-semibold text-green-600 uppercase tracking-wider">{ride.status}</p>
                  </div>
                  <button className="text-app-muted hover:text-app-text p-2 rounded-full hover:bg-app-bg transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

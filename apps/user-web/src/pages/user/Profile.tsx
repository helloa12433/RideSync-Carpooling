import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { updateProfile, updateProfilePicture } from '../../features/auth/authSlice';
import { Camera, Save, User, Mail, Phone, Shield } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import CustomPhoneInput from '../../components/PhoneInput';

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phoneNumber || '',
    countryCode: user?.countryCode || '+1',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phone,
        country_code: formData.countryCode,
      })).unwrap();
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err || 'Failed to update profile');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      // We only update the profile picture in the local redux store since there's no backend endpoint for it yet
      dispatch(updateProfilePicture(imageUrl));
      toast.success('Profile photo updated');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-app-bg pt-20 pb-32 transition-colors duration-300">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-8">
        <h1 className="text-4xl font-bold text-app-text mb-10">Edit Profile</h1>

        <div className="bg-app-surface rounded-3xl shadow-sm border border-app-border overflow-hidden transition-colors duration-300">
          
          {/* Header / Avatar */}
          <div className="p-10 border-b border-app-border flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-blue-600">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition-colors"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload}
                accept="image/*" 
                className="hidden" 
              />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl font-bold text-app-text">{user.firstName} {user.lastName}</h2>
              <p className="text-app-muted mt-2 text-lg">{user.role === 'DRIVER' ? 'RideSync Driver' : 'RideSync Passenger'}</p>
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100/80 text-green-700 text-sm font-semibold border border-green-200">
                <Shield className="w-4 h-4" />
                Verified Account
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div>
                <label className="block text-base font-semibold text-app-text mb-3">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-app-muted">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 text-base bg-app-bg text-app-text rounded-xl border border-app-border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-app-text mb-3">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-app-muted">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 text-base bg-app-bg text-app-text rounded-xl border border-app-border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-app-text mb-3">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-app-muted">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3 text-base rounded-xl border border-app-border bg-app-surface text-app-muted outline-none cursor-not-allowed opacity-75"
                  />
                </div>
                <p className="mt-2 text-sm text-app-muted">Email cannot be changed.</p>
              </div>

              <div>
                <label className="block text-base font-semibold text-app-text mb-3">Phone Number</label>
                <CustomPhoneInput
                  value={`${formData.countryCode}${formData.phone}`}
                  onChange={(phone, meta) => {
                    const dialCode = `+${meta.country.dialCode}`;
                    const nationalNumber = phone.startsWith(dialCode) ? phone.slice(dialCode.length) : phone;
                    setFormData({
                      ...formData,
                      countryCode: dialCode,
                      phone: nationalNumber
                    });
                  }}
                />
              </div>

            </div>

            <div className="pt-8 border-t border-app-border flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-6 h-6" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

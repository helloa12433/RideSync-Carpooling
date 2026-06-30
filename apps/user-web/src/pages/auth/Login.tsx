import { useDispatch, useSelector } from 'react-redux';
import { loginWithGoogle } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = useSelector((state: RootState) => state.auth);

  const handleGoogleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      dispatch(loginWithGoogle(credentialResponse.credential)).then((res: any) => {
        if (res.meta.requestStatus === 'fulfilled') {
          const isNewUser = res.payload?.isNewUser;
          if (isNewUser) {
            toast.success('Registration Successful');
            toast.success('Welcome Email Sent');
            toast.success('Login Successful');
          } else {
            toast.success('Login Successful');
          }
          navigate('/dashboard');
        } else {
          toast.error('Login Failed: ' + (res.payload?.message || 'Unknown error'));
        }
      });
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Login Failed');
    console.error('Google Login Failed');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <div className="w-full max-w-md p-8 space-y-6 bg-background rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text">Welcome back</h1>
          <p className="mt-2 text-sm text-text-muted">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-center w-full min-h-[44px]">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            shape="rectangular"
            theme="outline"
            size="large"
            text="continue_with"
            width="100%"
          />
        </div>

        <p className="text-center text-xs text-text-muted">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

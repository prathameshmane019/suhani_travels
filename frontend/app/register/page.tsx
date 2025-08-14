'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Mail, Phone, Lock, User, Calendar, Users } from 'lucide-react';
import Image from 'next/image';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, phone, email, password, age, gender });
      toast.success(res.data.message);
      router.push('/login');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      <div className="h-full">
        <div className="grid lg:grid-cols-2 h-full">
          {/* Illustration Section - Hidden on mobile */}
          <div className="hidden lg:flex flex-col items-center justify-center p-8 h-full">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Main illustration container */}
              <div className="overflow-hidden  ">
                <Image 
                  src="/images/bus-stop.png" 
                  width={720}
                  height={720}
                  objectFit='contain'
                  // className='w-full h-auto rounded-3xl shadow-2xl'
                  alt="Mobile Boarding Pass UI"
                />
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex items-center justify-center  xl:w-[50vw] h-screen  ">
            <div className="w-full max-w-md lg:max-w-[50vw] xl:max-w-[50vw]  h-screen bg-white rounded-2xl shadow-xl p-6 lg:p-8 my-auto">
              {/* Header */}
              <div className="text-center  my-12">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-7 h-7 text-indigo-600" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-600">Fill in your details to get started</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Phone and Age Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Age"
                      className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      min="13"
                      max="120"
                    />
                  </div>
                </div>

                {/* Gender and Password Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Gender
                    </Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password (6+ chars)"
                      className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white font-medium rounded-lg transition-colors duration-200 mt-6" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Create Account
                    </div>
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <a 
                    href="/login" 
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                  >
                    Sign in here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
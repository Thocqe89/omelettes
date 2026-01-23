import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaChevronDown, FaChevronUp, FaTimes, FaUserFriends, FaEnvelopeOpen, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions before proceeding");
      return;
    }
    // Handle login logic here
    console.log("Login submitted:", formData);
  };

  // Properly typed animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const termsVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3
      }
    }
  };

  const popupVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Back to Home Button */}
      {/* <Link 
        to="/" 
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-gray-700 hover:text-[#0d7a68] border border-gray-200"
      >
        <FaArrowLeft />
        <span>Back to Home</span>
      </Link> */}

      {/* Left Side - Logo and Branding - Hidden on mobile */}
      <motion.div 
        className="hidden md:flex md:w-2/5 bg-white flex-col items-center justify-center p-8 relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Decorative elements */}
        <div className="absolute -left-24 -top-24 w-64 h-64 rounded-full bg-[#0d7a68]/10"></div>
        <div className="absolute -right-24 -bottom-24 w-64 h-64 rounded-full bg-[#0d7a68]/10"></div>
        
        <div className="w-full max-w-md z-10">
          <motion.div 
            className="mb-8 flex justify-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-[#0d7a68] to-[#0a5d4f] p-4 rounded-2xl shadow-lg">
              <img 
                src="https://res.cloudinary.com/deahgtn57/image/upload/v1751616678/omelett%27s/public/image/ChatGPT_Image_Jun_29_2025_02_29_59_PM_vmvihs.png" 
                alt="OMS Logo" 
                className="w-40 h-auto"
              />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-gray-800 text-center mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Welcome to OMS
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 text-center mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Sign in to access your exclusive account and manage your special customer benefits.
          </motion.p>
          
          {/* Exclusive Membership Info */}
          {/* <motion.div 
            className="mt-8 p-6 bg-gradient-to-r from-[#0d7a68]/10 to-[#0a5d4f]/10 rounded-xl border border-[#0d7a68]/20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="flex items-start gap-3">
              <div className="bg-[#0d7a68] p-2 rounded-lg">
                <FaUserFriends className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Exclusive Access Only</h3>
                <p className="text-sm text-gray-600">
                  OMS membership is by invitation only. To create an account, you need an invitation from an existing member.
                </p>
              </div>
            </div>
          </motion.div> */}
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div 
        className="w-full md:w-3/5 bg-gradient-to-br from-[#0d7a68] to-[#0a5d4f] flex items-center justify-center p-6 md:p-8 relative overflow-hidden min-h-screen"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      >
        {/* Mobile logo - only shown on mobile */}
        <motion.div 
          className="absolute top-6 left-0 w-full flex justify-center md:hidden z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-gradient-to-br from-[#0d7a68] to-[#0a5d4f] p-3 rounded-xl shadow-lg">
            <img 
              src="https://res.cloudinary.com/deahgtn57/image/upload/v1751616678/omelett%27s/public/image/ChatGPT_Image_Jun_29_2025_02_29_59_PM_vmvihs.png" 
              alt="OMS Logo" 
              className="w-16 h-auto"
            />
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute -left-32 -top-32 w-80 h-80 rounded-full bg-white/10"></div>
        <div className="absolute -right-32 -bottom-32 w-80 h-80 rounded-full bg-white/10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5"></div>
        
        <motion.div 
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 z-10 mt-16 md:mt-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-2xl font-bold text-gray-800 mb-6 text-center"
            variants={itemVariants}
          >
            Login to Your Account
          </motion.h2>

          {/* Terms and Conditions */}
          <motion.div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200" variants={itemVariants}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Exclusive Platform</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>This platform is exclusively for invited OMS members. Membership requires an invitation.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div className="mb-6" variants={itemVariants}>
              <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d7a68] focus:border-transparent transition-colors"
                  placeholder="Enter your invited email"
                  required
                />
              </div>
            </motion.div>

            <motion.div className="mb-6" variants={itemVariants}>
              <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d7a68] focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Terms and Conditions Toggle */}
            <motion.div className="mb-6" variants={itemVariants}>
              <button
                type="button"
                className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => setShowTerms(!showTerms)}
              >
                <span className="text-sm font-medium text-gray-700">Terms & Conditions</span>
                {showTerms ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
              </button>
              
              {showTerms && (
                <motion.div 
                  variants={termsVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-3 p-4 bg-gray-50 rounded-lg overflow-hidden"
                >
                  <div className="text-xs text-gray-600 max-h-40 overflow-y-auto">
                    <h4 className="font-bold mb-2">1. Exclusive Membership</h4>
                    <p className="mb-3">OMS membership is by invitation only. Access is restricted to invited members.</p>
                    
                    <h4 className="font-bold mb-2">2. Invitation Required</h4>
                    <p className="mb-3">To create an OMS account, you must receive a valid invitation from an existing member.</p>
                    
                    <h4 className="font-bold mb-2">3. Account Security</h4>
                    <p className="mb-3">You are responsible for maintaining the confidentiality of your account credentials.</p>
                    
                    <h4 className="font-bold mb-2">4. Exclusive Content</h4>
                    <p>All content within OMS is confidential and intended for members only.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div className="flex items-center mb-6" variants={itemVariants}>
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptedTerms}
                onChange={() => setAcceptedTerms(!acceptedTerms)}
                className="h-4 w-4 text-[#0d7a68] focus:ring-[#0d7a68] border-gray-300 rounded"
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                I confirm I have received an OMS invitation
              </label>
            </motion.div>

            <motion.button
              type="submit"
              disabled={!acceptedTerms}
              className={`w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d7a68] transition-all duration-300 shadow-md ${
                acceptedTerms 
                  ? "bg-gradient-to-r from-[#0d7a68] to-[#0a5d4f] text-white hover:opacity-90" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              variants={itemVariants}
              whileHover={acceptedTerms ? { scale: 1.02 } : {}}
              whileTap={acceptedTerms ? { scale: 0.98 } : {}}
            >
              Sign In
            </motion.button>
          </form>

          <motion.div className="mt-6 text-center" variants={itemVariants}>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button 
                onClick={() => setShowSignupPopup(true)}
                className="font-medium text-[#0d7a68] hover:text-[#0a5d4f] transition-colors underline"
              >
                Sign up
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Membership is exclusive and requires invitation
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Signup Popup/Modal */}
      {showSignupPopup && (
        <motion.div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowSignupPopup(false)}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="bg-gradient-to-r from-[#0d7a68] to-[#0a5d4f] p-6 text-white relative">
              <button
                onClick={() => setShowSignupPopup(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <FaUserFriends className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">OMS Membership</h3>
                  <p className="text-white/80 text-sm">Invitation Required</p>
                </div>
              </div>
            </div>

            {/* Popup Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#0d7a68]/20 to-[#0a5d4f]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaEnvelopeOpen className="text-3xl text-[#0d7a68]" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Exclusive Membership Access</h4>
                <p className="text-gray-600 mb-4">
                  OMS is an exclusive platform for special members only
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FaUserFriends className="text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">Invitation-Only</h5>
                    <p className="text-sm text-gray-600">
                      OMS membership is exclusively by invitation. You cannot create an account without an invitation from an existing member.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FaEnvelope className="text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">How to Get Invited</h5>
                    <p className="text-sm text-gray-600">
                      Contact an existing OMS member and request an invitation. They will send you an invitation email with registration instructions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FaLock className="text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">Secure & Private</h5>
                    <p className="text-sm text-gray-600">
                      OMS maintains strict privacy and security standards. All members are verified through our invitation system.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-yellow-800">Important Notice</h5>
                    <p className="text-sm text-yellow-700 mt-1">
                      If you haven't received an invitation, you cannot create an account. Please contact an OMS member for assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popup Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* <button
                  onClick={() => setShowSignupPopup(false)}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex-1"
                >
                  Close
                </button> */}
              <button
  onClick={() => {
    setShowSignupPopup(false);
    window.location.href = '/help'; // Redirects the whole page
  }}
  className="px-4 py-3 bg-gradient-to-r from-[#0d7a68] to-[#0a5d4f] text-white rounded-lg hover:opacity-90 transition-opacity flex-1 flex items-center justify-center gap-2"
>
  <FaEnvelopeOpen />
  Request Invitation Help
</button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                OMS - Exclusive Membership Platform
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Mobile Back Button */}
      {/* <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <Link 
          to="/" 
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-gray-700 hover:text-[#0d7a68] border border-gray-200"
        >
          <FaArrowLeft />
          <span>Back to Home</span>
        </Link>
      </div> */}
    </div>
  );
}
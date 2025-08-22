
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import DefaultLayout from "@/layouts/default";
import { 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaShieldAlt, 
  FaChartLine,
  FaMobileAlt,
  FaGlobe,
  FaPiggyBank,
  FaUniversity
} from "react-icons/fa";

export default function Testpage() {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Banking services data
  const bankingServices = [
    {
      icon: <FaCreditCard className="text-blue-600 text-2xl" />,
      title: "Credit Cards",
      description: "Premium credit cards with exclusive benefits and rewards",
      features: ["Cashback", "Travel Rewards", "No Annual Fee"]
    },
    {
      icon: <FaMoneyBillWave className="text-green-600 text-2xl" />,
      title: "Loans & Financing",
      description: "Flexible loan options for your needs",
      features: ["Home Loans", "Auto Loans", "Personal Loans"]
    },
    {
      icon: <FaShieldAlt className="text-red-600 text-2xl" />,
      title: "Insurance",
      description: "Comprehensive protection for your assets",
      features: ["Life Insurance", "Health Insurance", "Property Insurance"]
    },
    {
      icon: <FaChartLine className="text-purple-600 text-2xl" />,
      title: "Investments",
      description: "Grow your wealth with smart investments",
      features: ["Stocks", "Mutual Funds", "Retirement Plans"]
    },
    {
      icon: <FaMobileAlt className="text-orange-600 text-2xl" />,
      title: "Mobile Banking",
      description: "Bank anytime, anywhere with our app",
      features: ["24/7 Access", "Mobile Deposits", "Bill Pay"]
    },
    {
      icon: <FaGlobe className="text-cyan-600 text-2xl" />,
      title: "International Banking",
      description: "Global banking solutions",
      features: ["Wire Transfers", "Multi-Currency", "Global Accounts"]
    }
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "₭2.5B+", label: "Assets Managed" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Customer Support" }
  ];

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Modern Banking for{" "}
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Modern Life
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Secure, innovative financial solutions designed for today's world. 
            Experience banking that works as hard as you do.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors text-lg">
              Open Account
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg">
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Banking Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need for your financial journey, all in one place
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {bankingServices.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-600"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className="mt-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm">
                  Learn More →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Your Security is Our Priority
              </h2>
              <p className="text-xl text-blue-200 mb-8">
                We use military-grade encryption and advanced security measures to protect your financial data 24/7.
              </p>
              
              <div className="space-y-4">
                {[
                  "256-bit SSL Encryption",
                  "Multi-Factor Authentication",
                  "Real-Time Fraud Monitoring",
                  "FDIC Insurance"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <FaShieldAlt className="text-6xl text-green-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-center mb-4">Bank-Level Security</h3>
                <p className="text-blue-200 text-center">
                  Your funds and personal information are protected with the highest security standards in the industry.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of satisfied customers who trust us with their financial needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors text-lg">
                Open Your Account
              </button>
              <button className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-colors text-lg">
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </DefaultLayout>
  );
}
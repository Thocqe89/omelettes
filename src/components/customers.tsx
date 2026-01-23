import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Image,
  Card, 
  CardBody,
  Button,
  Chip,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
  Divider,
  Badge,

} from "@heroui/react";
import { 
  FaPlane, 
  FaShoppingCart, 
  FaGlobeAsia, 
  FaCode, 
  FaUsers, 
  FaWhatsapp,
  FaCheck,
  FaPaperPlane,
  FaGem,
  FaShieldAlt,
  FaHeadset,
  FaRocket,
  FaCrown,
  FaLightbulb,
  FaSync,
  FaTimes,
  FaStar,
  FaBolt,
  FaMagic,
  FaGlobe,
  FaLeaf
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DefaultLayout from "@/layouts/default";
import { Helmet } from "react-helmet-async";

export default function OMS_Help_Request() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customRequest, setCustomRequest] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();


  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Premium services with responsive adjustments
  const premiumServices = [
    {
      category: "AVIATION & LUXURY",
      icon: <FaCrown className="text-amber-500" />,
      services: [
        { 
          id: "airplane-model", 
          name: "Aircraft Models", 
          description: "Premium scale replicas & collectibles",
          icon: <FaPlane className="text-sky-500" />,
          gradient: "from-sky-500 to-blue-600",
          badge: "Most Popular",
          glow: true
        },
        { 
          id: "airplane-booking", 
          name: "Flight Services", 
          description: "Private jet & charter flights",
          icon: <FaRocket className="text-purple-500" />,
          gradient: "from-purple-500 to-indigo-600",
          badge: "Exclusive",
          glow: true
        }
      ]
    },
    {
      category: "GLOBAL PROCUREMENT",
      icon: <FaGlobe className="text-emerald-500" />,
      services: [
        { 
          id: "china-order", 
          name: "China Imports", 
          description: "Premium sourcing from China",
          icon: <FaShoppingCart className="text-rose-500" />,
          gradient: "from-rose-500 to-red-600",
          badge: "Fast Shipping",
          glow: false
        },
        { 
          id: "thailand-order", 
          name: "Thailand Imports", 
          description: "Quality products from Thailand",
          icon: <FaGlobeAsia className="text-amber-500" />,
          gradient: "from-amber-500 to-orange-600",
          badge: "Premium Quality",
          glow: false
        }
      ]
    },
    {
      category: "DIGITAL & SERVICES",
      icon: <FaLightbulb className="text-cyan-500" />,
      services: [
        { 
          id: "web-dev", 
          name: "Web Development", 
          description: "Custom apps & digital solutions",
          icon: <FaCode className="text-emerald-500" />,
          gradient: "from-emerald-500 to-green-600",
          badge: "Modern Tech",
          glow: false
        },
        { 
          id: "partner-order", 
          name: "Partner Solutions", 
          description: "Collaborative business services",
          icon: <FaUsers className="text-violet-500" />,
          gradient: "from-violet-500 to-purple-600",
          badge: "VIP Network",
          glow: true
        },
        { 
          id: "oms-membership", 
          name: "OMS Membership", 
          description: "Elite membership access",
          icon: <FaGem className="text-amber-500" />,
          gradient: "from-amber-500 to-yellow-600",
          badge: "Exclusive",
          glow: true
        }
      ]
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
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

  const cardHoverVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      }
    },
    tap: { scale: 0.98 }
  };

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    } else {
      setSelectedServices(prev => [...prev, serviceId]);
    }
  };

  // Send to WhatsApp
  const sendToWhatsApp = () => {
    if (selectedServices.length === 0 && !customRequest.trim()) {
      return;
    }

    setIsSending(true);
    
    const selectedNames = selectedServices.flatMap(id => 
      premiumServices
        .flatMap(cat => cat.services)
        .filter(service => service.id === id)
        .map(service => service.name)
    );

    const message = `🚀 *OMS PREMIUM HELP REQUEST*\n\n` +
      `🌟 Selected Services:\n` +
      selectedNames.map(name => `• ${name}`).join('\n') +
      (customRequest.trim() ? `\n\n📝 Custom Request:\n${customRequest}` : '') +
      `\n\n⏰ Priority: High\n` +
      `🆔 Request ID: OMS-${Date.now().toString().slice(-6)}\n\n` +
      `Please provide premium assistance.`;

    const phoneNumber = "2055058028";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsSending(false);
      onOpen();
    }, 800);
  };

  // Reset form
  const resetForm = () => {
    setSelectedServices([]);
    setCustomRequest("");
  };

  // Get all services
  const allServices = premiumServices.flatMap(cat => cat.services);

  return (
    <DefaultLayout>
      <Helmet>
        <title>Premium Help Request | OMS</title>
        <meta name="description" content="Request premium assistance for aviation models, global imports, web development, and exclusive services" />
      </Helmet>

      {/* Main Content */}
      <div className="relative min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center overflow-hidden pt-16 sm:pt-20">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
            <Image
              isBlurred
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920"
              alt="Background"
              className="w-full h-full object-cover opacity-20"
            />
          </div>

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Badge
                variant="flat"
                className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 text-white mb-4 sm:mb-6 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
              >
                <FaRocket className="mr-1 sm:mr-2" />
                PREMIUM SUPPORT
              </Badge>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent block">
                  Need Premium
                </span>
                <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent block mt-2">
                  Assistance?
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2">
                Select premium services or describe your custom request. 
                Our elite team provides rapid, white-glove support.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                  <FaBolt className="text-yellow-400 text-sm sm:text-base" />
                  <span className="text-gray-300 text-xs sm:text-sm">Instant Response</span>
                </div>
                <div className="w-1 h-1 sm:w-2 sm:h-2 bg-gray-600 rounded-full hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-emerald-400 text-sm sm:text-base" />
                  <span className="text-gray-300 text-xs sm:text-sm">Secure & Private</span>
                </div>
                <div className="w-1 h-1 sm:w-2 sm:h-2 bg-gray-600 rounded-full hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <FaCrown className="text-amber-400 text-sm sm:text-base" />
                  <span className="text-gray-300 text-xs sm:text-sm">Premium Service</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Form Section */}
        <section className="relative py-10 sm:py-16 md:py-20">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {/* Left Column - Services */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {premiumServices.map((category, catIndex) => (
                  <motion.div
                    key={catIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: catIndex * 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 shadow-xl sm:shadow-2xl">
                      <CardBody className="p-4 sm:p-6 md:p-8">
                        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                          <div className="p-2 sm:p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg sm:rounded-xl border border-gray-700">
                            {category.icon}
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                              {category.category}
                            </h3>
                            <p className="text-gray-400 text-xs sm:text-sm">Select premium services</p>
                          </div>
                        </div>

                        <div className={`grid gap-3 sm:gap-4 ${
                          isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        }`}>
                          {category.services.map((service) => {
                            const isSelected = selectedServices.includes(service.id);
                            
                            return (
                              <Tooltip 
                                key={service.id} 
                                content={service.description}
                                placement="top"
                                delay={100}
                                isDisabled={isMobile}
                              >
                                <motion.div
                                  variants={cardHoverVariants}
                                  initial="initial"
                                  whileHover={isMobile ? {} : "hover"}
                                  whileTap="tap"
                                >
                                  <Card
                                    isPressable
                                    onPress={() => toggleService(service.id)}
                                    className={`relative overflow-hidden border-2 transition-all duration-300 ${
                                      isSelected
                                        ? `border-transparent bg-gradient-to-br ${service.gradient}`
                                        : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                                    } ${service.glow && isSelected ? 'shadow-lg shadow-blue-500/25' : ''}`}
                                  >
                                    {isSelected && service.glow && (
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                                    )}
                                    
                                    <CardBody className="p-3 sm:p-4 md:p-6">
                                      <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl mb-2 sm:mb-3 md:mb-4 ${
                                          isSelected 
                                            ? 'bg-white/20 backdrop-blur-sm' 
                                            : 'bg-gray-800/50'
                                        }`}>
                                          <div className={`text-xl sm:text-2xl ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                            {service.icon}
                                          </div>
                                        </div>
                                        
                                        <h4 className={`font-bold mb-1 sm:mb-2 text-sm sm:text-base ${
                                          isSelected ? 'text-white' : 'text-white'
                                        }`}>
                                          {service.name}
                                        </h4>
                                        
                                        <p className={`text-xs sm:text-sm mb-2 sm:mb-3 ${
                                          isSelected ? 'text-white/80' : 'text-gray-400'
                                        }`}>
                                          {service.description}
                                        </p>
                                        
                                        <Chip
                                          size="sm"
                                          variant="flat"
                                          className={`text-xs ${
                                            isSelected 
                                              ? 'bg-white/30 text-white' 
                                              : 'bg-gray-800 text-gray-300'
                                          }`}
                                        >
                                          {service.badge}
                                        </Chip>
                                        
                                        {isSelected && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2"
                                          >
                                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-1 sm:p-1.5">
                                              <FaCheck className="text-white text-xs" />
                                            </div>
                                          </motion.div>
                                        )}
                                      </div>
                                    </CardBody>
                                  </Card>
                                </motion.div>
                              </Tooltip>
                            );
                          })}
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}

                {/* Custom Request */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 shadow-xl sm:shadow-2xl">
                    <CardBody className="p-4 sm:p-6 md:p-8">
                      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                        <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg sm:rounded-xl border border-purple-800">
                          <FaMagic className="text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                            Custom Request
                          </h3>
                          <p className="text-gray-400 text-xs sm:text-sm">Describe your premium needs</p>
                        </div>
                      </div>

                      <div className="relative">
                        <Textarea
                          value={customRequest}
                          onChange={(e) => setCustomRequest(e.target.value)}
                          placeholder={`${isMobile ? '✨ Describe your request...' : '✨ Describe your premium request in detail...\\n\\n• Specific requirements\\n• Timeline expectations\\n• Budget considerations\\n• Special preferences'}`}
                          className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 text-sm sm:text-base"
                          minRows={isMobile ? 4 : 6}
                          maxRows={10}
                          size={isMobile ? "md" : "lg"}
                        />
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 gap-2">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                            <FaLightbulb className="text-amber-500 text-sm" />
                            <span>Be specific for premium service</span>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {customRequest.length}/1000
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6 sm:space-y-8"
              >
                {/* Selection Summary */}
                <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-xl sm:shadow-2xl">
                  <CardBody className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6 md:mb-8">
                      <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg sm:rounded-xl">
                        <FaCheck className="text-white text-base sm:text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                          Your Selection
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm">Premium request summary</p>
                      </div>
                    </div>

                    {selectedServices.length === 0 && !customRequest.trim() ? (
                      <div className="text-center py-8 sm:py-12">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border border-gray-700">
                          <FaHeadset className="text-gray-500 text-xl sm:text-2xl" />
                        </div>
                        <p className="text-gray-400 mb-2 text-sm sm:text-base">No services selected</p>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Select premium services or write a custom request
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 sm:space-y-6">
                        {/* Selected Services */}
                        <AnimatePresence>
                          {selectedServices.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <h4 className="text-gray-300 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Selected Services:</h4>
                              <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto pr-2">
                                {selectedServices.map((id) => {
                                  const service = allServices.find(s => s.id === id);
                                  return service ? (
                                    <motion.div
                                      key={id}
                                      layout
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -20 }}
                                      className="flex items-center justify-between bg-gray-800/50 p-2 sm:p-3 rounded-lg border border-gray-700"
                                    >
                                      <div className="flex items-center gap-2 sm:gap-3">
                                        <div className={`p-1 sm:p-2 rounded-lg bg-gradient-to-br ${service.gradient}`}>
                                          {service.icon}
                                        </div>
                                        <span className="text-white text-xs sm:text-sm">{service.name}</span>
                                      </div>
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        className="text-gray-400 hover:text-red-400 min-w-6 h-6"
                                        onPress={() => toggleService(id)}
                                      >
                                        <FaTimes className="text-xs" />
                                      </Button>
                                    </motion.div>
                                  ) : null;
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Custom Request Preview */}
                        {customRequest.trim() && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <h4 className="text-gray-300 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Custom Request:</h4>
                            <div className="bg-gray-800/30 p-3 sm:p-4 rounded-lg border border-gray-700">
                              <p className="text-gray-300 text-xs sm:text-sm line-clamp-3 sm:line-clamp-4">
                                {customRequest}
                              </p>
                            </div>
                          </motion.div>
                        )}

                        <Divider className="bg-gray-800" />

                        {/* Actions */}
                        <div className="space-y-3 sm:space-y-4">
                          <Button
                            fullWidth
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 text-sm sm:text-base"
                            size={isMobile ? "md" : "lg"}
                            onPress={sendToWhatsApp}
                            isLoading={isSending}
                            isDisabled={selectedServices.length === 0 && !customRequest.trim()}
                          >
                            {!isSending && <FaWhatsapp className="mr-2 text-base sm:text-xl" />}
                            {isSending ? "Sending..." : "Send Request"}
                          </Button>

                          <Button
                            fullWidth
                            variant="flat"
                            className="bg-gray-800/50 text-gray-300 border border-gray-700 text-sm sm:text-base"
                            size={isMobile ? "md" : "lg"}
                            onPress={resetForm}
                          >
                            <FaSync className="mr-2" />
                            Reset Selection
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>

                {/* Premium Features */}
                <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-blue-800/30 shadow-xl">
                  <CardBody className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <FaCrown className="text-amber-400 text-base sm:text-xl" />
                      <h4 className="text-base sm:text-lg font-bold text-white">Premium Benefits</h4>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg">
                          <FaBolt className="text-blue-400 text-sm sm:text-base" />
                        </div>
                        <div>
                          <p className="text-white text-xs sm:text-sm font-medium">Instant Priority</p>
                          <p className="text-gray-400 text-xs">Jump to front of the queue</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg">
                          <FaShieldAlt className="text-purple-400 text-sm sm:text-base" />
                        </div>
                        <div>
                          <p className="text-white text-xs sm:text-sm font-medium">Secure Handling</p>
                          <p className="text-gray-400 text-xs">End-to-end encrypted</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 sm:p-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg">
                          <FaStar className="text-emerald-400 text-sm sm:text-base" />
                        </div>
                        <div>
                          <p className="text-white text-xs sm:text-sm font-medium">VIP Support</p>
                          <p className="text-gray-400 text-xs">Dedicated premium team</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Quick Contact */}
                <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-xl">
                  <CardBody className="p-4 sm:p-6">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <FaWhatsapp className="text-white text-lg sm:text-2xl" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">Urgent Help?</h4>
                      <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                        Need immediate premium assistance?
                      </p>
                      <Button
                        fullWidth
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm sm:text-base"
                        size={isMobile ? "md" : "lg"}
                        onPress={() => window.open('https://wa.me/2055058028', '_blank')}
                      >
                        <FaBolt className="mr-2" />
                        Emergency WhatsApp
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-10 sm:py-16 md:py-20">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
            >
              {[
                { number: "99%", label: "Satisfaction", icon: <FaStar className="text-yellow-400" />, color: "from-yellow-500/20 to-amber-500/20" },
                { number: "24/7", label: "Premium Support", icon: <FaHeadset className="text-blue-400" />, color: "from-blue-500/20 to-cyan-500/20" },
                { number: "2H", label: "Avg. Response", icon: <FaBolt className="text-emerald-400" />, color: "from-emerald-500/20 to-green-500/20" }
              ].map((stat, index) => (
                <Card
                  key={index}
                  className={`bg-gradient-to-br ${stat.color} backdrop-blur-xl border border-white/10 shadow-lg sm:shadow-xl`}
                >
                  <CardBody className="p-4 sm:p-6 md:p-8 text-center">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <div className="p-2 sm:p-3 md:p-4 bg-white/10 rounded-lg sm:rounded-xl">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2">{stat.number}</div>
                    <div className="text-gray-300 text-sm sm:text-base">{stat.label}</div>
                  </CardBody>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 sm:py-16 md:py-20">
          <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-center"
            >
              <Badge
                variant="flat"
                className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 text-white mb-4 sm:mb-6 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
              >
                <FaGem className="mr-1 sm:mr-2" />
                ELITE SERVICE
              </Badge>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Ready for Premium Assistance?
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
                Our elite team is ready to provide white-glove service for your premium requests.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  size={isMobile ? "md" : "lg"}
                  className="px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-7 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all text-sm sm:text-base"
                  onPress={sendToWhatsApp}
                >
                  <FaPaperPlane className="mr-2 sm:mr-3" />
                  Send Premium Request
                </Button>
                
                <Button
                  size={isMobile ? "md" : "lg"}
                  variant="flat"
                  className="px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-7 bg-gray-900/50 text-white border border-gray-700 backdrop-blur-sm text-sm sm:text-base"
                  onPress={() => navigate('/OMS_Special_Customers')}
                >
                  <FaCrown className="mr-2 sm:mr-3" />
                  Join Elite Membership
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Success Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        backdrop="blur"
        size={isMobile ? "md" : "lg"}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg sm:rounded-xl">
                <FaCheck className="text-white text-lg sm:text-2xl" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Premium Request Sent!
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">Your elite service request is ready</p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="p-4 sm:p-6">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-full flex items-center justify-center border border-green-500/30">
                <FaPaperPlane className="text-green-400 text-2xl sm:text-3xl md:text-4xl" />
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">WhatsApp is Ready</h3>
              <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
                Your premium request has been prepared and WhatsApp is now open. 
                Review the message and send it to our elite support team.
              </p>
              
              <div className="bg-gray-900/50 p-3 sm:p-4 rounded-lg border border-gray-700 mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-xs sm:text-sm">Request Status</span>
                  <Badge color="success" variant="flat" size="sm">Priority</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Response Time</span>
                  <span className="text-emerald-400 font-medium text-sm sm:text-base">~2 Hours</span>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="p-4 sm:p-6">
            <Button
              fullWidth
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm sm:text-base"
              size={isMobile ? "md" : "lg"}
              onPress={onClose}
            >
              Got It, Thanks!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        /* Better scrollbar for selected services */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        
        /* Better text rendering */
        h1, h2, h3, h4, .font-bold {
          font-feature-settings: "kern" 1;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </DefaultLayout>
  );
}
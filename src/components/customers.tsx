import { useState, useEffect } from "react";
import {
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
  Divider,
  Select,
  SelectItem,
  Input,
  Checkbox,
  Badge,
} from "@heroui/react";
import {
  FaWhatsapp,
  FaCheck,
  FaSync,
  FaTimes,
  FaHeadset,
  FaShieldAlt,
  FaBoxOpen,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaQuestionCircle,
  FaTruck,
  FaUndo,
  FaShoppingBag,
  FaTag,
  FaUser,
  FaCreditCard,
  FaStar,
  FaClock,
  FaUsers,
  FaPaperPlane,
  FaExclamationTriangle,
  FaClipboardList,
  FaStore,
  FaCogs,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DefaultLayout from "@/layouts/default";
import { Helmet } from "react-helmet-async";

export default function HelpRequestPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customRequest, setCustomRequest] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [orderNumber, setOrderNumber] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Services data
  const serviceCategories = [
    {
      id: "returns",
      name: "Returns & Refunds",
      icon: <FaUndo />,
      color: "red",
      services: [
        { id: "return-product", name: "Return Product", icon: <FaBoxOpen />, badge: "Popular" },
        { id: "exchange-item", name: "Exchange Item", icon: <FaExchangeAlt />, badge: "Quick" },
        { id: "refund-request", name: "Refund Request", icon: <FaMoneyBillWave />, badge: "Priority" },
        { id: "damaged-item", name: "Damaged Item", icon: <FaExclamationTriangle />, badge: "Urgent" },
      ],
    },
    {
      id: "orders",
      name: "Order Support",
      icon: <FaShoppingBag />,
      color: "blue",
      services: [
        { id: "track-order", name: "Track Order", icon: <FaTruck />, badge: "Live" },
        { id: "modify-order", name: "Modify Order", icon: <FaClipboardList />, badge: "Quick" },
        { id: "cancel-order", name: "Cancel Order", icon: <FaTimes />, badge: "Urgent" },
        { id: "bulk-order", name: "Bulk Order", icon: <FaStore />, badge: "Business" },
      ],
    },
    {
      id: "products",
      name: "Product Support",
      icon: <FaTag />,
      color: "green",
      services: [
        { id: "product-info", name: "Product Info", icon: <FaQuestionCircle />, badge: "Info" },
        { id: "price-inquiry", name: "Price Inquiry", icon: <FaMoneyBillWave />, badge: "Quote" },
        { id: "stock-check", name: "Stock Check", icon: <FaStore />, badge: "Live" },
        { id: "custom-product", name: "Custom Product", icon: <FaCogs />, badge: "Custom" },
      ],
    },
    {
      id: "account",
      name: "Account & Billing",
      icon: <FaUser />,
      color: "purple",
      services: [
        { id: "payment-issue", name: "Payment Issue", icon: <FaCreditCard />, badge: "Urgent" },
        { id: "invoice-request", name: "Invoice", icon: <FaMoneyBillWave />, badge: "Document" },
        { id: "account-access", name: "Account Access", icon: <FaUser />, badge: "Security" },
        { id: "membership", name: "Membership", icon: <FaStar />, badge: "VIP" },
      ],
    },
  ];

  // Return reasons
  const returnReasons = [
    { id: "wrong-item", label: "Wrong item received" },
    { id: "damaged", label: "Item arrived damaged" },
    { id: "not-as-described", label: "Not as described" },
    { id: "changed-mind", label: "Changed my mind" },
    { id: "quality-issue", label: "Quality issue" },
    { id: "other", label: "Other reason" },
  ];

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Get all services
  const allServices = serviceCategories.flatMap(cat => cat.services);

  // Get selected service names
  const getSelectedServiceNames = () => {
    return selectedServices.map(id => 
      allServices.find(s => s.id === id)?.name || ""
    ).filter(name => name);
  };

  // Send to WhatsApp
  const sendToWhatsApp = () => {
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    if (selectedServices.length === 0 && !customRequest.trim() && !additionalDetails.trim()) {
      alert("Please select a service or describe your request");
      return;
    }

    setIsSending(true);
    
    const selectedNames = getSelectedServiceNames();
    const category = serviceCategories.find(cat => cat.id === selectedCategory)?.name || "General";

    // Build WhatsApp message
    let message = `📱 *HELP REQUEST - ${category.toUpperCase()}*\n\n`;

    // Order info
    if (orderNumber) {
      message += `*Order Information:*\n`;
      message += `• Order #: ${orderNumber}\n`;
      if (returnReason && selectedCategory === "returns") {
        const reason = returnReasons.find(r => r.id === returnReason)?.label || returnReason;
        message += `• Reason: ${reason}\n`;
      }
      message += `\n`;
    }

    // Selected services
    if (selectedNames.length > 0) {
      message += `*Services Needed:*\n`;
      selectedNames.forEach(name => message += `• ${name}\n`);
      message += `\n`;
    }

    // Additional details
    if (additionalDetails.trim()) {
      message += `*Details:*\n${additionalDetails}\n\n`;
    }

    // Custom request
    if (customRequest.trim()) {
      message += `*Additional Notes:*\n${customRequest}\n\n`;
    }

    // Footer
    message += `🆔 Request ID: HELP-${Date.now().toString().slice(-6)}\n`;
    message += `⏰ Timestamp: ${new Date().toLocaleString()}`;

    const phoneNumber = "2055058028";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsSending(false);
      onOpen();
      resetForm();
    }, 800);
  };

  // Reset form
  const resetForm = () => {
    setSelectedServices([]);
    setCustomRequest("");
    setOrderNumber("");
    setReturnReason("");
    setAdditionalDetails("");
    setAgreeToTerms(false);
    setSelectedCategory("");
  };

  // Check if form is valid
  const isFormValid = () => {
    return agreeToTerms && (selectedServices.length > 0 || customRequest.trim() || additionalDetails.trim());
  };

  return (
    <DefaultLayout>
      <Helmet>
        <title>Help & Support | OMS</title>
        <meta name="description" content="Get help with returns, orders, products, and account support" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d7a68] via-[#0a6455] to-[#083d33] opacity-95"></div>
          <div className=" absolute inset-0 bg-[url('https://res.cloudinary.com/deahgtn57/image/upload/v1749979263/omelett%27s/public/c919/109_sqz5zm.png')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="text-center">
            <Badge 
              variant="flat"
              className="bg-white/20 backdrop-blur-sm border border-white/20 text-white mb-6"
            >
              <FaHeadset className="mr-2" />
              24/7 Support Available
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How Can We Help You?
            </h1>
            
            <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
              Select what you need help with, and we'll connect you directly via WhatsApp
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2">
                <FaClock className="text-white" />
                <span className="text-white/80">Fast Response</span>
              </div>
              <div className="w-px h-4 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-white" />
                <span className="text-white/80">Secure</span>
              </div>
              <div className="w-px h-4 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-white" />
                <span className="text-white/80">Expert Team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          {/* Quick Stats */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: <FaClock />, value: "2h", label: "Avg Response", color: "#0d7a68" },
              { icon: <FaWhatsapp />, value: "24/7", label: "Support", color: "#25D366" },
              { icon: <FaStar />, value: "98%", label: "Satisfaction", color: "#FFD700" },
              { icon: <FaUndo />, value: "1-Day", label: "Returns", color: "#E43636" },
            ].map((stat, index) => (
              <Card key={index} className="border-none bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg">
                <CardBody className="p-6 text-center">
                  <div 
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 mx-auto"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <div style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Category Selection */}
              <Card className="border-none bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg">
                <CardBody className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <FaInfoCircle className="text-[#0d7a68]" />
                    Step 1: Select Help Category
                  </h2>
                  
                  <Select
                    label="What do you need help with?"
                    placeholder="Choose a category"
                    className="mb-6"
                    selectedKeys={selectedCategory ? [selectedCategory] : []}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0] as string;
                      setSelectedCategory(key);
                      setSelectedServices([]);
                    }}
                  >
                    {serviceCategories.map((category) => (
                      <SelectItem key={category.id} textValue={category.name}>
                        <div className="flex items-center gap-3 py-2">
                          <div className="p-2 rounded" style={{ backgroundColor: `#0d7a6820`, color: '#0d7a68' }}>
                            {category.icon}
                          </div>
                          <div>
                            <div className="font-medium">{category.name}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                </CardBody>
              </Card>

              {/* Services Selection */}
              <AnimatePresence>
                {selectedCategory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-none bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg">
                      <CardBody className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                          <FaClipboardList className="text-[#0d7a68]" />
                          Step 2: Select Services
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {serviceCategories
                            .find(cat => cat.id === selectedCategory)
                            ?.services.map((service) => {
                              const isSelected = selectedServices.includes(service.id);
                              
                              return (
                                <button
                                  key={service.id}
                                  onClick={() => toggleService(service.id)}
                                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                                    isSelected
                                      ? 'border-[#0d7a68] bg-[#0d7a68]/10'
                                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded ${
                                        isSelected
                                          ? 'bg-[#0d7a68] text-white'
                                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                      }`}>
                                        {service.icon}
                                      </div>
                                      <div>
                                        <div className={`font-medium ${
                                          isSelected ? 'text-[#0d7a68]' : 'text-gray-900 dark:text-white'
                                        }`}>
                                          {service.name}
                                        </div>
                                        <Chip
                                          size="sm"
                                          variant="flat"
                                          className="mt-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                        >
                                          {service.badge}
                                        </Chip>
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <FaCheck className="text-[#0d7a68]" />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Additional Information */}
              <AnimatePresence>
                {(selectedServices.length > 0 || selectedCategory) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-none bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg">
                      <CardBody className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                          <FaPaperPlane className="text-[#0d7a68]" />
                          Step 3: Provide Details
                        </h2>
                        
                        <div className="space-y-6">
                          {/* Order Number */}
                          {(selectedCategory === 'returns' || selectedCategory === 'orders') && (
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                Order Number (if available)
                              </label>
                              <Input
                                placeholder="e.g., ORD-123456"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                              />
                            </div>
                          )}

                          {/* Return Reason */}
                          {selectedCategory === 'returns' && (
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                Reason for Return
                              </label>
                              <Select
                                placeholder="Select a reason"
                                selectedKeys={returnReason ? [returnReason] : []}
                                onSelectionChange={(keys) => {
                                  const key = Array.from(keys)[0] as string;
                                  setReturnReason(key);
                                }}
                              >
                                {returnReasons.map((reason) => (
                                  <SelectItem key={reason.id}>{reason.label}</SelectItem>
                                ))}
                              </Select>
                            </div>
                          )}

                          {/* Details */}
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                              Please describe your issue
                            </label>
                            <Textarea
                              placeholder="Provide details about your problem or request..."
                              value={additionalDetails}
                              onChange={(e) => setAdditionalDetails(e.target.value)}
                              minRows={4}
                            />
                          </div>

                          {/* Custom Request */}
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                              Additional Notes (Optional)
                            </label>
                            <Textarea
                              placeholder="Any additional information or special requests..."
                              value={customRequest}
                              onChange={(e) => setCustomRequest(e.target.value)}
                              minRows={3}
                            />
                          </div>

                          {/* Terms */}
                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Checkbox
                              isSelected={agreeToTerms}
                              onValueChange={setAgreeToTerms}
                            >
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                I agree to share my information via WhatsApp for support purposes.
                              </span>
                            </Checkbox>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-8">
              {/* Summary Card */}
              <div className="lg:sticky lg:top-8">
                <Card className="border-none bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg">
                  <CardBody className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <FaShieldAlt className="text-[#0d7a68]" />
                      Request Summary
                    </h2>

                    {selectedServices.length === 0 && !additionalDetails.trim() ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                          <FaQuestionCircle className="text-xl text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Select services to see summary
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Category */}
                        {selectedCategory && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Category
                            </h3>
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                              <div className="p-2 rounded" style={{ backgroundColor: `#0d7a6820`, color: '#0d7a68' }}>
                                {serviceCategories.find(c => c.id === selectedCategory)?.icon}
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {serviceCategories.find(c => c.id === selectedCategory)?.name}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Selected Services */}
                        {selectedServices.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Selected Services ({selectedServices.length})
                            </h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                              {selectedServices.map((id) => {
                                const service = allServices.find(s => s.id === id);
                                if (!service) return null;
                                return (
                                  <div
                                    key={id}
                                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-700">
                                        {service.icon}
                                      </div>
                                      <span className="text-sm font-medium text-gray-900 dark:text-white">{service.name}</span>
                                    </div>
                                    <button
                                      onClick={() => toggleService(id)}
                                      className="p-1 rounded-full hover:bg-red-500/10 transition-colors text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                                    >
                                      <FaTimes />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Order Info */}
                        {orderNumber && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Order Details
                            </h3>
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                              <p className="font-mono text-sm text-gray-900 dark:text-white">#{orderNumber}</p>
                              {returnReason && (
                                <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                                  Reason: {returnReasons.find(r => r.id === returnReason)?.label}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        <Divider className="bg-gray-200 dark:bg-gray-700" />

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <Button
                            fullWidth
                            className="bg-[#0d7a68] text-white hover:bg-[#0a6455] shadow-lg"
                            onPress={sendToWhatsApp}
                            isLoading={isSending}
                            isDisabled={!isFormValid()}
                            startContent={!isSending && <FaWhatsapp />}
                          >
                            {isSending ? "Preparing..." : "Send via WhatsApp"}
                          </Button>

                          <Button
                            fullWidth
                            variant="flat"
                            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            onPress={resetForm}
                            startContent={<FaSync />}
                          >
                            Reset Form
                          </Button>
                        </div>

                        {/* Info Box */}
                        <div className="mt-4 p-3 rounded-lg bg-[#0d7a68]/10 border border-[#0d7a68]/20">
                          <div className="flex items-start gap-2">
                            <FaHeadset className="mt-0.5 text-[#0d7a68]" />
                            <div>
                              <p className="text-sm text-[#0d7a68]">
                                Your request will open in WhatsApp. Just click send to connect with our support team.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>

                {/* Support Hours */}
                <Card className="mt-8 border-none bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg">
                  <CardBody className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                      <FaClock className="text-[#0d7a68]" />
                      Support Hours
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Mon - Fri</span>
                        <span className="font-medium text-gray-900 dark:text-white">9 AM - 8 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Saturday</span>
                        <span className="font-medium text-gray-900 dark:text-white">10 AM - 6 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Sunday</span>
                        <span className="font-medium text-[#25D366]">WhatsApp Support</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[#0d7a68]/10 to-[#0a6455]/10 dark:from-[#0d7a68]/20 dark:to-[#0a6455]/20">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Need Help Immediately?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Our support team typically responds within 2 hours via WhatsApp. 
                For urgent issues, complete the form above for priority assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <FaCheck className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Request Prepared!</h2>
                <p className="text-sm text-gray-500">WhatsApp is now open</p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <FaWhatsapp className="text-white text-2xl" />
              </div>
              <p className="text-gray-600 mb-4">
                Your help request has been prepared. WhatsApp is now open with your message.
                Just click send to connect with our support team!
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Expected Response:</strong> Within 2 hours
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Request ID:</strong> HELP-{Date.now().toString().slice(-6)}
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              className="bg-[#0d7a68] text-white hover:bg-[#0a6455]" 
              onPress={onClose} 
              fullWidth
            >
              Got it, thanks!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}
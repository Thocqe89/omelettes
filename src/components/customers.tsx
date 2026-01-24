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
} from "@heroui/react";
import { 
  FaPlane, 
  FaShoppingCart, 
  FaGlobeAsia, 
  FaCode, 
  FaUsers, 
  FaWhatsapp,
  FaCheck,
  FaGem,
  FaShieldAlt,
  FaHeadset,
  FaSync,
  FaTimes,
  FaPaperPlane
} from "react-icons/fa";
import { motion } from "framer-motion";
import DefaultLayout from "@/layouts/default";
import { Helmet } from "react-helmet-async";

export default function HelpRequestPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customRequest, setCustomRequest] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Services data
  const services = [
    { id: "airplane-model", name: "Aircraft Models", icon: <FaPlane /> },
    { id: "airplane-booking", name: "Flight Services", icon: <FaPlane /> },
    { id: "china-order", name: "China Imports", icon: <FaShoppingCart /> },
    { id: "thailand-order", name: "Thailand Imports", icon: <FaGlobeAsia /> },
    { id: "web-dev", name: "Web Development", icon: <FaCode /> },
    { id: "partner-order", name: "Partner Solutions", icon: <FaUsers /> },
    { id: "oms-membership", name: "Membership", icon: <FaGem /> }
  ];

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
    
    const selectedNames = selectedServices.map(id => 
      services.find(service => service.id === id)?.name || ""
    );

    const message = `📋 *HELP REQUEST*\n\n` +
      `Selected Services:\n` +
      selectedNames.map(name => `• ${name}`).join('\n') +
      (customRequest.trim() ? `\n\nCustom Request:\n${customRequest}` : '') +
      `\n\nRequest ID: ${Date.now().toString().slice(-6)}`;

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

  return (
    <DefaultLayout>
      <Helmet>
        <title>Help Request | OMS</title>
        <meta name="description" content="Request assistance for various services" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Help Request</h1>
            <p className="text-gray-600 mt-2">
              Select services you need help with or describe your request
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Services Section */}
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardBody className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Select Services
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((service) => {
                      const isSelected = selectedServices.includes(service.id);
                      
                      return (
                        <button
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className={`p-2 rounded-lg mr-3 ${
                            isSelected ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {service.icon}
                          </div>
                          <span className={`font-medium ${
                            isSelected ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {service.name}
                          </span>
                          {isSelected && (
                            <FaCheck className="ml-auto text-blue-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              {/* Custom Request */}
              <Card>
                <CardBody className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Custom Request
                  </h2>
                  <Textarea
                    value={customRequest}
                    onChange={(e) => setCustomRequest(e.target.value)}
                    placeholder="Describe your request in detail..."
                    className="mb-4"
                    minRows={5}
                  />
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Please provide specific details</span>
                    <span>{customRequest.length}/1000</span>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Summary Panel */}
            <div>
              <Card className="sticky top-8">
                <CardBody className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Request Summary
                  </h2>

                  {selectedServices.length === 0 && !customRequest.trim() ? (
                    <div className="text-center py-6">
                      <FaHeadset className="text-gray-400 text-4xl mx-auto mb-3" />
                      <p className="text-gray-500">No services selected yet</p>
                    </div>
                  ) : (
                    <>
                      {/* Selected Services List */}
                      {selectedServices.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-medium text-gray-700 mb-2">Selected Services:</h3>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {selectedServices.map((id) => {
                              const service = services.find(s => s.id === id);
                              return (
                                <div
                                  key={id}
                                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                                >
                                  <div className="flex items-center">
                                    {service?.icon}
                                    <span className="ml-2 text-sm">{service?.name}</span>
                                  </div>
                                  <button
                                    onClick={() => toggleService(id)}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Custom Request Preview */}
                      {customRequest.trim() && (
                        <div className="mb-4">
                          <h3 className="font-medium text-gray-700 mb-2">Your Request:</h3>
                          <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                            {customRequest.length > 150 
                              ? `${customRequest.substring(0, 150)}...` 
                              : customRequest}
                          </div>
                        </div>
                      )}

                      <Divider className="my-4" />

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Button
                          fullWidth
                          color="success"
                          className="bg-green-600 text-white"
                          onPress={sendToWhatsApp}
                          isLoading={isSending}
                          isDisabled={selectedServices.length === 0 && !customRequest.trim()}
                          startContent={<FaWhatsapp />}
                        >
                          {isSending ? "Preparing..." : "Send via WhatsApp"}
                        </Button>

                        <Button
                          fullWidth
                          variant="flat"
                          onPress={resetForm}
                          startContent={<FaSync />}
                        >
                          Reset Form
                        </Button>

                        {/* WhatsApp Direct Button */}
                        <Button
                          fullWidth
                          variant="bordered"
                          onPress={() => window.open('https://wa.me/2055058028', '_blank')}
                          startContent={<FaPaperPlane />}
                        >
                          Open WhatsApp Directly
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Info Box */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start">
                      <FaShieldAlt className="text-blue-600 mt-1 mr-2" />
                      <div>
                        <h4 className="font-medium text-blue-800">How it works</h4>
                        <p className="text-sm text-blue-600 mt-1">
                          Your request will open in WhatsApp. Simply send the message to connect with our support team.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Simple Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardBody className="text-center p-6">
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-gray-600 mt-2">Support Available</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center p-6">
                <div className="text-3xl font-bold text-green-600">Fast</div>
                <div className="text-gray-600 mt-2">Response Time</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center p-6">
                <div className="text-3xl font-bold text-purple-600">Secure</div>
                <div className="text-gray-600 mt-2">Communication</div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaCheck className="text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Request Prepared!</h2>
                <p className="text-sm text-gray-500">WhatsApp is now open</p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="text-center py-4">
              <FaWhatsapp className="text-green-500 text-5xl mx-auto mb-4" />
              <p className="text-gray-600">
                Your help request has been prepared. WhatsApp is now open with your message.
                Just click send to connect with our team!
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onClose} fullWidth>
              Got it, thanks!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}
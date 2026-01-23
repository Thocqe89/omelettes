import { useState, useEffect } from "react";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import DefaultLayout from "@/layouts/default";
import Loading from "@/components/loading";
import { useTranslation } from "react-i18next";
import { AiOutlineRight, AiOutlineClose, AiOutlineLeft, AiOutlineRight as RightArrow } from "react-icons/ai";
import { Tooltip } from "@heroui/tooltip";
import { Helmet } from "react-helmet-async";

interface Product {
  ID: string;
  Name: string;
  Images?: {
    image_meain?: string | null;
  };
}

export default function IndexPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [statsTriggered, setStatsTriggered] = useState(false);
  const [collectors, setCollectors] = useState(0);
  const [models, setModels] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  
  // Lightbox/Modal states
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;

  // Product fetch
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}?nocache=${Date.now()}`);
        const data = await response.json();
        
        if (data.success && Array.isArray(data.products)) {
          const mappedProducts = data.products.slice(0, 6).map((p: any) => ({
            ID: p.ID,
            Name: p.Name,
            Images: p.Images || {},
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  // Trigger stats animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatsTriggered(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Animate stats
  useEffect(() => {
    if (statsTriggered) {
      const intervals = [
        { setter: setCollectors, end: 1000, interval: 20, increment: 20 },
        { setter: setModels, end: 50, interval: 30, increment: 1 },
        { setter: setSatisfaction, end: 98, interval: 25, increment: 1 }
      ];

      intervals.forEach(({ setter, end, interval, increment }) => {
        let count = 0;
        const timer = setInterval(() => {
          count += increment;
          if (count >= end) {
            setter(end);
            clearInterval(timer);
          } else {
            setter(count);
          }
        }, interval);
      });
    }
  }, [statsTriggered]);

  // Handle WhatsApp consultation
  const handleWhatsAppConsultation = () => {
    const message = `Hello! I'm interested in Omelette's Aerospace products and would like to request a consultation.`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "+8562055058028";
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  // Handle image click to open modal
  const handleImageClick = (index: number) => {
    setSelectedImage(index);
    setIsModalOpen(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  // Navigate to next image
  const handleNextImage = () => {
    if (selectedImage !== null && selectedImage < displaySettings.length - 1) {
      setSelectedImage(selectedImage + 1);
    } else {
      setSelectedImage(0);
    }
  };

  // Navigate to previous image
  const handlePrevImage = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    } else {
      setSelectedImage(displaySettings.length - 1);
    }
  };

  // Close modal on Escape key and handle keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
      if (e.key === 'ArrowRight' && isModalOpen) {
        handleNextImage();
      }
      if (e.key === 'ArrowLeft' && isModalOpen) {
        handlePrevImage();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen, selectedImage]);

  // Display settings for airplane models - UPDATED with Luxury Gift
  const displaySettings = [
    {
      title: "Executive Office Desk",
      description: "Perfect for CEO offices and corporate executives",
      image: "https://res.cloudinary.com/deahgtn57/image/upload/v1768752540/omelett%27s/public/index%20page/Gemini_Generated_Image_7iobqh7iobqh7iob_icvb7s.png",
      color: "from-blue-50 to-cyan-50",
      features: ["Creates professional impression", "Excellent conversation starter", "Enhances executive decor"]
    },
    {
      title: "Hotel Lobby Display",
      description: "Creates an impressive first impression for luxury hotels",
      image: "https://res.cloudinary.com/deahgtn57/image/upload/v1768752541/omelett%27s/public/index%20page/Gemini_Generated_Image_siz6n9siz6n9siz6_1_otwyyi.png",
      color: "from-amber-50 to-orange-50",
      features: ["Impressive entrance display", "Luxury ambiance enhancer", "Guest conversation piece"]
    },
    {
      title: "Restaurant & Café Tables",
      description: "Enhances dining experience with aviation elegance",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800",
      color: "from-emerald-50 to-teal-50",
      features: ["Unique table centerpiece", "Enhances dining atmosphere", "Memorable customer experience"]
    },
    {
      title: "Home Library & Study",
      description: "Adds sophistication to personal collections",
      image: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=800",
      color: "from-purple-50 to-violet-50",
      features: ["Personal collection showcase", "Intellectual ambiance", "Conversation starter"]
    },
    {
      title: "Conference Room Centerpiece",
      description: "Elevates business meetings and presentations",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800",
      color: "from-rose-50 to-pink-50",
      features: ["Professional meeting ambiance", "Inspires innovation", "Project success symbol"]
    },
    {
      title: "Luxury Gift",
      description: "The perfect premium gift for aviation enthusiasts",
      image: "https://res.cloudinary.com/deahgtn57/image/upload/v1768752521/omelett%27s/public/index%20page/Gemini_Generated_Image_o0id8io0id8io0id-removebg-preview_unaqdn.png",
      color: "from-rose-50 to-pink-50",
      features: ["Premium gift packaging", "Elegant presentation", "Memorable for any occasion"]
    }
  ];

  return (
    <DefaultLayout>
      <Helmet>
        <title>{t('home.title')}</title>
        <meta name="description" content={t('home.description')} />
      </Helmet>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d7a68] via-[#0a6455] to-[#083d33] opacity-95"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-white">
                          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
                            <span className="text-sm font-medium tracking-wider">{t("premiumCollection")}</span>
                          </div>
            
                          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            <span className="block">Omelette<span className="text-[#E43636]">'</span>s</span>
                          </h1>
            
            
            
                          <Divider className="my-8 bg-white/20 w-24" />
            
                          <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
                            {t("intro")}
                          </p>
            
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                              as={Link}
                              href="/Omelette's"
                              className="bg-white text-[#0d7a68] px-8 py-6 text-lg font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 shadow-xl"
                            >
                              {t("viewModels")}<span className="ml-2"><AiOutlineRight size={20} /></span>
                            </Button>
                          </div>
            
                          <div className="flex gap-8 mt-12">
                            <div>
                              <div className="text-3xl font-bold">{collectors}+</div>
                              <div className="text-sm text-white/60">{t('collectors')}</div>
                            </div>
                            <div>
                              <div className="text-3xl font-bold">{models}+</div>
                              <div className="text-sm text-white/60">{t('models')}</div>
                            </div>
                            <div>
                              <div className="text-3xl font-bold">{satisfaction}%</div>
                              <div className="text-sm text-white/60">{t('satisfaction')}</div>
                            </div>
                          </div>
                        </div>
            
                        <div className="lg:w-1/2">
                          <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-white/10 to-transparent rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                            
                            <div className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-2">
                              <Image
                                isBlurred
                                className="w-full h-full object-cover rounded-lg shadow-2xl"
                                src="https://res.cloudinary.com/deahgtn57/image/upload/v1768754623/omelett%27s/public/index%20page/A380-Emirates_ptqbpz.png"
                                alt="Premium Aircraft Model"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
            
                  {/* Products Section */}
                  <section className="py-24 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="text-center mb-16">
                        <Chip
                          variant="flat"
                          className="bg-[#0d7a68]/10 text-[#0d7a68] mb-6"
                        >
                          {t('featuredCollection')}
                        </Chip>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                          {t('curatedExcellence')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                          {t('discoverPremiumSelection')}
                        </p>
                      </div>
            
                      {loading ? (
                        <div className="flex justify-center items-center h-64">
                          <Loading />
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {products.map((product, index) => (
                            <Card
                              key={product.ID}
                              className="border-none bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                              isHoverable
                              onMouseEnter={() => setHoveredCard(index)}
                              onMouseLeave={() => setHoveredCard(null)}
                            >
                              <CardBody className="p-0">
                                <div className="relative overflow-hidden aspect-square">
                                  <Image
                                    isBlurred
                                    className={`w-full h-full object-cover transition-transform duration-700 ${
                                      hoveredCard === index ? 'scale-110' : 'scale-100'
                                    }`}
                                    src={product.Images?.image_meain || "/placeholder.jpg"}
                                    alt={product.Name}
                                  />
                                  
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Link
                                      href={`/product/${product.ID}`}
                                      className="bg-white text-[#0d7a68] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                                    >
                                      {t('viewDetails')}
                                    </Link>
                                  </div>
                                </div>
            
                                <div className="p-6">
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                                    {product.Name}
                                  </h3>
                                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                    {t('premiumScaleModel')}
                                  </p>
                                  
                                  <div className="flex items-center justify-between">
                                    <Chip
                                      size="sm"
                                      variant="flat"
                                      className="bg-[#0d7a68]/10 text-[#0d7a68] dark:bg-[#0d7a68]/20"
                                    >
                                      {t('aircraftModel')}
                                    </Chip>
                                    <div className="flex items-center gap-1 text-amber-500">
                                      <span className="text-sm">★★★★★</span>
                                    </div>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      )}
            
                      <div className="text-center mt-16">
                        <Link
                          href="/Omelette's"
                          className="inline-flex items-center gap-2 bg-[#0d7a68] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#0a6455] transition-colors shadow-lg hover:shadow-xl"
                        >
                          {t('viewFullCollection')}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </section>
            
                  {/* Display Settings Section with Image Modal - UPDATED */}
                  <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="text-center mb-16">
                        <Chip
                          variant="flat"
                          className="bg-[#0d7a68]/10 text-[#0d7a68] mb-6"
                        >
                          {t('perfectDisplay')}
                        </Chip>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                          {t('whereToDisplay')}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                          {t('premiumAircraftModels')}
                        </p>
                      </div>
            
                      {/* Updated grid with consistent card heights */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                        {displaySettings.map((setting, index) => (
                          <div 
                            key={index}
                            className={`bg-gradient-to-br ${setting.color} dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer flex flex-col h-full`}
                            onClick={() => handleImageClick(index)}
                          >
                            {/* Consistent image container with fixed aspect ratio */}
                            <div className="relative overflow-hidden aspect-video flex-shrink-0">
                              <Image
                                isBlurred
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                src={setting.image}
                                alt={setting.title}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                              {/* Add a click overlay with hint */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                  <span className="text-sm font-medium text-gray-700">{t('clickToView')}</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                                {t(setting.title)}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-grow">
                                {t(setting.description)}
                              </p>
                              <Chip
                                size="sm"
                                variant="flat"
                                className="bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 self-start mt-auto"
                              >
                                {t('idealDisplay')}
                              </Chip>
                            </div>
                          </div>
                        ))}
                      </div>
            
                      {/* Gift Packaging Section - UPDATED */}
                      <div className="mt-16 bg-gradient-to-r from-[#0d7a68]/10 to-[#0a6455]/10 dark:from-[#0d7a68]/20 dark:to-[#0a6455]/20 rounded-2xl p-8">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                          <div>
                            <Chip
                              variant="flat"
                              className="bg-[#0d7a68]/20 text-[#0d7a68] mb-6"
                            >
                              {t('perfectGiftPackaging')}
                            </Chip>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                              {t('premiumGiftPresentation')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                              {t('eachAircraftModelComes')}
                            </p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t('premiumGiftBox')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t('personalizedCard')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">{t('elegantPackaging')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="bg-gradient-to-br from-[#0d7a68] to-[#0a6455] rounded-xl p-2">
                              <div className="relative h-80 w-full rounded-lg overflow-hidden flex items-center justify-center bg-white dark:bg-gray-800 p-4">
                                <Image
                                  isZoomed
                                  width={350}
                                  height={350}
                                  className="w-50 h-50 object-contain"
                                  src="https://res.cloudinary.com/deahgtn57/image/upload/v1768752521/omelett%27s/public/index%20page/Gemini_Generated_Image_o0id8io0id8io0id-removebg-preview_unaqdn.png"
                                  alt={t('premiumGiftPackaging')}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
            
                  {/* Custom Modal Implementation - UPDATED */}
                  {isModalOpen && (
                    <>
                      {/* Backdrop - respects theme opacity */}
                      <div 
                        className="fixed inset-0 bg-black/70 dark:bg-black/90 backdrop-blur-sm z-[9998] animate-fade-in"
                        onClick={handleCloseModal}
                      />
                      
                      {/* Modal Content */}
                      <div className="fixed inset-0 z-[9999] overflow-hidden">
                        <div className="relative w-full h-full">
                          {/* Close button */}
                          <button
                            onClick={handleCloseModal}
                            className="absolute top-4 md:top-6 right-4 md:right-6 z-50 text-gray-800 dark:text-white bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all shadow-lg hover:shadow-xl"
                          >
                            <AiOutlineClose size={20} />
                          </button>
            
                          {/* Navigation buttons */}
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-50 text-gray-800 dark:text-white bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all shadow-lg hover:shadow-xl"
                          >
                            <AiOutlineLeft size={20} />
                          </button>
            
                          <button
                            onClick={handleNextImage}
                            className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-50 text-gray-800 dark:text-white bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all shadow-lg hover:shadow-xl"
                          >
                            <RightArrow size={20} />
                          </button>
            
                          {/* Image counter */}
                          <div className="absolute top-4 md:top-6 left-1/2 transform -translate-x-1/2 z-50 text-gray-800 dark:text-white bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 md:px-4 py-1 md:py-2 text-sm font-medium shadow-lg">
                            {selectedImage !== null ? `${selectedImage + 1} / ${displaySettings.length}` : ''}
                          </div>
            
                          {/* Main image and content */}
                          {selectedImage !== null && (
                            <div className="flex flex-col lg:flex-row h-full bg-white dark:bg-gray-900">
                              {/* Image section */}
                              <div className="lg:w-2/3 h-2/3 lg:h-full flex items-center justify-center p-4 lg:p-8 bg-gray-50 dark:bg-gray-800/30">
                                <div className="relative w-full h-full max-h-[60vh] lg:max-h-[80vh]">
                                  <Image
                                    isBlurred
                                    isZoomed
                                    className="w-full h-full object-contain rounded-lg shadow-2xl"
                                    src={displaySettings[selectedImage].image}
                                    alt={t(displaySettings[selectedImage].title)}
                                  />
                                </div>
                              </div>
            
                              {/* Info panel */}
                              <div className="lg:w-1/3 h-1/3 lg:h-full bg-white dark:bg-gray-900 border-t lg:border-l border-gray-200 dark:border-gray-800 p-4 md:p-6 lg:p-8 flex flex-col overflow-y-auto">
                                <Chip
                                  variant="flat"
                                  className="bg-[#0d7a68] text-white mb-4 lg:mb-6 self-start"
                                >
                                  {t(displaySettings[selectedImage].title) === "Luxury Gift" ? t('premiumGift') : t('displaySetting')}
                                </Chip>
                                
                                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">
                                  {t(displaySettings[selectedImage].title)}
                                </h3>
                                
                                <p className="text-gray-600 dark:text-gray-300 mb-4 lg:mb-6 text-base lg:text-lg">
                                  {t(displaySettings[selectedImage].description)}
                                </p>
                                
                                <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                                  <h4 className="text-gray-900 dark:text-white font-semibold text-base lg:text-lg mb-2 lg:mb-3">
                                    {t(displaySettings[selectedImage].title) === "Luxury Gift" ? t('giftFeatures') : t('keyFeatures')}
                                  </h4>
                                  {displaySettings[selectedImage].features?.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                      <div className="w-2 h-2 rounded-full bg-[#0d7a68] flex-shrink-0 mt-2"></div>
                                      <span className="text-gray-700 dark:text-gray-300 text-sm lg:text-base">{t(feature)}</span>
                                    </div>
                                  ))}
                                </div>
            
                                {/* Thumbnail navigation */}
                                <div className="mt-auto pt-4 lg:pt-6 border-t border-gray-200 dark:border-gray-800">
                                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 lg:mb-3">{t('otherDisplaySettings')}</p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {displaySettings.map((setting, index) => (
                                      <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 aspect-square ${
                                          selectedImage === index 
                                            ? 'border-[#0d7a68] dark:border-[#0d7a68] scale-105 ring-2 ring-[#0d7a68]/30 dark:ring-[#0d7a68]/30' 
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:scale-102'
                                        }`}
                                      >
                                        <Image
                                          className="w-full h-full object-cover"
                                          src={setting.image}
                                          alt={t(setting.title)}
                                        />
                                        {selectedImage === index && (
                                          <div className="absolute inset-0 bg-[#0d7a68]/20 dark:bg-[#0d7a68]/30"></div>
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
            
                  {/* Features Section */}
                  <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                          <div className="relative z-10">
                            <Tooltip content={t('visitThreeLeaves')} placement="top">
                              <div className="bg-gradient-to-br from-[#0d7a68] to-[#0a6455] rounded-2xl p-2">
                                <Link href="https://www.tiktok.com/@three_leaves_89?_r=1&_t=ZS-93BGInWlcIq">
                                  <Image
                                    isBlurred
                                    className="w-full h-96 object-cover rounded-xl shadow-2xl"
                                    src="https://res.cloudinary.com/deahgtn57/image/upload/v1768759465/omelett%27s/public/index%20page/Three_Leaves_Logo_Design_vxogp4.png"
                                    alt={t('premiumCraftsmanship')}
                                  />
                                </Link>
                              </div>
                            </Tooltip>
                          </div>
                          
                          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#0d7a68]/10 rounded-full"></div>
                          <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#0d7a68]/5 rounded-full"></div>
                        </div>
            
                        <div>
                          <Chip
                            variant="flat"
                            className="bg-[#0d7a68]/10 text-[#0d7a68] mb-6"
                          >
                            {t('craftsmanship')}
                          </Chip>
                          
                          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            {t('uncompromisingQuality')}
                          </h2>
                          
                          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            {t('eachModelIsTestament')}
                          </p>
            
                          <div className="space-y-6">
                            {[
                              { title: "Precision Engineering", desc: "0.01mm tolerance in manufacturing" },
                              { title: "Premium Materials", desc: "Aerospace-grade metals and finishes" },
                              { title: "Artisan Detailing", desc: "Hand-finished by master craftsmen" },
                              { title: "Certified Authenticity", desc: "Documented provenance for each piece" }
                            ].map((feature, index) => (
                              <div key={index} className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#0d7a68]/10 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-[#0d7a68]"></div>
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">{t(feature.title)}</h4>
                                  <p className="text-gray-600 dark:text-gray-300">{t(feature.desc)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
            
                          <div className="mt-8">
                            <Link
                              href="/about"
                              className="inline-flex items-center gap-2 text-[#0d7a68] font-medium hover:gap-3 transition-all"
                            >
                              {t('learnMoreAboutProcess')}
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
            
                  {/* CTA Section */}
                  <section className="py-24 bg-gradient-to-r from-[#0d7a68] to-[#0a6455] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '50px 50px'
                      }}></div>
                    </div>
            
                    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {t('beginYourCollection')}
                      </h2>
                      
                      <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                        {t('joinCollectorsWorldwide')}
                      </p>
            
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          onClick={handleWhatsAppConsultation}
                          className="bg-white text-[#0d7a68] px-10 py-6 text-lg font-medium rounded-lg hover:bg-gray-50 transition-all transform hover:-translate-y-1 shadow-2xl"
                        >
                          {t('requestConsultation')}
                        </Button>
                        <Button
                          as={Link}
                          href="/catalogue"
                          variant="bordered"
                          className="border-2 border-white text-white px-10 py-6 text-lg font-medium rounded-lg hover:bg-white/10 backdrop-blur-sm"
                        >
                          {t('downloadCatalogue')}
                        </Button>
                      </div>
            
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/20">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">✓</div>
                          <div className="text-sm text-white/80 mt-2">{t('freeShipping')}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">✓</div>
                          <div className="text-sm text-white/80 mt-2">{t('authenticityGuarantee')}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">✓</div>
                          <div className="text-sm text-white/80 mt-2">{t('securePayment')}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">✓</div>
                          <div className="text-sm text-white/80 mt-2">{t('support247')}</div>
                        </div>
                      </div>
                    </div>
                  </section>
                </DefaultLayout>
              );
            }
            
import { useState, useEffect, useRef } from "react";
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

  // Carousel states
  const [currentSlide, setCurrentSlide] = useState(0);

  const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;

  // Carousel images
  const carouselImages = [
   
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749979209/omelett%27s/public/image/3_b5k3zn.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769274064/omelett%27s/public/index%20page/WhatsApp_Image_2026-01-24_at_23.38.46_1_uxdsmf.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280092/omelett%27s/public/index%20page/WhatsApp_Image_2025-07-17_at_17.19.02_763328b6_yyn5j8.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769274064/omelett%27s/public/index%20page/WhatsApp_Image_2026-01-24_at_23.38.46_rbzsvv.jpg",
  "https://res.cloudinary.com/deahgtn57/image/upload/v1769280086/omelett%27s/public/index%20page/WhatsApp_Image_2025-07-12_at_20.39.20_3f364bf1_dzua9j.jpg",
  "https://res.cloudinary.com/deahgtn57/image/upload/v1769280085/omelett%27s/public/index%20page/WhatsApp_Image_2025-06-05_at_21.12.55_5f9b48ea_spsc5v.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280085/omelett%27s/public/index%20page/WhatsApp_Image_2025-06-11_at_18.58.37_97b3931d_xqts18.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280084/omelett%27s/public/index%20page/WhatsApp_Image_2025-07-03_at_18.30.55_5de8865d_lc72uv.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280085/omelett%27s/public/index%20page/WhatsApp_Image_2025-06-05_at_21.19.11_f6523a25_t054ud.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280086/omelett%27s/public/index%20page/WhatsApp_Image_2025-07-12_at_20.39.23_9277beb2_i2bq2d.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280598/omelett%27s/public/index%20page/WhatsApp_Image_2025-03-27_at_10.58.37_85769d8a_nlalyy.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280086/omelett%27s/public/index%20page/WhatsApp_Image_2025-07-17_at_17.18.59_526cb521_b7v8t5.jpg",
 
  
   
  ];

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

  // Carousel auto-slide functionality - SIMPLE AUTO ONLY
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Display settings for airplane models
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
      image: "https://res.cloudinary.com/deahgtn57/image/upload/v1768898745/omelett%27s/public/index%20page/Gemini_Generated_Image_9yzxph9yzxph9yzx_qddg29.png",
      color: "from-emerald-50 to-teal-50",
      features: ["Unique table centerpiece", "Enhances dining atmosphere", "Memorable customer experience"]
    },
    {
      title: "Home Library & Study",
      description: "Adds sophistication to personal collections",
      image: "https://res.cloudinary.com/deahgtn57/image/upload/v1768898745/omelett%27s/public/index%20page/Gemini_Generated_Image_5x190o5x190o5x19_jsfors.png",
      color: "from-purple-50 to-violet-50",
      features: ["Personal collection showcase", "Intellectual ambiance", "Conversation starter"]
    },
    {
      title: "Conference Room Centerpiece",
      description: "Elevates business meetings and presentations",
      image: "https://res.cloudinary.com/deahgtn57/image/upload/v1768899031/omelett%27s/public/index%20page/Gemini_Generated_Image_nq65ulnq65ulnq65_wggw70.png",
      color: "from-rose-50 to-pink-50",
      features: ["Professional meeting ambiance", "Inspires innovation", "Project success symbol"]
    },
    {
      title: "Luxury Gift",
      description: "The perfect premium gift for aviation enthusiasts",
      image: "https://res.cloudinary.com/deahgtn57/image/upload/v1768899543/omelett%27s/public/index%20page/Gemini_Generated_Image_s2daccs2daccs2da_vgtpw1.png",
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
                  className="border-none bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group h-full flex flex-col"
                  isHoverable
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardBody className="p-0 flex flex-col h-full">
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

                    <div className="p-6 flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {product.Name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {t('premiumScaleModel')}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
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

      {/* Display Settings Section with Image Modal */}
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

          {/* Fixed grid with equal square images */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySettings.map((setting, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${setting.color} dark:from-gray-800 dark:to-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col h-full`}
                onClick={() => handleImageClick(index)}
              >
                {/* Square image container (1:1 aspect ratio) */}
                <div className="relative overflow-hidden aspect-square">
                  <Image
                    isBlurred
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={setting.image}
                    alt={setting.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <span className="text-xs font-medium text-gray-700">{t('clickToView') || 'Click to view'}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {t(setting.title)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-grow">
                    {t(setting.description)}
                  </p>
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 self-start text-xs"
                  >
                    {t('idealDisplay') || 'Ideal Display'}
                  </Chip>
                </div>
              </div>
            ))}
          </div>

          {/* Gift Packaging Section */}
          <div className="mt-12 bg-gradient-to-r from-[#0d7a68]/10 to-[#0a6455]/10 dark:from-[#0d7a68]/20 dark:to-[#0a6455]/20 rounded-xl p-6">
            <div className="grid lg:grid-cols-2 gap-6 items-center">
              <div>
                <Chip
                  variant="flat"
                  className="bg-[#0d7a68]/20 text-[#0d7a68] mb-4"
                >
                  {t('perfectGiftPackaging')}
                </Chip>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('premiumGiftPresentation')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('eachAircraftModelComes')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{t('premiumGiftBox')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{t('personalizedCard')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{t('elegantPackaging')}</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-[#0d7a68] to-[#0a6455] rounded-lg p-2">
                  <div className="relative aspect-square rounded-lg overflow-hidden flex items-center justify-center bg-white dark:bg-gray-800 p-4">
                    <Image
                
                      className="w-full h-full object-contain"
                      src="https://res.cloudinary.com/deahgtn57/image/upload/v1769274064/omelett%27s/public/index%20page/WhatsApp_Image_2026-01-24_at_23.39.01_1_p6ptma.jpg"
                      alt={t('premiumGiftPackaging')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPROVED MODAL */}
      {isModalOpen && selectedImage !== null && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/90 dark:bg-black/95 backdrop-blur-sm z-[9998] animate-fade-in"
            onClick={handleCloseModal}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
              
              {/* Close Button - Top Right */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-50 bg-red-500 text-white hover:bg-red-600 rounded-full p-2 transition-all shadow-lg hover:scale-110"
                aria-label="Close modal"
              >
                <AiOutlineClose className="w-5 h-5" />
              </button>
              
              {/* Image Counter - Top Left */}
              <div className="absolute top-4 left-4 z-50 bg-black/70 text-white rounded-full px-3 py-1 text-sm font-medium">
                {selectedImage + 1} / {displaySettings.length}
              </div>
              
              {/* Navigation Buttons */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-700 rounded-full p-2 transition-all shadow-lg lg:left-4"
                aria-label="Previous image"
              >
                <AiOutlineLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-700 rounded-full p-2 transition-all shadow-lg lg:right-4"
                aria-label="Next image"
              >
                <RightArrow className="w-5 h-5" />
              </button>
              
              {/* Main Image Section */}
              <div className="lg:w-1/2 h-2/3 lg:h-full flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="relative w-full h-full max-w-lg mx-auto">
                  <Image
                    isBlurred
                    className="w-full h-full object-contain"
                    src={displaySettings[selectedImage].image}
                    alt={t(displaySettings[selectedImage].title)}
                  />
                </div>
              </div>
              
              {/* Info Section */}
              <div className="lg:w-1/2 h-1/3 lg:h-full bg-white dark:bg-gray-900 p-6 border-t lg:border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
                <Chip
                  variant="flat"
                  className="bg-[#0d7a68] text-white mb-3"
                >
                  {displaySettings[selectedImage].title === "Luxury Gift" 
                    ? (t('premiumGift') || 'Premium Gift') 
                    : (t('displaySetting') || 'Display Setting')}
                </Chip>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {t(displaySettings[selectedImage].title)}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 lg:mb-6 text-base lg:text-lg">
                  {t(displaySettings[selectedImage].description)}
                </p>
                
                <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                  <h4 className="text-gray-900 dark:text-white font-semibold text-lg lg:text-xl mb-2 lg:mb-3">
                    {displaySettings[selectedImage].title === "Luxury Gift" 
                      ? (t('giftFeatures') || 'Gift Features') 
                      : (t('keyFeatures') || 'Key Features')}
                  </h4>
                  {displaySettings[selectedImage].features?.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#0d7a68] flex-shrink-0 mt-2 lg:mt-3"></div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm lg:text-base">{t(feature)}</span>
                    </div>
                  ))}
                </div>
                
                {/* Thumbnail Navigation */}
                <div className="mt-auto pt-4 lg:pt-6 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 lg:mb-3">
                    {t('otherDisplaySettings') || 'Other Display Settings'}
                  </p>
                  <div className="grid grid-cols-3 lg:grid-cols-6 gap-1 lg:gap-2">
                    {displaySettings.map((setting, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative rounded overflow-hidden border transition-all duration-200 aspect-square ${
                          selectedImage === index 
                            ? 'border-[#0d7a68] ring-2 ring-[#0d7a68]/30 scale-105' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:scale-102'
                        }`}
                        aria-label={`View ${t(setting.title)}`}
                      >
                        <Image
                        
                          className="w-full h-full object-cover"
                          src={setting.image}
                          alt={t(setting.title)}
                        />
                        {selectedImage === index && (
                          <div className="absolute inset-0 bg-[#0d7a68]/20"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Features Section with SIMPLE Auto-Sliding Carousel */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative z-10">
                {/* Simple Auto-Sliding Carousel - NO CONTROLS */}
                <div className="bg-gradient-to-br from-[#0d7a68] to-[#0a6455] rounded-2xl p-2 shadow-2xl">
                  <div className="relative h-96 w-full rounded-xl overflow-hidden">
                    {/* Auto-sliding images */}
                    {carouselImages.map((image, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                          index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                      >
                        <Image
                          isBlurred
                          className="w-full h-full object-cover"
                          src={image}
                          alt={`Premium Craftsmanship ${index + 1}`}
                        />
                      </div>
                    ))}
                    
                    {/* Simple subtle indicator at bottom */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-1">
                      {carouselImages.map((_, index) => (
                        <div
                          key={index}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            index === currentSlide 
                              ? 'bg-white w-6' 
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
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
                  {t('show_details')}
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
              as={Link}
              href="/help"
              variant="bordered"
              className="border-2 border-white text-white px-10 py-6 text-lg font-medium rounded-lg hover:bg-white/10 backdrop-blur-sm"
            >
              {t('contact_us')}
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
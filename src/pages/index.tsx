import { useState, useEffect } from "react";
import { Link } from "@heroui/link";
import DefaultLayout from "@/layouts/default";
import { Image } from "@heroui/image";
import { useTranslation } from "react-i18next";
import 'aos/dist/aos.css';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function IndexPage() {
  const { t } = useTranslation();
  // const [showPopup, setShowPopup] = useState(false);
  // const [popupImage, setPopupImage] = useState("");

  // useEffect(() => {
  //   const hasShownPopup = localStorage.getItem('hasShownPopup');
  //   if (!hasShownPopup) {
  //     const timer = setTimeout(() => {
  //       setPopupImage("/image/homscheen.png");
  //       setShowPopup(true);
  //       localStorage.setItem('hasShownPopup', 'true');
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  // const handleClosePopup = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation();
  //   setShowPopup(false);
  // };

  const imageList = [
    "/image/home/1.png", "/image/home/2.png", "/image/home/4.png", "/image/home/3.png",
    "/image/home/5.png", "/image/home/6.png", "/image/home/7.png", "/image/home/8.png",
    "/image/home/9.png", "/image/home/10.png", "/image/home/12.png",
    "/image/home/13.png", "/image/home/14.png", "/image/home/15.png",
    "/image/home/17.png", "/image/home/18.png", "/image/home/19.png", "/image/home/20.png",
    "/image/home/21.png", "/image/home/22.png", "/image/home/23.png", "/image/home/24.png",
    "/image/home/25.png", "/image/home/26.png", "/image/home/27.png", "/image/home/28.png",
    "/image/home/29.png", "/image/home/30.png", "/image/home/31.png", "/image/home/32.png",
    "/image/home/33.png", "/image/home/34.png", "/image/home/35.png", "/image/home/36.png",
    "/image/home/37.png", "/image/home/38.png", "/image/home/39.png", "/image/home/40.png",
    "/image/home/41.png", "/image/home/42.png", "/image/home/43.png", "/image/home/44.png",
    "/image/home/45.png", "/image/home/46.png", "/image/home/47.png", "/image/home/11.png",
  ];

  const c919Images = [
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749979263/omelett%27s/public/c919/109_sqz5zm.png", 
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749978988/omelett%27s/public/c919/104_kukfrn.png",
     "https://res.cloudinary.com/deahgtn57/image/upload/v1749978988/omelett%27s/public/c919/102_ifefam.png",
      "https://res.cloudinary.com/deahgtn57/image/upload/v1749978988/omelett%27s/public/c919/103_qxckbi.png", 
      "https://res.cloudinary.com/deahgtn57/image/upload/v1749978989/omelett%27s/public/c919/105_xitts5.png",
     "https://res.cloudinary.com/deahgtn57/image/upload/v1749978990/omelett%27s/public/c919/107_tczxca.png",
      "https://res.cloudinary.com/deahgtn57/image/upload/v1749978989/omelett%27s/public/c919/108_yo3nlq.png",
       "https://res.cloudinary.com/deahgtn57/image/upload/v1749978990/omelett%27s/public/c919/110_boqc2i.png", 
       "https://res.cloudinary.com/deahgtn57/image/upload/v1749978990/omelett%27s/public/c919/113_ieq5sv.png",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749978991/omelett%27s/public/c919/117_ainnff.png", 
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749978992/omelett%27s/public/c919/118_vrp2nx.png",
     "https://res.cloudinary.com/deahgtn57/image/upload/v1749978991/omelett%27s/public/c919/119_xdasto.png", 
  ];

  const free = [
    { src: "https://res.cloudinary.com/deahgtn57/image/upload/v1749979221/omelett%27s/public/image/free/1_t9cqju.png" }, 
    { src: "https://res.cloudinary.com/deahgtn57/image/upload/v1749979221/omelett%27s/public/image/free/2_vwhyiw.png" },
     { src: "https://res.cloudinary.com/deahgtn57/image/upload/v1749979221/omelett%27s/public/image/free/3_jgef5j.png" },
    { src: "https://res.cloudinary.com/deahgtn57/image/upload/v1749979221/omelett%27s/public/image/free/4_mnjgw2.png" }, 
    { src: "https://res.cloudinary.com/deahgtn57/image/upload/v1749979221/omelett%27s/public/image/free/5_bojuth.png" }, 
    { src: "https://res.cloudinary.com/deahgtn57/image/upload/v1749979221/omelett%27s/public/image/free/6_zdhxux.png" },
    { src: "https://res.cloudinary.com/deahgtn57/image/upload/v1749979221/omelett%27s/public/image/free/7_ovuf58.png" }, 
  ];

  const [currentFreeIndex, setCurrentFreeIndex] = useState(0);
  const [currentC919Index, setCurrentC919Index] = useState(0);

  // Auto-slide for free images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFreeIndex((prevIndex) => (prevIndex + 1) % free.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [free.length]);

  // Manual sliding functions for C919 images (with looping)
  const nextC919Slide = () => {
    setCurrentC919Index((prevIndex) => (prevIndex + 1) % c919Images.length);
  };

  const prevC919Slide = () => {
    setCurrentC919Index((prevIndex) => (prevIndex - 1 + c919Images.length) % c919Images.length);
  };

  return (
    <DefaultLayout>
      {/* Pop-up for initial load */}
      {/* {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setShowPopup(false)}>
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <Image isBlurred alt="Featured Aircraft" src={popupImage} className="max-w-full max-h-[80vh] object-contain" />
              <button
                onClick={handleClosePopup}
                className="absolute top-2 right-2 rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors z-50 bg-green-700"
                aria-label="Close popup"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Main C919 airplane carousel (User-controlled) */}
      <div className="relative w-full h-[400px] md:h-[400px] lg:h-[600px] rounded-lg overflow-hidden">
         <video
    autoPlay
    loop
    muted
    playsInline // Important for autoplay on mobile devices
    className="absolute inset-0 w-full h-full object-cover z-0" // z-0 ensures it's the bottom layer
  >
    {/* **IMPORTANT:** Replace this with the actual path to your video file.
        For example, if your video is in `public/videos/my-background-video.mp4`, the path is `/videos/my-background-video.mp4`. */}
    <source src="https://res.cloudinary.com/deahgtn57/video/upload/v1749978822/omelett%27s/20_qpukka.mp4" />
    {/* It's good practice to provide multiple formats for broader browser compatibility */}
    {/* <source src="/videos/your-background-video.webm" type="video/webm" /> */}
    Your browser does not support the video tag.
  </video>
<div
  className="relative z-10 flex h-full w-full items-center justify-center"
  data-aos="fade-right"
  data-aos-delay="200"
  data-aos-duration="1200"
>
  {/* Circle light/glow background */}
  <div className="absolute w-72 h-72 rounded-full bg-white opacity-30 blur-2xl z-0" />

  {/* Image on top */}
  <img
    alt="C919 Flying"
    src={c919Images[currentC919Index]}
    key={currentC919Index}
    className="w-auto h-auto transition-opacity duration-500 z-10 max-w-[90%] animate-float-y-subtle"
  />
</div>


        {/* Navigation Buttons for C919 slider */}
       <button
  onClick={prevC919Slide}
  className="absolute left-2 top-[80%] transform -translate-y-1/2 bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-90 transition-colors z-20"
  aria-label="Previous C919 image"
>
  <FaChevronLeft className="text-green-700" />
</button>

<button
  onClick={nextC919Slide}
  className="absolute right-2 top-[80%] transform -translate-y-1/2 bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-90 transition-colors z-20"
  aria-label="Next C919 image"
>
  <FaChevronRight className="text-green-700" />
</button>

      </div>

      <section className="flex flex-col items-center justify-center gap-4 py-12 md:py-12">
        {/* Free slide carousel */}
        {/* <div data-aos="zoom-out">
          <div className="w-full flex justify-center py-4">
            <div data-aos="fade-right">
               <div
                onClick={() => {
                  setPopupImage(free[currentFreeIndex].src);
                  setShowPopup(true);
                }}
                className="cursor-pointer"
              >
                <Image
                  isBlurred
                  alt="Free Slide"
                  src={free[currentFreeIndex].src}
                  className="w-full max-w-[950px] h-auto object-contain rounded-lg shadow-md transition-all duration-700"
                />
              </div> 
            </div>
          </div>
        </div> */}

        <div className="inline-block max-w-lg text-center justify-center">
          <p className="text-default-500">{t("premium_airplane_models")}</p>
        </div>
        <div data-aos="zoom-in">
          <div className="h-1 w-80 mx-8 justify-center border-b-3 border-green-700"></div>
        </div>

        <div data-aos="zoom-out">
          <p className="text-gray-500 mt-2 text-sm md:text-base">{t("authentic_image")}</p>
        </div>

        {/* imageList grid display */}
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-10 md:gap-12 place-items-center">
            {imageList.map((src, idx) => (
              <div key={idx} data-aos="zoom-in-up">
                <Link href="/store">
                  <Image
                    isZoomed
                    isBlurred
                    src={src}
                    alt={`Company Model ${idx + 1}`}
                    width={500}
                    className="border border-green-700 w-full h-auto"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal separator */}
        <div data-aos="zoom-in">
          <div className="h-1 w-80 mx-8 justify-center border-b-3 border-green-700"></div>
        </div>
      </section>
    </DefaultLayout>
  );
}
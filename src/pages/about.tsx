import { useTranslation } from "react-i18next";
import { Image } from "@heroui/image";
import { Card } from "@heroui/card";

import DefaultLayout from "@/layouts/default";
import "aos/dist/aos.css";
export default function DocsPage() {
  const { t } = useTranslation();

  // Optional: set default language to English on mount

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-20 md:py-20">
        <div className="inline-block max-w-5xl px-4">
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-16">
            {/* Logo */}
            <div className="order-1 md:order-none w-full flex justify-center pt-2">
              <div data-aos="fade-up-right">
                <Image
                  alt="Company Logo"
                  className="object-contain transition-all duration-300 hover:scale-105 w-[300px] sm:w-[400px] md:w-[600px] lg:w-[700px]"
                  src="/image/logo01r.png"
                />
              </div>
            </div>

            {/* Green vertical line - hidden on mobile */}
            <div data-aos="zoom-in">
              <div className="hidden md:block h-80 w-1 bg-[#0d7a68] mx-8" />
            </div>
            {/* Company info */}
            <div className="order-2 md:order-none text-left max-w-2xl relative">
              {/* Mobile line */}
              <div className="md:hidden w-full h-1 text-[#0d7a68] my-6" />
              {/* <div data-aos="fade-up-right">
    <Image
      src="/image/ol1.png"
      alt="Company Logo"
      className="object-contain justify-center transition-all duration-300 hover:scale-105 w-[300px] sm:w-[400px] md:w-[600px] lg:w-[600px]"
    />
  </div> */}
              <br />
              <div data-aos="fade-down-left">
                <h1 className="text-3xl text-[#0d7a68] font-bold mb-4">
                  {t("title1")}
                </h1>
              </div>

              <div data-aos="zoom-out-up">
                <p className="text-lg mb-6">{t("intro")}</p>
              </div>

              <div data-aos="fade-down-left">
                <h1 className="text-3xl text-[#0d7a68] font-bold mb-4">
                  {t("title2")}
                </h1>
              </div>

              <div data-aos="zoom-out-up">
                <p className="text-lg mb-6">{t("content1")}</p>
              </div>

              <div data-aos="fade-down-left">
                <h1 className="text-3xl text-[#0d7a68] font-bold mb-4">
                  {t("title3")}
                </h1>
              </div>

              <div data-aos="zoom-out-up">
                <p className="text-lg mb-6">{t("content2")}</p>
              </div>

              <div data-aos="fade-down-left">
                <h1 className="text-3xl text-[#0d7a68] font-bold mb-4">
                  {t("title4")}
                </h1>
              </div>

              <div data-aos="zoom-out-up">
                <p className="text-lg mb-6">{t("content3")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 w-full max-w-4xl">
                {/* Dark Green Card */}
                <div data-aos="zoom-out-right">
                  <Card>
                    <div className="bg-[#0d7a68] text-white p-6 rounded-xl shadow-lg">
                      <h2 className="text-xl font-bold mb-2">#0d7a68</h2>
                      <p>
                        {" "}
                        Used for the airplane and text, projecting stability,
                        growth, and nature
                      </p>
                    </div>
                  </Card>
                </div>
                {/* Light Green Card */}

                <div data-aos="zoom-out-left">
                  <Card>
                    <div className="bg-[#A3D9A5] text-green-900 p-6 rounded-xl shadow-lg">
                      <h2 className="text-xl font-bold mb-2">#A3D9A5</h2>
                      <p>
                        Used for clouds and accents, softening the design and
                        balancing the visual weight
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
              <div
                data-aos="fade-right"
                data-aos-delay="200"
                data-aos-duration="1200"
              >
                <Image
                  isBlurred
                  isZoomed
                  alt="Company Logo"
                  className="w-full max-w-[600px] h-auto object-contain transition-all duration-300 hover:scale-105"
                  src="/c919/104.png"
                />
              </div>
            </div>
          </div>
        </div>
        <div data-aos="zoom-in">
          <div className=" h-1 w-80 bg-[#0d7a68] mx-8" />
        </div>
      </section>
    </DefaultLayout>
  );
}

import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { useTranslation } from "react-i18next";

import DefaultLayout from "@/layouts/default";
import "aos/dist/aos.css";

export default function ProductsPage() {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-8 py-12">
        <div className="flex flex-col items-center w-full max-w-5xl px-4 text-center">
          <h1 className="text-3xl text-[#0d7a68] font-bold text-center">
            {t("product")}{" "}
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            {t("authentic_image")}
          </p>

          <Accordion className="mt-6 w-full max-w-4xl " variant="splitted">
            <AccordionItem
              // className="bg-gray-900 text-white"
              key="1"
              aria-label="COMAC C919"
              startContent={
                <div data-aos="zoom-in">
                  <Image
                    alt="Company Logo"
                    src="/c919/Comac-Logo-768x432.png"
                    width={100}
                  />
                </div>
              }
              title=" COMAC C919"
            >
              <div className="w-full flex flex-col items-start  gap-8">
                {/* Description List */}
                <ul className="list-disc list-inside text-left max-w-2xl space-y-2">
                  <li>
                    <strong>Scale Ratio:</strong> 1:200
                  </li>
                  <li>
                    <strong>Origin:</strong> Mainland China
                  </li>
                  <li>
                    <strong>Aircraft Series:</strong> Passenger Aircraft
                  </li>
                  <li>
                    <strong>Material:</strong> Aluminum
                  </li>
                  <li>
                    <strong>Length:</strong> 20 cm (8 inches)
                  </li>
                </ul>

                {/* Images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-[#0d7a68] rounded-xl p-4">
                  {[
                    "c1.png",
                    "c2.png",
                    "c3.png",
                    "c4.png",
                    "c5.png",
                    "c6.png",
                    "c7.png",
                    "c8.png",
                  ].map((img, idx) => (
                    <div data-aos="zoom-in-down">
                      <Image
                        key={idx}
                        isBlurred
                        alt={`COMAC C919 Model ${idx + 1}`}
                        className="rounded-lg"
                        src={`/products/${img}`}
                        width={500}
                      />
                    </div>
                  ))}
                </div>
                <Link className="flex justify-end w-full" href="/store">
                  <div data-aos="zoom-in-right">
                    <Button className="bg-[#0d7a68] text-white ">
                      {t("shop_now")}
                    </Button>
                  </div>
                </Link>
              </div>
            </AccordionItem>

            <AccordionItem
              // style={{ backgroundColor: "#660033", color: "white" }}
              key="2"
              aria-label="Boeing 777 FIFA World Cup"
              startContent={
                <div data-aos="zoom-in">
                  <Image
                    alt="Company Logo"
                    src="/c919/Qatar-Airways-Logo.png"
                    width={100}
                  />
                </div>
              }
              title="Boeing 777 FIFA World Cup"
            >
              <div className="w-full flex flex-col items-start gap-8">
                {/* Description List */}

                <ul className="list-disc list-inside text-left max-w-2xl space-y-2">
                  <li>
                    <strong>Dimensions:</strong> 7.87 × 7.09 × 2.36 inches (20 ×
                    18 × 6 cm)
                  </li>
                  <li>
                    <strong>Material:</strong> Durable die-cast metal with
                    plastic wheels and display stand
                  </li>
                  <li>
                    <strong>Painting:</strong> Real Qatar Airways 2022 World Cup
                    livery using spray painting (not stickers)
                  </li>
                  <li>
                    <strong>Special:</strong> Great for desktop display or
                    aviation-themed gifts
                  </li>
                </ul>

                {/* Images Grid */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-xl p-4"
                  style={{ borderColor: "#660033" }}
                >
                  {[
                    "q1.png",
                    "q2.png",
                    "q3.png",
                    "q4.png",
                    "q5.png",
                    "q6.png",
                    "q7.png",
                    "q8.png",
                    "q9.png",
                    "q10.png",
                    "q11.png",
                    "q12.png",
                  ].map((img, idx) => (
                    <div data-aos="zoom-in-down">
                      <Image
                        key={idx}
                        isBlurred
                        alt={`Qatar Model ${idx + 1}`}
                        className="rounded-lg"
                        src={`/products/qatar/${img}`}
                        width={500} // bigger
                      />
                    </div>
                  ))}
                </div>

                {/* Button below the grid */}

                <Link className="flex justify-end w-full" href="/store">
                  <div data-aos="zoom-in-right">
                    <Button className="bg-[#0d7a68] text-white ">
                      {t("shop_now")}
                    </Button>
                  </div>
                </Link>
              </div>
            </AccordionItem>

            <AccordionItem
              key="3"
              aria-label="Antonov An-225 Mriya "
              startContent={
                <div data-aos="zoom-in">
                  <Image
                    alt="Company Logo"
                    src="/c919/Antonov_Airlines_logo.png"
                    width={70}
                  />
                </div>
              }
              title="Antonov An-225 Mriya  "
            >
              <div className="w-full flex flex-col items-start gap-8">
                {/* Description List */}

                <ul className="list-disc list-inside text-left max-w-2xl space-y-2">
                  <li>
                    <strong>Dimensions:</strong> 7.87 × 7.09 × 2.36 inches (20 ×
                    18 × 6 cm)
                  </li>
                  <li>
                    <strong>Material:</strong> Durable die-cast metal with
                    plastic wheels and display stand
                  </li>
                  <li>
                    <strong>Painting:</strong> Real Qatar Airways 2022 World Cup
                    livery using spray painting (not stickers)
                  </li>
                  <li>
                    <strong>Special:</strong> Great for desktop display or
                    aviation-themed gifts
                  </li>
                </ul>

                {/* Images Grid */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-xl p-4"
                  style={{ borderColor: "#067039FF" }}
                >
                  {[
                    "1.png",
                    "2.png",
                    "3.png",
                    "4.png",
                    "5.png",
                    "6.png",
                    "7.png",
                    "8.png",
                    "9.png",
                    "10.png",
                    "11.png",
                    "12.png",
                  ].map((img, idx) => (
                    <div data-aos="zoom-in-down">
                      <Image
                        key={idx}
                        isBlurred
                        alt={`antonov Model ${idx + 1}`}
                        className="rounded-lg"
                        src={`/image/antonov/${img}`}
                        width={500} // bigger
                      />
                    </div>
                  ))}
                </div>

                {/* Button below the grid */}

                <Link className="flex justify-end w-full" href="/store">
                  <div data-aos="zoom-in-right">
                    <Button className="bg-[#0d7a68] text-white ">
                      {t("shop_now")}
                    </Button>
                  </div>
                </Link>
              </div>
            </AccordionItem>
            <AccordionItem
              key="4"
              aria-label="China Eastern"
              startContent={
                <div data-aos="zoom-in">
                  <Image
                    alt="Company Logo"
                    src="/c919/China-Eastern.png"
                    width={100}
                  />
                </div>
              }
              title="China Eastern "
            >
              <div className="w-full flex flex-col items-start gap-8">
                {/* Description List */}

                <ul className="list-disc list-inside text-left max-w-2xl space-y-2">
                  <li>
                    <strong>Dimensions:</strong> 7.87 × 7.09 × 2.36 inches (20 ×
                    18 × 6 cm)
                  </li>
                  <li>
                    <strong>Material:</strong> Durable die-cast metal with
                    plastic wheels and display stand
                  </li>
                  <li>
                    <strong>Painting:</strong> Real Qatar Airways 2022 World Cup
                    livery using spray painting (not stickers)
                  </li>
                  <li>
                    <strong>Special:</strong> Great for desktop display or
                    aviation-themed gifts
                  </li>
                </ul>

                {/* Images Grid */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-xl p-4"
                  style={{ borderColor: "#92040BFF" }}
                >
                  {[
                    "e1.png",
                    "e2.png",
                    "e3.png",
                    "e4.png",
                    "e5.png",
                    "e6.png",
                    "e8.png",
                    "e9.png",
                    "e10.png",
                    "e11.png",
                  ].map((img, idx) => (
                    <div data-aos="zoom-in-down">
                      <Image
                        key={idx}
                        isBlurred
                        alt={`China Eastern Model ${idx + 1}`}
                        className="rounded-lg"
                        src={`/image/China Eastern/${img}`}
                        width={500} // bigger
                      />
                    </div>
                  ))}
                </div>

                {/* Button below the grid */}

                <Link className="flex justify-end w-full" href="/store">
                  <div data-aos="zoom-in-right">
                    <Button className="bg-[#0d7a68] text-white ">
                      {t("shop_now")}
                    </Button>
                  </div>
                </Link>
              </div>
            </AccordionItem>
            <AccordionItem
              key="5"
              aria-label="China Airlines"
              startContent={
                <div data-aos="zoom-in">
                  <Image alt="Company Logo" src="/c919/china.png" width={130} />
                </div>
              }
              title="China Airlines"
            >
              <div className="w-full flex justify-center">
                <Image
                  isBlurred
                  alt="Antonov An-225 Mriya"
                  className="rounded-lg"
                  src="/image/menu/no product.png"
                  width={400}
                />
              </div>
              <Link className="flex justify-end w-full" href="/store">
                <div data-aos="zoom-in-right">
                  <Button className="bg-[#0d7a68] ">{t("shop_now")}</Button>
                </div>
              </Link>
            </AccordionItem>
            <AccordionItem
              key="6"
              aria-label="Tahi Airways"
              startContent={
                <div data-aos="zoom-in">
                  {" "}
                  <Image alt="Company Logo" src="/c919/thai.png" width={100} />
                </div>
              }
              title="Thai Airways"
            >
              <div className="w-full flex justify-center">
                <Image
                  isBlurred
                  alt="Antonov An-225 Mriya"
                  className="rounded-lg"
                  src="/image/menu/no product.png"
                  width={400}
                />
              </div>
              <Link className="flex justify-end w-full" href="/store">
                <div data-aos="zoom-in-right">
                  <Button className="bg-[#0d7a68] ">{t("shop_now")}</Button>
                </div>
              </Link>
            </AccordionItem>
            <AccordionItem
              key="7"
              aria-label="Bangkok Airways"
              startContent={
                <div data-aos="zoom-in">
                  <Image
                    alt="Company Logo"
                    src="/c919/bangkok.png"
                    width={110}
                  />
                </div>
              }
              title="Bangkok Airways"
            >
              <div className="w-full flex justify-center">
                <Image
                  isBlurred
                  alt="Antonov An-225 Mriya"
                  className="rounded-lg"
                  src="/image/menu/no product.png"
                  width={400}
                />
              </div>
              <Link className="flex justify-end w-full" href="/store">
                <div data-aos="zoom-in-right">
                  <Button className="bg-[#0d7a68] ">{t("shop_now")}</Button>
                </div>
              </Link>
            </AccordionItem>
            <AccordionItem
              key="8"
              aria-label="China Airlines"
              startContent={
                <div data-aos="zoom-in">
                  <Image alt="Company Logo" src="/c919/china.png" width={130} />
                </div>
              }
              title="China Airlines"
            >
              <div className="w-full flex justify-center">
                <Image
                  isBlurred
                  alt="Antonov An-225 Mriya"
                  className="rounded-lg"
                  src="/image/menu/no product.png"
                  width={400}
                />
              </div>
              <Link className="flex justify-end w-full" href="/store">
                <div data-aos="zoom-in-right">
                  <Button className="bg-[#0d7a68] ">{t("shop_now")}</Button>
                </div>
              </Link>
            </AccordionItem>
            <AccordionItem
              key="9"
              aria-label="Air China"
              startContent={
                <div data-aos="zoom-in">
                  <Image
                    alt="Company Logo"
                    src="/c919/airchina.png"
                    width={130}
                  />
                </div>
              }
              title="Air China"
            >
              <div className="w-full flex justify-center">
                <Image
                  isBlurred
                  alt="Antonov An-225 Mriya"
                  className="rounded-lg"
                  src="/image/menu/no product.png"
                  width={400}
                />
              </div>
              <Link className="flex justify-end w-full" href="/store">
                <div data-aos="zoom-in-right">
                  <Button className="bg-[#0d7a68] text-white ">
                    {t("shop_now")}
                  </Button>
                </div>
              </Link>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </DefaultLayout>
  );
}

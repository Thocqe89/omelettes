
import DefaultLayout from "@/layouts/default";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { useTranslation } from "react-i18next";
import 'aos/dist/aos.css';

export default function ProductsPage() {
  const { t } = useTranslation();





  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-8 py-12">
        <div className="flex flex-col items-center w-full max-w-5xl px-4 text-center">
       
          <h1 className="text-3xl text-[#0d7a68] font-bold text-center">{t("product")} </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            {t("authentic_image")}
          </p>

          <Accordion variant="splitted" className="mt-6 w-full max-w-4xl ">

            <AccordionItem
              // className="bg-gray-900 text-white"
              key="1"
              aria-label="COMAC C919"
              title=" COMAC C919"
              startContent={
                <div data-aos="zoom-in">
                  <Image
                    src="/c919/Comac-Logo-768x432.png"
                    alt="Company Logo"
                    width={100}
                  />
                </div>
              }
            >
              <div className="w-full flex flex-col items-start  gap-8">
                {/* Description List */}
                <ul className="list-disc list-inside text-left max-w-2xl space-y-2">
                  <li><strong>Scale Ratio:</strong> 1:200</li>
                  <li><strong>Origin:</strong> Mainland China</li>
                  <li><strong>Aircraft Series:</strong> Passenger Aircraft</li>
                  <li><strong>Material:</strong> Aluminum</li>
                  <li><strong>Length:</strong> 20 cm (8 inches)</li>
                </ul>

                {/* Images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-[#0d7a68] rounded-xl p-4">
                  {[
                    "c1.png", "c2.png", "c3.png", "c4.png",
                    "c5.png", "c6.png", "c7.png", "c8.png"
                  ].map((img, idx) => (
                    <div data-aos="zoom-in-down">
                      <Image
                        key={idx}
                        isBlurred
                        src={`/products/${img}`}
                        alt={`COMAC C919 Model ${idx + 1}`}
                        width={500}
                        className="rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                <Link href="/store" className="flex justify-end w-full">
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
              title="Boeing 777 FIFA World Cup"
              startContent={
                <div data-aos="zoom-in">
                  <Image
                    src="/c919/Qatar-Airways-Logo.png"
                    alt="Company Logo"
                    width={100}
                  />
                </div>
              }
            >
              <div className="w-full flex flex-col items-start gap-8">
                {/* Description List */}

                <ul className="list-disc list-inside text-left max-w-2xl space-y-2">
                  <li><strong>Dimensions:</strong> 7.87 × 7.09 × 2.36 inches (20 × 18 × 6 cm)</li>
                  <li><strong>Material:</strong> Durable die-cast metal with plastic wheels and display stand</li>
                  <li><strong>Painting:</strong> Real Qatar Airways 2022 World Cup livery using spray painting (not stickers)</li>
                  <li><strong>Special:</strong> Great for desktop display or aviation-themed gifts</li>
                </ul>

                {/* Images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-xl p-4" style={{ borderColor: "#660033" }}>
                  {[
                    "q1.png", "q2.png", "q3.png", "q4.png",
                    "q5.png", "q6.png", "q7.png", "q8.png",
                    "q9.png", "q10.png", "q11.png", "q12.png"
                  ].map((img, idx) => (
                    <div data-aos="zoom-in-down">
                      <Image
                        key={idx}
                        isBlurred
                        src={`/products/qatar/${img}`}
                        alt={`Qatar Model ${idx + 1}`}
                        width={500} // bigger
                        className="rounded-lg"
                      />
                    </div>
                  ))}
                </div>


                {/* Button below the grid */}

                <Link href="/store" className="flex justify-end w-full">
                  <div data-aos="zoom-in-right">
                    <Button className="bg-[#0d7a68] text-white ">
                      {t("shop_now")}
                    </Button>
                  </div>
                </Link>

              </div>

            </AccordionItem>

            <AccordionItem key="3" aria-label="Antonov An-225 Mriya " title="Antonov An-225 Mriya  " startContent={
              <div data-aos="zoom-in">
                <Image
                  src="/c919/Antonov_Airlines_logo.png"
                  alt="Company Logo"
                  width={70}
                />
              </div>
            }>
              <div className="w-full flex flex-col items-start gap-8">
                {/* Description List */}

                <ul className="list-disc list-inside text-left max-w-2xl space-y-2">
                  <li><strong>Dimensions:</strong> 7.87 × 7.09 × 2.36 inches (20 × 18 × 6 cm)</li>
                  <li><strong>Material:</strong> Durable die-cast metal with plastic wheels and display stand</li>
                  <li><strong>Painting:</strong> Real Qatar Airways 2022 World Cup livery using spray painting (not stickers)</li>
                  <li><strong>Special:</strong> Great for desktop display or aviation-themed gifts</li>
                </ul>

                {/* Images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-xl p-4" style={{ borderColor: "#067039FF" }}>
                  {[
                    "1.png", "2.png", "3.png", "4.png",
                    "5.png", "6.png", "7.png", "8.png",
                    "9.png", "10.png", "11.png", "12.png"
                  ].map((img, idx) => (
                    <div data-aos="zoom-in-down">
                      <Image
                        key={idx}
                        isBlurred
                        src={`/image/antonov/${img}`}
                        alt={`antonov Model ${idx + 1}`}
                        width={500} // bigger
                        className="rounded-lg"
                      />
                    </div>
                  ))}
                </div>


                {/* Button below the grid */}

                <Link href="/store" className="flex justify-end w-full">
                  <div data-aos="zoom-in-right">
                    <Button className="bg-[#0d7a68] text-white ">
                      {t("shop_now")}
                    </Button>
                  </div>
                </Link>

              </div>

            </AccordionItem>
            <AccordionItem key="4" aria-label="China Eastern" title="China Eastern " startContent={
              <div data-aos="zoom-in"><Image
                src="/c919/China-Eastern.png"
                alt="Company Logo"
                width={100}
              /></div>
            }>
               <div className="w-full flex flex-col items-start gap-8">
                {/* Description List */}

                <ul className="list-disc list-inside text-left max-w-2xl space-y-2">
                  <li><strong>Dimensions:</strong> 7.87 × 7.09 × 2.36 inches (20 × 18 × 6 cm)</li>
                  <li><strong>Material:</strong> Durable die-cast metal with plastic wheels and display stand</li>
                  <li><strong>Painting:</strong> Real Qatar Airways 2022 World Cup livery using spray painting (not stickers)</li>
                  <li><strong>Special:</strong> Great for desktop display or aviation-themed gifts</li>
                </ul>

                {/* Images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-xl p-4" style={{ borderColor: "#92040BFF" }}>
                  {[
                    "e1.png", "e2.png", "e3.png", "e4.png",
                    "e5.png", "e6.png",  "e8.png",
                    "e9.png", "e10.png", "e11.png", 
                  ].map((img, idx) => (
                    <div data-aos="zoom-in-down">
                      <Image
                        key={idx}
                        isBlurred
                        src={`/image/China Eastern/${img}`}
                        alt={`China Eastern Model ${idx + 1}`}
                        width={500} // bigger
                        className="rounded-lg"
                      />
                    </div>
                  ))}
                </div>


                {/* Button below the grid */}

                <Link href="/store" className="flex justify-end w-full">
                  <div data-aos="zoom-in-right">
                    <Button className="bg-[#0d7a68] text-white ">
                      {t("shop_now")}
                    </Button>
                  </div>
                </Link>

              </div>
             
            </AccordionItem>
            <AccordionItem key="5" aria-label="China Airlines" title="China Airlines" startContent={
              <div data-aos="zoom-in"><Image
                src="/c919/china.png"
                alt="Company Logo"
                width={130}
              /></div>}>
              <div className="w-full flex justify-center">
                <Image
                  isBlurred
                  src="/image/menu/no product.png"
                  alt="Antonov An-225 Mriya"
                  width={400}
                  className="rounded-lg"
                />
              </div>
              <Link href="/store" className="flex justify-end w-full">
                <div data-aos="zoom-in-right">
                  <Button className="bg-[#0d7a68] ">
                    {t("shop_now")}
                  </Button>
                </div>
              </Link>
            </AccordionItem>
            <AccordionItem key="6" aria-label="Tahi Airways" title="Thai Airways" startContent={
              <div data-aos="zoom-in"> <Image
                src="/c919/thai.png"
                alt="Company Logo"
                width={100}
              /></div>}>
              <div className="w-full flex justify-center">
                 <Image
                  isBlurred
                  src="/image/menu/no product.png"
                  alt="Antonov An-225 Mriya"
                  width={400}
                  className="rounded-lg"
                />
              </div>
              <Link href="/store" className="flex justify-end w-full">
                <div data-aos="zoom-in-right">
                  <Button className="bg-[#0d7a68] ">
                    {t("shop_now")}
                  </Button>
                </div>
              </Link>
            </AccordionItem>
            <AccordionItem key="7" aria-label="Bangkok Airways" title="Bangkok Airways" startContent={
              <div data-aos="zoom-in"><Image
                src="/c919/bangkok.png"
                alt="Company Logo"
                width={110}
              /></div>}>
              <div className="w-full flex justify-center">
                <Image
                  isBlurred
                  src="/image/menu/no product.png"
                  alt="Antonov An-225 Mriya"
                  width={400}
                  className="rounded-lg"
                />
              </div>
              <Link href="/store" className="flex justify-end w-full">
                <div data-aos="zoom-in-right">
                  <Button className="bg-[#0d7a68] ">
                    {t("shop_now")}
                  </Button>
                </div>
              </Link>
            </AccordionItem>
            <AccordionItem key="8" aria-label="China Airlines" title="China Airlines" startContent={
              <div data-aos="zoom-in"><Image
                src="/c919/china.png"
                alt="Company Logo"
                width={130}
              /></div>}>
              <div className="w-full flex justify-center">
                 <Image
                  isBlurred
                  src="/image/menu/no product.png"
                  alt="Antonov An-225 Mriya"
                  width={400}
                  className="rounded-lg"
                />
              </div>
              <Link href="/store" className="flex justify-end w-full">
                <div data-aos="zoom-in-right">
                  <Button className="bg-[#0d7a68] ">
                    {t("shop_now")}
                  </Button>
                </div>
              </Link>
            </AccordionItem>
            <AccordionItem key="9" aria-label="Air China" title="Air China" startContent={
              <div data-aos="zoom-in"><Image
                src="/c919/airchina.png"
                alt="Company Logo"
                width={130}
              /></div>}>
              <div className="w-full flex justify-center">
                <Image
                  isBlurred
                  src="/image/menu/no product.png"
                  alt="Antonov An-225 Mriya"
                  width={400}
                  className="rounded-lg"
                />
              </div>
              <Link href="/store" className="flex justify-end w-full">
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

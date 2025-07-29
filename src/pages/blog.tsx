import { Image } from "@heroui/image";
import { useTranslation } from "react-i18next";

import DefaultLayout from "@/layouts/default";
import "aos/dist/aos.css";

export default function DocsPage() {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-10 ">
        <div className="inline-block max-w-5xl px-4">
          {/* <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
         
          </div> */}

          <div className="w-full max-w-3xl mt-1 sm:grid-cols-2 lg:grid-cols-3 space-y-5 md:space-y-8 sm:space-x-4 sm:space-y-4">
            <h1 className="text-3xl text-[#0d7a68] font-bold text-center">
              {t("blog")}
            </h1>
            {/* Step 1 */}
            {/* Step 1 */}
            <div data-aos="fade-left">
              <div className="bg-gray-900 p-6 rounded-xl shadow-md flex flex-col gap-6 items-start">
                {/* Content on top */}
                <div className="flex gap-6 items-start w-full">
                  <div className="text-5xl font-bold text-[#0d7a68]">1</div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-white">
                      Create a new function
                    </h2>
                    <p className="text-gray-400 mb-2">
                      The CLI will prompt you to pick a template for your
                      function.
                    </p>
                    {/* <div data-aos="zoom-in">
              <div className="h-1 bg-[#0d7a68] mx-8"></div>
            </div> */}
                    <div className="flex flex-col gap-2">
                      <a
                        className="bg-gray-800 text-white px-3 py-1 rounded font-mono text-sm inline-block mb-1"
                        href="https://www.deepseek.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        https://www.deepseek.com/
                      </a>
                      <a
                        className="bg-gray-800 text-white px-3 py-1 rounded font-mono text-sm inline-block mb-1"
                        href="https://chatgpt.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        https://chatgpt.com/
                      </a>
                      <a
                        className="bg-gray-800 text-white px-3 py-1 rounded font-mono text-sm inline-block"
                        href="https://gemini.google.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        https://gemini.google.com/
                      </a>
                    </div>
                  </div>
                </div>

                {/* Image on bottom */}
                <div
                  className="w-full flex justify-center"
                  data-aos="fade-up-right"
                >
                  <Image
                    isBlurred
                    alt="Omellet's Logo"
                    className="rounded-lg"
                    src="/image/tlogo.png"
                    width={500}
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div data-aos="fade-left">
              <div className="bg-gray-900 p-6 rounded-xl shadow-md flex flex-col gap-6 items-start">
                {/* Content on top */}
                <div className="flex gap-6 items-start w-full">
                  <div className="text-5xl font-bold text-[#0d7a68]">2</div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-white">
                      Create a new function
                    </h2>
                    <p className="text-gray-400 mb-2">
                      The CLI will prompt you to pick a template for your
                      function.
                    </p>
                    {/* <div data-aos="zoom-in">
              <div className="h-1 bg-[#0d7a68] mx-8"></div>
            </div> */}
                    <div className="flex flex-col gap-2">
                      <a
                        className="bg-gray-800 text-white px-3 py-1 rounded font-mono text-sm inline-block mb-1"
                        href="https://www.deepseek.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        https://www.deepseek.com/
                      </a>
                      <a
                        className="bg-gray-800 text-white px-3 py-1 rounded font-mono text-sm inline-block mb-1"
                        href="https://chatgpt.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        https://chatgpt.com/
                      </a>
                      <a
                        className="bg-gray-800 text-white px-3 py-1 rounded font-mono text-sm inline-block"
                        href="https://gemini.google.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        https://gemini.google.com/
                      </a>
                    </div>
                  </div>
                </div>

                {/* Image on bottom */}
                <div
                  className="w-full flex justify-center"
                  data-aos="fade-up-right"
                >
                  <Image
                    isBlurred
                    alt="Omellet's Logo"
                    className="rounded-lg"
                    src="/image/lang2.png"
                    width={500}
                  />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div data-aos="fade-left">
              <div className="bg-gray-900 p-6 rounded-xl shadow-md flex flex-col gap-6 items-start">
                {/* Content on top */}
                <div className="flex gap-6 items-start w-full">
                  <div className="text-5xl font-bold text-[#0d7a68]">3</div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-white">
                      Create a new function
                    </h2>
                    <p className="text-gray-400 mb-2">
                      The CLI will prompt you to pick a template for your
                      function.
                    </p>
                    {/* <div data-aos="zoom-in">
              <div className="h-1 bg-[#0d7a68] mx-8"></div>
            </div> */}
                    <div className="flex flex-col gap-2">
                      <a
                        className="bg-gray-800 text-white px-3 py-1 rounded font-mono text-sm inline-block mb-1"
                        href="https://www.deepseek.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        https://www.deepseek.com/
                      </a>
                      <a
                        className="bg-gray-800 text-white px-3 py-1 rounded font-mono text-sm inline-block mb-1"
                        href="https://chatgpt.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        https://chatgpt.com/
                      </a>
                      <a
                        className="bg-gray-800 text-white px-3 py-1 rounded font-mono text-sm inline-block"
                        href="https://gemini.google.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        https://gemini.google.com/
                      </a>
                    </div>
                  </div>
                </div>

                {/* Image on bottom */}
                <div
                  className="w-full flex justify-center"
                  data-aos="fade-up-right"
                >
                  <Image
                    isBlurred
                    alt="Omellet's Logo"
                    className="rounded-lg"
                    src="/image/n5.png"
                    width={500}
                  />
                </div>
              </div>
            </div>
            {/* Step 4 */}
            <div data-aos="fade-left">
              <div className="bg-gray-900 p-6 rounded-xl shadow-md flex flex-col gap-6 items-start">
                {/* Content on top */}
                <div className="flex gap-6 items-start w-full">
                  <div className="text-5xl font-bold text-[#0d7a68]">4</div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-white">
                      Create a new function
                    </h2>
                    <p className="text-gray-400 mb-2">
                      The CLI will prompt you to pick a template for your
                      function.
                    </p>
                    {/* <div data-aos="zoom-in">
              <div className="h-1 bg-[#0d7a68] mx-8"></div>
            </div> */}
                    <div className="flex flex-col gap-2">
                      <a
                        className="bg-gray-800 text-white px-3 py-1 rounded font-mono text-sm inline-block mb-1"
                        href="https://www.deepseek.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        https://www.deepseek.com/
                      </a>
                      <a
                        className="bg-gray-800 text-white px-3 py-1 rounded font-mono text-sm inline-block mb-1"
                        href="https://chatgpt.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        https://chatgpt.com/
                      </a>
                      <a
                        className="bg-gray-800 text-white px-3 py-1 rounded font-mono text-sm inline-block"
                        href="https://gemini.google.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        https://gemini.google.com/
                      </a>
                    </div>
                  </div>
                </div>

                {/* Image on bottom */}
                <div
                  className="w-full flex justify-center"
                  data-aos="fade-up-right"
                >
                  <Image
                    isBlurred
                    alt="Omellet's Logo"
                    className="rounded-lg"
                    src="/image/demo.png"
                    width={500}
                  />
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div data-aos="fade-right">
              <div className="bg-gray-900 p-6 rounded-xl shadow-md flex gap-6 items-start">
                <div className="text-5xl font-bold text-[#0d7a68]">5</div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white">
                    Push to Git to deploy!
                  </h2>
                  <p className="text-gray-400">
                    When done, you can invoke your function at{" "}
                    <code className="bg-gray-800 text-white px-2 py-0.5 rounded font-mono text-sm">
                      /.netlify/functions/FUNCTION-NAME
                    </code>
                    , relative to the base URL of your deployed site.
                  </p>
                </div>
              </div>
            </div>
            {/* Step 6 */}
            <div data-aos="fade-left">
              <div className="bg-gray-900 p-6 rounded-xl shadow-md flex gap-6 items-start">
                <div className="text-5xl font-bold text-[#0d7a68]">6 </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white">
                    Push to Git to deploy!
                  </h2>
                  <p className="text-gray-400">
                    When done, you can invoke your function at{" "}
                    <code className="bg-gray-800 text-white px-2 py-0.5 rounded font-mono text-sm">
                      /.netlify/functions/FUNCTION-NAME
                    </code>
                    , relative to the base URL of your deployed site.
                  </p>
                </div>

                {/* <div data-aos="zoom-in-right">
            <Image
            isBlurred
            className="rounded-lg md:block"
            src="/c919/106.png"
            alt="Omellet's Logo"
            width={500}
          
            
          />
          </div> */}
              </div>
            </div>
            {/* Step 7 */}
            <div data-aos="fade-right">
              <div className="bg-gray-900 p-6 rounded-xl shadow-md flex gap-6 items-start">
                <div className="text-5xl font-bold text-[#0d7a68]">7</div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white">
                    Push to Git to deploy!
                  </h2>
                  <p className="text-gray-400">
                    When done, you can invoke your function at{" "}
                    <code className="bg-gray-800 text-white px-2 py-0.5 rounded font-mono text-sm">
                      /.netlify/functions/FUNCTION-NAME
                    </code>
                    , relative to the base URL of your deployed site.
                  </p>
                </div>
              </div>
            </div>
            {/* Step 8 */}
            <div data-aos="fade-left">
              <div className="bg-gray-900 p-6 rounded-xl shadow-md flex gap-6 items-start">
                <div className="text-5xl font-bold text-[#0d7a68]">8</div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white">
                    Push to Git to deploy!
                  </h2>
                  <p className="text-gray-400">
                    When done, you can invoke your function at{" "}
                    <code className="bg-gray-800 text-white px-2 py-0.5 rounded font-mono text-sm">
                      /.netlify/functions/FUNCTION-NAME
                    </code>
                    , relative to the base URL of your deployed site.
                  </p>
                </div>
              </div>
            </div>
            {/* Step 9 */}
            <div data-aos="fade-right">
              <div className="bg-gray-900 p-6 rounded-xl shadow-md flex gap-6 items-start">
                <div className="text-5xl font-bold text-[#0d7a68]">9</div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white">
                    Push to Git to deploy!
                  </h2>
                  <p className="text-gray-400">
                    When done, you can invoke your function at{" "}
                    <code className="bg-gray-800 text-white px-2 py-0.5 rounded font-mono text-sm">
                      /.netlify/functions/FUNCTION-NAME
                    </code>
                    , relative to the base URL of your deployed site.
                  </p>
                </div>
              </div>
            </div>
            {/* Step 10 */}
            <div data-aos="fade-left">
              <div className="bg-gray-900 p-6 rounded-xl shadow-md flex gap-6 items-start">
                <div className="text-5xl font-bold text-[#0d7a68]">10</div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white">
                    Push to Git to deploy!
                  </h2>
                  <p className="text-gray-400">
                    When done, you can invoke your function at{" "}
                    <code className="bg-gray-800 text-white px-2 py-0.5 rounded font-mono text-sm">
                      /.netlify/functions/FUNCTION-NAME
                    </code>
                    , relative to the base URL of your deployed site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}

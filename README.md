# Vite & HeroUI Template

This is a template for creating applications using Vite and HeroUI (v2).

[Try it on CodeSandbox](https://githubbox.com/frontio-ai/vite-template)

## Technologies Used

- [Vite](https://vitejs.dev/guide/)
- [HeroUI](https://heroui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)

## How to Use

To clone the project, run the following command:

```bash
git clone https://github.com/frontio-ai/vite-template.git
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/frontio-ai/vite-template/blob/main/LICENSE).


npm run build


netlify deploy --prod


import { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "@heroui/image"; // If using HeroUI

export default function Loading() {
  const [loaded, setLoaded] = useState(false);
import { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "@heroui/image";

export default function Loading() {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center h-screen "
    >
      <div className="relative w-60 h-60 flex items-center justify-center">
        {/* Circular spinning border */}
        <motion.div
          className="absolute w-full h-full rounded-full border-4 border-green-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
        />

        {/* Zooming logo inside */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
          className="z-10"
        >
          {!loaded && <span className="text-gray-500">Loading...</span>}
          <Image
            isBlurred
            alt="Omelette's Logo"
            src="/image/logo-r-g1.png"
            width={160}
            onLoad={() => setLoaded(true)}
            className={`${loaded ? "block" : "hidden"} w-32 h-32`}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
    


    get post tosheet <!DOCTYPE html>
<html>
<head>
  <title>Data Input and Display</title>
</head>
<body>
  <h1>Enter Your Information</h1>
  <form id="myForm" method="post" action="https://script.google.com/macros/s/AKfycbw6sfA7oCtFd2dT26OT-Lv9TQCp6LjAJGVwHpU4CUuUhAsoFG9KdJ3n7DfL2_oQaMSJOQ/exec">
  
  <div>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
  </div>
  <div>
    <label for="phone">Phone:</label>
    <input type="tel" id="phone" name="phone">
  </div>
  <div>
    <label for="province">Province:</label>
    <input type="text" id="province" name="province">
  </div>
  <div>
    <label for="district">District:</label>
    <input type="text" id="district" name="district">
  </div>
  <div>
    <label for="village">Village:</label>
    <input type="text" id="village" name="village">
  </div>
  <div>
    <label for="logistic_unit">Shal Unit:</label>
    <input type="text" id="logistic_unit" name="logistic_unit">
  </div>
  <button type="submit">Submit</button>
</form>
    

  <div id="status"></div>

  <h2>Data from Google Sheet</h2>
  <div id="dataDisplay"></div>

  <script>
    const form = document.getElementById('myForm');
    const statusDiv = document.getElementById('status');
    const dataDisplayDiv = document.getElementById('dataDisplay');
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbw6sfA7oCtFd2dT26OT-Lv9TQCp6LjAJGVwHpU4CUuUhAsoFG9KdJ3n7DfL2_oQaMSJOQ/exec'; // Make sure this is your Web App URL

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
      })
      .then(response => response.text())
      .then(data => {
        statusDiv.textContent = data;
        form.reset();
        fetchData(); // Refresh the displayed data after submission
      })
      .catch(error => {
        statusDiv.textContent = 'Error submitting data.';
        console.error('Error:', error);
      });
    });

    function fetchData() {
      fetch(webAppUrl) // Default method is GET
        .then(response => response.json())
        .then(data => {
          displayData(data);
        })
        .catch(error => {
          dataDisplayDiv.textContent = 'Error fetching data.';
          console.error('Error:', error);
        });
    }

    function displayData(data) {
      let html = '<table><thead><tr>';
      if (data.length > 0) {
        // Create table headers from the keys of the first object
        for (const key in data[0]) {
          html += `<th>${key}</th>`;
        }
        html += '</tr></thead><tbody>';

        // Create table rows from the data
        data.forEach(item => {
          html += '<tr>';
          for (const key in item) {
            html += `<td>${item[key]}</td>`;
          }
          html += '</tr>';
        });
        html += '</tbody></table>';
      } else {
        html = '<p>No data available.</p>';
      }
      dataDisplayDiv.innerHTML = html;
    }

    // Fetch data when the page loads
    fetchData();
  </script>
</body>
</html>


 <div className="relative w-full h-[400px] md:h-[400px] lg:h-[600px] rounded-lg overflow-hidden">

        {/* Background image */}
        <img
          alt="Sky Background"
          src="/image/30.png"
          className="absolute inset-0 w-full h-full object-cover dark:hidden"
        />

        <img
          alt="Dark Mode Background"
          src="/image/31.png"
          className="absolute inset-0 w-full h-full object-cover hidden dark:block"
        />

        {/* Centered Plane image */}
        <div className="relative z-10 flex h-full w-full items-center justify-center" data-aos="fade-right" data-aos-delay="200" data-aos-duration="1200">
          <img

            alt="C919 Flying"
            src={
              i18n.language === "la"
                ? "/c919/109.png"
                : i18n.language === "en"
                  ? "/c919/105.png"
                  : i18n.language === "zh"
                    ? "/c919/104.png"
                    : i18n.language === "th"
                      ? "/c919/107.png"
                      : i18n.language === "jp"
                        ? "/c919/113.png"
                        : i18n.language === "vi"
                          ? "/c919/108.png"
                          : "/c919/110.png"
            }
            className={`w-auto h-auto transition-transform duration-500 hover:scale-105 z-10 
        
        ${i18n.language === "la"
                ? "max-w-[70%] md:max-w-[85%] lg:max-w-[90%]"
                : "max-w-[90%]"

              }`
            }

          />
        </div>
      </div>
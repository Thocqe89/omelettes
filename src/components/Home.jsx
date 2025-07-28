import React, { useState } from 'react';
import './App.css'; // optional for extra styles

const products = [
  { name: 'Passenger Plane', category: 'Boeing', image: '/images/boeing.jpg' },
  { name: 'Fighter Jet', category: 'F-16', image: '/images/f16.jpg' },
  { name: 'Helicopter', category: 'Apache', image: '/images/helicopter.jpg' },
];

function Homeing() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Omelettes ✈️</h1>
        <p className="text-sm text-gray-500">Find your dream aircraft</p>
      </header>

      {/* Category Buttons */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Categories</h2>
        <div className="flex gap-2 overflow-x-auto">
          {['Boeing', 'Fighter Jet', 'Helicopter'].map((cat) => (
            <button
              key={cat}
              className="rounded-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Aircraft</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow hover:shadow-md transition p-4 flex flex-col items-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-xl mb-3"
              />
              <h3 className="font-medium text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
              <button
                className="mt-3 w-full bg-blue-500 text-white rounded py-2"
                onClick={() => setShowPopup(true)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-md w-11/12 max-w-md">
            <h3 className="text-lg font-bold mb-2">Product Details</h3>
            <p className="text-sm text-gray-600 mb-4">More info coming soon.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-gray-800 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Homeing;

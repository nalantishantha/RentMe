"use client";

import { useEffect, useState } from 'react';
import { propertyApi } from '@/lib/api';

interface Seller {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface Property {
  id: number;
  title: string;
  description: string;
  type: string;
  address: string;
  city: string;
  price_per_month: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  furnished: boolean;
  available_from: string;
  created_at: string;
  seller: Seller;
}

export default function BrowsePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyApi.getAllProperties();
      setProperties(response.data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow container mx-auto px-6 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Loading properties...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Browse Properties</h1>
          <p className="text-gray-600">Discover your perfect rental home</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties available</h3>
            <p className="text-gray-500">Check back later for new listings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <svg
                    className="h-20 w-20 text-white opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                      {property.title}
                    </h3>
                    <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-medium uppercase">
                      {property.type}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {property.description || 'No description provided'}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-700 text-sm">
                      <svg
                        className="h-4 w-4 mr-2 text-slate-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="line-clamp-1">{property.city || 'Location not specified'}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-700">
                        <svg
                          className="h-4 w-4 mr-1 text-slate-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        {property.bedrooms} BD
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg
                          className="h-4 w-4 mr-1 text-slate-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {property.bathrooms} BA
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg
                          className="h-4 w-4 mr-1 text-slate-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                          />
                        </svg>
                        {property.area_sqm} m²
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-slate-800">
                          {property.currency} {property.price_per_month.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                      {property.furnished && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                          Furnished
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Available from: {formatDate(property.available_from)}
                    </p>
                  </div>

                  {/* Seller Contact Information */}
                  <div className="border-t pt-4 bg-slate-50 -mx-6 -mb-6 px-6 py-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Contact Seller</p>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-700">
                        <svg
                          className="h-4 w-4 mr-2 text-slate-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="font-medium">
                          {property.seller.firstName} {property.seller.lastName}
                        </span>
                      </div>
                      {property.seller.phone && (
                        <div className="flex items-center text-sm text-gray-700">
                          <svg
                            className="h-4 w-4 mr-2 text-slate-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <a 
                            href={`tel:${property.seller.phone}`}
                            className="font-medium hover:text-slate-800 hover:underline"
                          >
                            {property.seller.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-700">
                        <svg
                          className="h-4 w-4 mr-2 text-slate-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <a 
                          href={`mailto:${property.seller.email}`}
                          className="text-xs hover:text-slate-800 hover:underline truncate"
                        >
                          {property.seller.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

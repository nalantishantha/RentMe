import SellerNavbar from '@/components/SellerNavbar';
import Footer from '@/components/Footer';

export default function MyPropertiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800">My Properties</h1>
      </main>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { Card, Row, Col, Spin, Empty } from "antd";
// import { propertyApi } from "@/lib/api";
// import { useAuth } from "@/contexts/AuthContex";

// export default function MyPropertiesPage() {
//   const { token } = useAuth();
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProperties = async () => {
//       if (token) {
//         try {
//           const res = await propertyApi.getMyProperties(token);
//           setProperties(res.data);
//         } catch (error) {
//           setProperties([]);
//         }
//         setLoading(false);
//       }
//     };
//     fetchProperties();
//   }, [token]);

//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="container mx-auto px-6 py-12 flex-grow">
//         <h1 className="text-4xl font-bold text-gray-800 mb-8">My Properties</h1>
//         {loading ? (
//           <Spin size="large" />
//         ) : properties.length === 0 ? (
//           <Empty description="No properties found." />
//         ) : (
//           <Row gutter={[24, 24]}>
//             {properties.map(property => (
//               <Col xs={24} sm={12} md={8} lg={6} key={property.id}>
//                 <Card
//                   title={property.title}
//                   bordered={false}
//                   style={{ minHeight: 220 }}
//                 >
//                   <p><strong>Type:</strong> {property.type}</p>
//                   <p><strong>City:</strong> {property.city}</p>
//                   <p><strong>Price:</strong> {property.price_per_month} {property.currency}</p>
//                   <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
//                   <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
//                   <p><strong>Furnished:</strong> {property.furnished ? "Yes" : "No"}</p>
//                   <p><strong>Description:</strong> {property.description}</p>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         )}
//       </main>
//     </div>
//   );
// }

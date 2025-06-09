import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import AdminNavBar from "../components/AdminNavBar";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats] = useState({
    totalUsers: 120,
    totalCertificates: 75,
    totalGalleryItems: 50,
  });

  const [recentActivities] = useState([
    { id: 1, activity: "New Certificate Added: 'Donation Certificate'", date: "2025-05-10" },
    { id: 2, activity: "New Gallery Item: 'Charity Event Photo'", date: "2025-05-09" },
    { id: 3, activity: "User Registered: 'John Doe'", date: "2025-05-08" },
    { id: 4, activity: "New Certificate Added: 'Fundraising Certificate'", date: "2025-05-07" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavBar />
      <div className="max-w-7xl mx-auto p-6">
      
    

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} />
          <StatCard title="Total Certificates" value={stats.totalCertificates} />
          <StatCard title="Total Gallery Items" value={stats.totalGalleryItems} />
        </div>

        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activities</h2>
          <ul className="divide-y divide-gray-200">
            {recentActivities.map((item) => (
              <li key={item.id} className="py-2 flex justify-between text-gray-600">
                <span>{item.activity}</span>
                <span className="text-sm text-gray-500">{item.date}</span>
              </li>
            ))}
          </ul>
        </div>

        
        
        </div>
      </div>
    
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow rounded-lg p-6 text-center">
    <h3 className="text-lg text-gray-700 font-medium mb-2">{title}</h3>
    <p className="text-3xl font-bold text-indigo-600">{value}</p>
  </div>
);

export default AdminDashboard;

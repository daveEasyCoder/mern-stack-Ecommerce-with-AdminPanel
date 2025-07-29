// AdminDashboard.jsx
import React from "react";
import {
  FiBox,
  FiUsers,
  FiTag,
  FiShoppingCart,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import axios from 'axios'
import { useState } from "react";
import { useEffect } from "react";
import { useEcommerce } from "../context/EcommerceContext";

const Analytics = () => {


    const {url} = useEcommerce()
    const [count,setCount] = useState(null)

    const getStatus = async () => {
      try {
        const res = await axios.get(`${url}/api/admin/get-status`,{withCredentials:true})
        if(res.data.success){
           console.log(res.data);
           setCount(res.data.count)
        }
      } catch (error) {
        console.log(error);
        
      }
    }


    useEffect(() => {
      getStatus()
    },[])

    const stats = [
    { label: "Total Products", value: count?.totalProduct, icon: FiBox, color: "text-blue-600" },
    { label: "Total Users", value: count?.totalUser, icon: FiUsers, color: "text-green-600" },
    { label: "Total Orders", value: count?.totalOrder, icon: FiShoppingCart, color: "text-yellow-600" },
    { label: "Total Revenue", value: count?.totalRevenue, icon: FiDollarSign, color: "text-emerald-600" },
    { label: "Completed Orders", value: count?.completedOrders, icon: FiCheckCircle, color: "text-teal-600" },
    { label: "Cancelled Orders", value: count?.cancelledOrder, icon: FiXCircle, color: "text-red-600" },
  ];

  // Data for Bar Chart
  const revenueData = [
    { name: "Jan", revenue: 7000 },
    { name: "Feb", revenue: 8000 },
    { name: "Mar", revenue: 12000 },
    { name: "Apr", revenue: 9500 },
    { name: "May", revenue: 11000 },
  ];

  // Data for Pie Chart
  const orderStatusData = [
    { name: "Completed", value: count?.completedOrders },
    { name: "Cancelled", value: count?.cancelledOrder },
    { name: "Pending", value: count?.pendingOrder },
  ];

  const COLORS = ["#10b981", "#ef4444", "#facc15"];
  
  return (
    <div className=" space-y-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow hover:shadow-md transition"
          >
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <div>
              <h4 className="text-gray-500 text-sm">{stat.label}</h4>
              <p className="text-xl font-semibold text-gray-800">
                {typeof stat.value === "number" && stat.label === "Total Revenue"
                  ? `$${stat.value.toLocaleString()}`
                  : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#60A5FA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Order Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

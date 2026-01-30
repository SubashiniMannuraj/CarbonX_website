import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        api.getOrders().then(data => setOrders(data));
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <h2 className="font-bold text-xl">Order History</h2>

            <div className="card p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="text-xs text-secondary uppercase bg-black/20">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Project</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Quantity</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {orders.map(o => (
                            <tr key={o.id} className="hover:bg-white/5">
                                <td className="p-4 text-sm font-mono text-secondary">{o.id}</td>
                                <td className="p-4 font-medium text-sm">{o.project_name}</td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${o.type === 'Buy' ? 'bg-green-900/30 text-green' : 'bg-red-900/30 text-red'}`}>
                                        {o.type}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-secondary">{new Date(o.date).toLocaleDateString()}</td>
                                <td className="p-4 text-sm">{o.quantity}</td>
                                <td className="p-4 text-sm">${o.price.toFixed(2)}</td>
                                <td className="p-4 text-sm font-bold">${o.total.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`flex items-center gap-1 text-xs font-semibold ${o.status === 'Completed' ? 'text-green' :
                                            o.status === 'Pending' ? 'text-yellow-500' : 'text-red'
                                        }`}>
                                        {o.status === 'Completed' && '✓'}
                                        {o.status === 'Pending' && '⏳'}
                                        {o.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;

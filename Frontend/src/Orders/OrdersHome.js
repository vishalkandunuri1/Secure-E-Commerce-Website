import React, { useState, useEffect } from 'react';
import getAllUserOrders from './GetAllUserOrders';
import getOrderCartItems from './GetOrderCartItems';
import './ViewOrder.css'
import '../Admin/Styles/Spinner.css'

const OrdersHome = ({ userEmail, authIdToken }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [showPopup, setShowPopup] = useState(false); 

    const fetchOrders = async () => {
        try {
            const userOrders = await getAllUserOrders(userEmail, authIdToken);
            const sortedOrders = userOrders.sort((a, b) => new Date(b.orderedOn) - new Date(a.orderedOn));
            setOrders(sortedOrders);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [userEmail]);

    const handleViewOrder = async (order) => {
        try {
            const items = await getOrderCartItems(order.items, authIdToken);
            setCartItems(items);
            console.log(items)
            setSelectedOrder(order)
            setShowPopup(true); 
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const closePopup = () => {
        setCartItems([]); 
        setShowPopup(false); 
    };

    if (loading) {
        return <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p style={{textAlign:'center'}}>Loading Orders...</p> 
                </div>;
    }

    if (error) {
        return <div style={{textAlign:'center'}}>Error: Failed to fetch Orders, please hit Fetch Order button or try after sometime.</div>;
    }

    const getStatusClass = (currentStatus, statusToCheck) => {
        const statusOrder = ['PLACED', 'INTRANSIT', 'DELIVERED'];
        const currentIndex = statusOrder.indexOf(currentStatus);
        const checkIndex = statusOrder.indexOf(statusToCheck);
        if (currentIndex > checkIndex) {
            return 'active completed'; 
        } else if (currentIndex === checkIndex) {
            return 'active'; 
        }
        return ''; 
    };


    const OrderStatus = ({ currentStatus }) => (
    <div className="status-container">
        {['PLACED', 'INTRANSIT', 'DELIVERED'].map((status, index) => (
        <div key={index} className={`status-dot ${getStatusClass(currentStatus, status)}`}>
            <span className="status-text">{status}</span>
        </div>
        ))}
    </div>
    );


    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>All My Orders</h2>
            <button style={{width:'auto'}} onClick={fetchOrders}>Fetch Orders</button>
            {orders.length === 0 ? (
                <div>No orders found at this time. Please try again after sometime.</div>
            ) : (
                <table style={{ margin: '20px' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Order ID</th>
                            <th style={tableHeaderStyle}>Order Status</th>
                            <th style={tableHeaderStyle}>Payment Status</th>
                            <th style={tableHeaderStyle}>Delivery Address</th>
                            <th style={tableHeaderStyle}>Ordered On</th>
                            <th style={tableHeaderStyle}>Total Price</th>
                            <th style={tableHeaderStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td style={tableCellStyle}>{order.id}</td>
                                <td style={tableCellStyle}>{order.status}</td>
                                <td style={tableCellStyle}>{order.paymentId ? 'SUCCESS' : 'NA'}</td>
                                <td style={tableCellStyle}>{order.orderAddress}</td>
                                <td style={tableCellStyle}>{order.orderedOn ? order.orderedOn.slice(0, 10) : 'NA'} (UTC)</td>
                                <td style={tableCellStyle}>${order.orderTotalPrice}</td>
                                <td style={tableCellStyle}>
                                    <button onClick={() => handleViewOrder(order)}>View Order</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={closePopup}>&times;</span>
                        <h3 style={{textAlign:'center', backgroundColor:'aqua'}}>Order Details</h3>
                        <div>
                            <p><strong>Order ID:</strong> {selectedOrder.id} <strong>Ordered On:</strong> {selectedOrder.orderedOn ? selectedOrder.orderedOn.slice(0, 10) + " (UTC)" : 'NA'}</p>
                            <div style={{margin:'20px'}}>
                                <p ><strong>Status:</strong></p>
                                <OrderStatus currentStatus={selectedOrder.status} />
                            </div >
                            <p style={{marginTop:'40px'}}><strong>Payment Status:</strong> {selectedOrder.paymentId ? 'SUCCESS' : 'NA'}</p>
                            <p><strong>Delivery Address:</strong> {selectedOrder.orderAddress}</p>
                        </div>
                        <div className="cart-items">
                            {cartItems? cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <div className="item-image">
                                <img src={item.product.imageUrls} style={{ width: '100px', height: '100px' }} alt="Item" />
                                </div>
                                <div className="item-details">
                                <div className="item-info">
                                    <span className="item-name" style={{ margin: '5px' }}>{item.product.name}</span>
                                </div>
                                <div className="item-quantity">
                                    <span>Quantity: {item.quantity}x</span>${item.product.price}
                                    <p>Total Price: <strong>${item.product.price * item.quantity}</strong></p>
                                </div>
                                </div>
                            </div>
                            )):""}
                        </div>
                        <div>
                            <p style={{textAlign:'end'}}><strong>Total Order Price:</strong> ${selectedOrder.orderTotalPrice}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const tableHeaderStyle = {
    border: '1px solid #ddd',
    background: 'pink',
    padding: '8px',
    textAlign: 'left',
};

const tableCellStyle = {
    border: '1px solid #ddd',
    background: 'white',
    padding: '8px',
};

export default OrdersHome;


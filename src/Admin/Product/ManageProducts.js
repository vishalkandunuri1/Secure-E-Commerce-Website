import React, { useState, useEffect } from "react";
import configDetails from "../../Config/Config";
import '../Styles/InventoryStyles.css';
import AddProduct from "./AddProduct";
import EditProduct from "./EdictProduct"
import AllCategories from "./AllCategories";
import AllManufacturers from "./AllManufacturers";
import AllSubcategories from "./AllSubCategories";
import '../Styles/Spinner.css'

const ManageProducts = ({authIdToken, userEmail}) => {
    const [allProducts, setAllProducts] = useState([]);
    const [isAddProductPopupOpen, setIsAddProductPopupOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [allCategories, setAllCategories] = useState([]);
    const [allManufacturers, setAllManufacturers] = useState([]);
    const [allSubcategories, setAllSubcategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllProducts();
        fetchAllCategories();
        fetchAllManufacturers();
        fetchAllSubcategories();
    }, []);

    const fetchAllProducts = async () => {
        try {
            setIsLoading(true);
            const api = `${configDetails.baseUrl}${configDetails.allProducts}`;
            const response = await fetch(api, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authIdToken
                }
            });
            const productsData = await response.json();
            const sortedProducts = productsData.sort((a, b) => new Date(b.addedOn) - new Date(a.addedOn));
            setAllProducts(sortedProducts);
            setError(null);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllCategories = async () => {
        try {
            const url = `${configDetails.baseUrl}${configDetails.allCategories}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':authIdToken
                }
            });
            const categoriesData = await response.json();
            setAllCategories(categoriesData);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const fetchAllManufacturers = async () => {
        try {
            const url = `${configDetails.baseUrl}${configDetails.allManufacturers}`;  
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':authIdToken
                }
            });
            const ManufacturersData = await response.json();
            setAllManufacturers(ManufacturersData);
        } catch (error) {
            console.error("Failed to fetch manufacturers:", error);
        }
    };

    const fetchAllSubcategories = async () => {
        try {
            const url = `${configDetails.baseUrl}${configDetails.allSubCategories}`;  
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':authIdToken
                }
            });
            const subCategoriesData = await response.json();
            setAllSubcategories(subCategoriesData);
        } catch (error) {
            console.error("Failed to fetch subcategories:", error);
        }
    };

    const openAddProductPopup = () => {
        setIsAddProductPopupOpen(true);
    };

    const closeAddProductPopup = () => {
        fetchAllProducts();
        setIsAddProductPopupOpen(false);
    };

    const openEditProductPopup = (product) => {
        setEditProduct(product);
    };

    const closeEditProductPopup = () => {
        setEditProduct(null);
        fetchAllProducts();
    };

    if (isLoading) {
        return <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p style={{textAlign:'center'}}>Loading Products...</p> 
                </div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center' }}>Error: Failed to fetch products, please try again later.</div>;
    }

    return (
        <div style={{ width: 'calc(100% - 40px)' }}>
            <div style={{ textAlign: "center" }}>
                <h1>Manage Products</h1>
                <button onClick={fetchAllProducts} style={{width:'auto', backgroundColor:'aqua'}}>Fetch Products</button>
                <button onClick={openAddProductPopup} style={{width:'auto', backgroundColor:'ButtonHighlight'}}>Add New Product</button>
            </div>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead className="tableHeaderStyle">
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Product</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Product Name</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Category</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Manufacturer</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Price</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Available</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Action</th>
                    </tr>
                </thead>
                <tbody className="tableBodyStyle">
                    {allProducts.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center", border: '1px solid black', padding: '8px' }}>No products found.</td>
                        </tr>
                    ) : (
                        allProducts.map((product, index) => (
                            <tr key={product.id} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#ffffff' }}>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    {product.imageUrls ? (
                                        <img src={product.imageUrls} alt="Product" style={{ width: '200px', height: '200px' }} />
                                    ) : (
                                        <img src="https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png" alt="No Image" style={{ width: '200px', height: '200px' }} />
                                    )}
                                </td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    {product.name}
                                    <p><strong>Description:</strong><span style={{color:'blue'}}>{product.description}</span></p>
                                </td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    {product.category}/{product.subcategory}
                                </td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{product.manufacturer}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>$<strong>{product.price}</strong></td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{product.quantityAvailable}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    <button onClick={() => openEditProductPopup(product)}>Edit</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {isAddProductPopupOpen && <AddProduct onClose={closeAddProductPopup} authIdToken={authIdToken} />}
            {editProduct && <EditProduct product={editProduct} onClose={closeEditProductPopup} authIdToken={authIdToken} />}
        </div>
    );
}

export default ManageProducts;

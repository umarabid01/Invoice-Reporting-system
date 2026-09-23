import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./AddData.css"

function AddData() {

    const navigate = useNavigate();

    // =========================
    // CUSTOMER STATES
    // =========================

    const [customerName, setCustomerName] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");

    // =========================
    // ITEM STATES
    // =========================

    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");

    // =========================
    // TAX STATES
    // =========================

    const [taxPercentage, setTaxPercentage] = useState("");


    // =========================
    // ADD CUSTOMER
    // =========================

    const addCustomer = async () => {

        if (!customerName || !customerAddress) {
            alert("Please enter customer name and address");
            return;
        }

        try {

            await api.post(
                "/customer",
                {
                    customer_name: customerName,
                    customer_address: customerAddress
                }
            );

            alert("Customer Added Successfully");

            setCustomerName("");
            setCustomerAddress("");

        } catch (err) {

            console.log(err);

            alert("Error while adding customer");
        }
    };


    // =========================
    // ADD ITEM
    // =========================

    const addItem = async () => {

        if (!itemName || !itemPrice) {
            alert("Please enter item name and price");
            return;
        }

        try {

            await api.post(
                "/item",
                {
                    item_name: itemName,
                    item_price: Number(itemPrice),

                    // Your backend requires item_code
                    // If your database allows NULL, this is fine
                    item_code: ""
                }
            );

            alert("Item Added Successfully");

            setItemName("");
            setItemPrice("");

        } catch (err) {

            console.log(err);

            alert("Error while adding item");
        }
    };


    // =========================
    // ADD TAX
    // =========================

    const addTax = async () => {

        if (!taxPercentage) {
            alert("Please enter tax percentage");
            return;
        }

        try {

            await api.post(
                "/tax",
                {
                    s_tax_percentage: Number(taxPercentage)
                }
            );

            alert("Sales Tax Added Successfully");

            setTaxPercentage("");

        } catch (err) {

            console.log(err);

            alert("Error while adding tax");
        }
    };


    return (

        <div className="page-container">

            {/* ================= HEADER ================= */}

            <div className="page-header">

                <div>
                    <h1>Invoice Management System</h1>
                </div>


                <div className="navigation-buttons">

                    <button id="geninv"
                        onClick={() => navigate("/invoice")}
                    >
                        Generate Invoice
                    </button>


                    <button
                        onClick={() => navigate("/report")}
                    >
                        Generate Report
                    </button>

                </div>

            </div>


            {/* ================= DATA GRID ================= */}

            <div className="data-grid">


                {/* ================= CUSTOMER ================= */}

                <div className="data-card">

                    <h2>Customer</h2>


                    <input
                        type="text"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) =>
                            setCustomerName(e.target.value)
                        }
                    />


                    <input
                        type="text"
                        placeholder="Customer Address"
                        value={customerAddress}
                        onChange={(e) =>
                            setCustomerAddress(e.target.value)
                        }
                    />


                    <button onClick={addCustomer}>
                        Add Customer
                    </button>

                </div>


                {/* ================= ITEM ================= */}

                <div className="data-card">

                    <h2>Item</h2>


                    <input
                        type="text"
                        placeholder="Item Name"
                        value={itemName}
                        onChange={(e) =>
                            setItemName(e.target.value)
                        }
                    />


                    <input
                        type="number"
                        placeholder="Item Price"
                        value={itemPrice}
                        onChange={(e) =>
                            setItemPrice(e.target.value)
                        }
                    />


                    <button onClick={addItem}>
                        Add Item
                    </button>

                </div>


                {/* ================= TAX ================= */}

                <div className="data-card">

                    <h2>Sales Tax</h2>


                    <input
                        type="number"
                        placeholder="Tax Percentage"
                        value={taxPercentage}
                        onChange={(e) =>
                            setTaxPercentage(e.target.value)
                        }
                    />


                    <button onClick={addTax}>
                        Add Sales Tax
                    </button>

                </div>

            </div>

        </div>

    );
}

export default AddData;
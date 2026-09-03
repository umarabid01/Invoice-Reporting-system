import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Invoice.css";

function Invoice() {

const navigate = useNavigate();

const [customer, setCustomer] = useState([]);
const [customer_id, setCustomer_Id] = useState(0);
const [date, setDate] = useState("");

const [item, setItem] = useState([]);
const [tax, setTax] = useState([]);

const [submit, setSubmit] = useState(false);

const [invoiceDetail, setInvoiceDetail] = useState([
{
item_id: 0,
tax_id: 0,
quantity: 0,
rate: 0,
discount: 0,
amount: 0
}
]);

const getItem = async () => {
try {


  const result = await axios.get(
    "http://localhost:5000/item"
  );

  setItem(result.data);

} catch (error) {

  console.log("Error while getting items", error);

}


};

const getTax = async () => {
try {


  const result = await axios.get(
    "http://localhost:5000/tax"
  );

  setTax(result.data);

} catch (error) {

  console.log("Error while getting tax", error);

}


};

const getCustomer = async () => {
try {


  const result = await axios.get(
    "http://localhost:5000/customer"
  );

  setCustomer(result.data);

} catch (error) {

  console.log("Error while getting customers", error);

}

};

useEffect(() => {

getCustomer();
getItem();
getTax();

}, []);

const postdata = async () => {


if (
  customer_id !== 0 &&
  customer_id !== "" &&
  date !== ""
) {

  const filledrows = invoiceDetail.every((row) => {

    return (
      Number(row.amount) > 0 &&
      Number(row.item_id) > 0 &&
      Number(row.quantity) > 0 &&
      Number(row.rate) > 0 &&
      Number(row.tax_id) > 0 &&
      Number(row.discount) >= 0
    );

  });


  if (filledrows) {

    try {

      setSubmit(true);

      const invoice_res = await axios.post(
        "http://localhost:5000/invoice",
        {
          customer_id,
          date
        }
      );


      const finalid = invoice_res.data.invoice_id;


      const invoicedata = invoiceDetail.map((row) => ({
        ...row,
        invoice_id: finalid
      }));


      await axios.post(
        "http://localhost:5000/invoicedetail",
        invoicedata
      );


      alert("Invoice saved successfully");

    } catch (error) {

      console.log("Error while saving invoice", error);

      setSubmit(false);

      alert("Error while saving invoice");

    }

  } else {

    alert("Fill all item details correctly first!");

  }

} else {

  alert("Select customer and date first");

}


};

const handleChange = (index, field, value) => {

const data = [...invoiceDetail];

data[index][field] = value;


const quan = Number(data[index].quantity);
const rat = Number(data[index].rate);
const disc = Number(data[index].discount);


const selectedTax = tax.find(
  (t) =>
    Number(t.s_tax_id) ===
    Number(data[index].tax_id)
);


const taxPercent = selectedTax
  ? Number(selectedTax.s_tax_percentage)
  : 0;


const subtotal = quan * rat;

const discountAmount = subtotal - disc;

const taxAmount =
  subtotal * (taxPercent / 100);


data[index].amount =
  discountAmount + taxAmount;


setInvoiceDetail(data);

};

const addMore = (index) => {

const newrow = {
  item_id: 0,
  quantity: 0,
  rate: 0,
  amount: 0,
  tax_id: 0,
  discount: 0
};


const data = [];

for (
  let i = 0;
  i < invoiceDetail.length;
  i++
) {

  data.push(invoiceDetail[i]);

  if (i === index) {
    data.push(newrow);
  }

}
setInvoiceDetail(data);

};

const deleteRow = (index) => {

const data =
  invoiceDetail.filter(
    (row, i) => i !== index
  );

setInvoiceDetail(data);

};

const totalAmount =
invoiceDetail.reduce(
(total, row) =>
total + Number(row.amount),
0
);

const printInvoice = () => {


const doc = new jsPDF();


const selectedCustomer =
  customer.find(
    (cus) =>
      Number(cus.customer_id) ===
      Number(customer_id)
  );


doc.setFontSize(20);

doc.text(
  "INVOICE",
  105,
  20,
  {
    align: "center"
  }
);


doc.setFontSize(11);


doc.text(
  `Customer: ${
    selectedCustomer?.customer_name || ""
  }`,
  20,
  35
);


doc.text(
  `Date: ${date}`,
  20,
  42
);


const rows =
  invoiceDetail.map(
    (row, index) => {

      const selectedItem =
        item.find(
          (itm) =>
            Number(itm.item_id) ===
            Number(row.item_id)
        );


      const selectedTax =
        tax.find(
          (tx) =>
            Number(tx.s_tax_id) ===
            Number(row.tax_id)
        );


      return [
        index + 1,
        selectedItem?.item_name || "",
        row.quantity,
        row.rate,
        row.discount,
        `${
          selectedTax?.s_tax_percentage || 0
        }%`,
        row.amount
      ];

    }
  );


autoTable(doc, {

  startY: 55,

  head: [
    [
      "#",
      "Item",
      "Quantity",
      "Rate",
      "Discount",
      "Tax",
      "Amount"
    ]
  ],

  body: rows,

  theme: "grid",

  headStyles: {
    fillColor: [52, 73, 94],
    textColor: 255
  },

  styles: {
    fontSize: 10,
    cellPadding: 3
  }

});


doc.setFontSize(12);

doc.setFont(
  "helvetica",
  "bold"
);


doc.text(
  `Total Amount: ${totalAmount.toLocaleString(
    "en-US"
  )}`,

  190,

  doc.lastAutoTable.finalY + 15,

  {
    align: "right"
  }
);


doc.save("invoice.pdf");


};

return (


<div className="page-container">


  <div className="page-header">
      <div id="header">
        <h2>Sales Invoice</h2>
</div>


    <div className="navigation-buttons">

      <button
        onClick={() =>
          navigate("/add-data")
        }
      >
        Add Data
      </button>


      <button
        onClick={() =>
          navigate("/report")
        }
      >
        Generate Report
      </button>

    </div>

  </div>


  <div className="content-card">


    <div id="invoice">


      <div className="customerdiv">

        <div className="subcustomerdiv">


          <label>
            Select Customer:
          </label>


          <select
            disabled={submit}
            value={customer_id}
            onChange={(e) =>
              setCustomer_Id(
                e.target.value
              )
            }
          >

            <option value="0">
              -- Select Customer --
            </option>


            {customer.map((cus) => (

              <option
                key={cus.customer_id}
                value={cus.customer_id}
              >
                {cus.customer_name}
              </option>

            ))}

          </select>


          <label>
            Select Date:
          </label>


          <input
            disabled={submit}
            type="date"
            max={
              new Date()
                .toLocaleDateString(
                  "en-CA"
                )
            }
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

        </div>

      </div>


      <div className="itemdiv">


        {invoiceDetail.map(
          (row, index) => (

            <div
              key={index}
              className="invoice-row"
            >


              <div className="subitemdiv">


                <label>
                  Select Item:
                </label>


                <select
                  disabled={submit}
                  value={row.item_id}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "item_id",
                      e.target.value
                    )
                  }
                >

                  <option value="0">
                    -- Select Item --
                  </option>


                  {item.map((itm) => (

                    <option
                      key={itm.item_id}
                      value={itm.item_id}
                    >
                      {itm.item_name}
                    </option>

                  ))}

                </select>


                <label>
                  Quantity:
                </label>


                <input
                  disabled={submit}
                  value={
                    row.quantity === 0
                      ? ""
                      : row.quantity
                  }
                  step="0.01"
                  placeholder="0"
                  type="number"
                  onChange={(e) =>
                    handleChange(
                      index,
                      "quantity",
                      e.target.value
                    )
                  }
                />


                <label>
                  Rate:
                </label>


                <input
                  disabled={submit}
                  value={
                    row.rate === 0
                      ? ""
                      : row.rate
                  }
                  step="0.01"
                  placeholder="0"
                  type="number"
                  onChange={(e) =>
                    handleChange(
                      index,
                      "rate",
                      e.target.value
                    )
                  }
                />


                <label>
                  Sales Tax:
                </label>


                <select
                  disabled={submit}
                  value={row.tax_id}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "tax_id",
                      e.target.value
                    )
                  }
                >

                  <option value="0">
                    -- Select Tax --
                  </option>


                  {tax.map((tx) => (

                    <option
                      key={tx.s_tax_id}
                      value={tx.s_tax_id}
                    >
                      {tx.s_tax_percentage}%
                    </option>

                  ))}

                </select>


                <label>
                  Discount:
                </label>


                <input
                  disabled={submit}
                  value={
                    row.discount === 0
                      ? ""
                      : row.discount
                  }
                  placeholder="0"
                  type="number"
                  onChange={(e) =>
                    handleChange(
                      index,
                      "discount",
                      e.target.value
                    )
                  }
                />


                <label>
                  Amount:
                </label>


                <input
                  disabled
                  value={
                    Math.max(
                      0,
                      Number(row.amount)
                    ).toLocaleString(
                      "en-US"
                    )
                  }
                  type="text"
                  readOnly
                />


              </div>


              <div className="row-buttons">

                <button
                  disabled={submit}
                  type="button"
                  onClick={() =>
                    addMore(index)
                  }
                >
                  More +
                </button>


                {index > 0 && (

                  <button
                    disabled={submit}
                    type="button"
                    onClick={() =>
                      deleteRow(index)
                    }
                  >
                    Delete
                  </button>

                )}

              </div>


            </div>

          )
        )}


      </div>


      <div className="lastbtn">

        <button
          disabled={submit}
          type="button"
          onClick={postdata}
        >
          Save Invoice
        </button>

      </div>


      <div className="total-amount">

        <h3>

          Total Amount:{" "}

          {Math.max(
            0,
            Number(totalAmount)
          ).toLocaleString(
            "en-US"
          )}

        </h3>

      </div>


    </div>


    {submit && (

      <button
        id="btn-print"
        type="button"
        onClick={printInvoice}
      >
        Generate PDF Invoice
      </button>

    )}


  </div>


</div>

);

}

export default Invoice;

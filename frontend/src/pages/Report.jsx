import React, {useEffect, useState } from 'react'
import api from '../api'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import Select from "react-select"
import Switch from "react-switch"
import { useNavigate } from "react-router-dom";
import "./Report.css"

function Report() {
    const navigate = useNavigate();

    const[customer,setCustomer]=useState([])
    const[customerid,setCustomerId]=useState([])
    const[date1,setDate1]=useState('')
    const[date2,setDate2]=useState('')
    const[item,setItem]=useState([])
    const[itemid,setItemId]=useState([])
const[radiovalue,setRadioValue]=useState('all')
    const[alldetails,setAllDetails]=useState([])

    const[currentpage,setCurrentPage]=useState(1)
    const[rowsperpage,setRowsPerPage]=useState(15)

    const indexLastRow=currentpage *rowsperpage
    const indexFirstRow =indexLastRow-rowsperpage 
    const currentShowingRows=alldetails.slice(indexFirstRow,indexLastRow)
    const totalPages=Math.ceil(alldetails.length/rowsperpage)
    // const totalPages=5

    console.log("showing the rowsperpage ",rowsperpage)
    console.log("showing the Firstrow index ",indexFirstRow)
    console.log("showing the current rows ",currentShowingRows)
    console.log("showing the totalpages",totalPages)

    const getItem=async()=>{
        try{
            const result =await api.get('/item')
            // const result =await axios.get('https://report-app-one-khaki.vercel.app/item')
            setItem(result.data)
            console.log("done fetch item")
        }
        catch{
console.log("error fetch the items")
        }

    }
    const getCustomer=async()=>{
        try{
            console.log("trying to fetch customer")
            const result=await api.get('/customer')
            // const result=await axios.get('https://report-app-one-khaki.vercel.app/customer')
            setCustomer(result.data)
console.log("success fetch customer")
        }
        catch{
            console.log("ERROR to fetch customer")

        }
    }
const downloadExcel=()=>{

  const customerNames=customerid.map(id=>customer.find(c =>c.customer_id===id)?.customer_name).join(",")
  const itemNames=itemid.map(id=>item.find(i=>i.item_id===id)?.item_name).join(",")

  const worksheet=XLSX.utils.aoa_to_sheet([
    ["Invoice Details Report"],
    [],
    ["From:", date1],
    ["To:", date2],
    ["Customers:", customerNames],
    ["Items:", itemNames],
    ["Filter:", radiovalue],
    []
  ])

  XLSX.utils.sheet_add_dom(worksheet,document.getElementById("printtable"),{ origin: "A9" })
  const workbook =XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook,worksheet,"Report")
  XLSX.writeFile(workbook,"Invoice_Report.xlsx")
};

let j=indexFirstRow+1;
const downloadPDF=()=>
{
  const doc=new jsPDF('l','mm','a4')
  
  const headers=[["No.","Invoice Date","Customer Name","Item Name", "Rate", "Quantity","Tax Amount","Discount","Total Amount"]]
  const rows1=currentShowingRows.map(detail=>[
    j++,
    new Date(detail.invoice_date).toLocaleDateString(),
    detail.customer_name,
    detail.item_name,
    Number(detail.invoice_detail_rate).toFixed(2),
    Number(detail.invoice_detail_quantity).toFixed(2),
    Number(detail.tax_amount).toFixed(2),
    Number(detail.invoice_detail_discount).toFixed(2),
    Number(detail.final_total).toFixed(2)
  ]);
  
const totalQty=currentShowingRows.reduce((sum,item)=> sum+Number(item.invoice_detail_quantity ||0),0).toFixed(2);
const totalTax=currentShowingRows.reduce((sum,item)=>sum+Number(item.tax_amount||0),0).toFixed(2);
const totalDisc=currentShowingRows.reduce((sum,item)=>sum+Number(item.invoice_detail_discount||0), 0).toFixed(2);
const totalFinal=currentShowingRows.reduce((sum,item)=>sum+ Number(item.final_total||0),0).toFixed(2);

    rows1.push([{content:"Grand Total",styles:{fontStyle:"bold"}},"","","","",{content:totalQty,styles:{fontStyle:"bold"}},{content:totalTax,styles:{fontStyle:"bold"}},{content:totalDisc,styles:{fontStyle:"bold"}},{content:totalFinal,styles:{fontStyle:"bold"}}]);

  doc.setFontSize(14);
doc.text("Invoice Details Report", 14, 15);


const customerNames=customerid.map(id=>customer.find(c=>c.customer_id===id)?.customer_name).join(", ");
const itemNames=itemid.map(id =>item.find(i=>i.item_id===id)?.item_name).join(", ");

doc.setFontSize(10);
doc.text(`From: ${date1}`, 14, 25);
doc.text(`To: ${date2}`, 70, 25);
doc.text(`Customers: ${customerNames}`, 14, 32);
doc.text(`Items: ${itemNames}`, 14, 39);
doc.text(`Filter: ${radiovalue}`, 14, 46);

autoTable(doc, {
head: headers,
body: rows1,
startY: 55
});
  doc.save("Invoice_Report.pdf");
};


console.log("this is the radio button value==",radiovalue);
const getAllDetails=async()=>{
if(customerid.length===0){
        alert("Select Customer");
        return }
if(itemid.length===0){
        alert("Select Item");
    return}

    if(date1===""||date2===""){
        alert("Select Dates");
        return;
    }
try{

const result = await api.post(
  '/alldetails',
    { customerid, itemid, date1, date2, radiovalue }
);
        setAllDetails(result.data);
        setCurrentPage(1)
    }catch(err){
        console.log(err);
    }
}
// console.log("")
useEffect(()=>{
    getCustomer()
    getItem()
   
},[])

// console.log("ths is customer ID",customerid)
// console.log("ths is item ID",itemid)    
// console.log("this is the date1:",date1)
// console.log("this is the date2:",date2)

let i=indexFirstRow+1;

const[isvisible,setIsVisible]=useState(true)
console.log("this is the visibility status",isvisible)

  return (
        <div className="page-container">

        <div id="header">
        <h2>Sales Report </h2>
</div>
  <div className="page-header">
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
          navigate("/Invoice")
        }
      >
        Generate Invoice
      </button>

    </div>

  </div>

<div id="toggle-btn">
<Switch checked={isvisible} onChange={setIsVisible} onColor="#2a9d8f"offColor="#d9d9d9"
  uncheckedIcon={false}checkedIcon={false} height={22} width={45}handleDiameter={20}/>
</div >

{ isvisible && ( <>
<label>From Date: </label>
      <input value={date1}type="date" onInput={(e)=>setDate1(e.target.value)}></input>  
      <label>To Date: </label>
      <input  value={date2}type="date" onInput={(e)=>setDate2(e.target.value)}></input><br></br><br></br>


{/* <label>Customer: </label>
        <select multiple value={customerid} onChange={(e)=>setCustomerId([...e.target.selectedOptions].map(option=>option.value))} >
        <option>--Select Name--</option>
      {customer.map((cus)=>(
        <option key={cus.customer_id}value={cus.customer_id}>{cus.customer_name}</option>
      ))}
      </select> */}
      

<div className="showcustomer">
<label id="customer-label">Customer: </label>
<Select id="customer-select"
isMulti
options={customer.map(c=>({ value:c.customer_id, label:c.customer_name}))}
onChange={(selected)=>setCustomerId(selected.map(x=>x.value))}
/>

<label id="item-label">Item: </label>
<Select id="item-select"
isMulti
options={item.map(i=>({ value:i.item_id, label:i.item_name}))}
onChange={(selected)=>setItemId(selected.map(x=>x.value))}
/>
</div>

<br></br><br></br>
      <label>Amount Filter: </label>
      <input type="radio"  name="radioselect" value="all" onChange={(e)=>setRadioValue(e.target.value)}></input>
      <label className="radiolabel">All</label>
      <input type="radio" name="radioselect" value="less"onChange={(e)=>setRadioValue(e.target.value)} ></input>
      <label className="radiolabel">Less then 1000</label>
      <input type="radio" name="radioselect" value="greater"onChange={(e)=>setRadioValue(e.target.value)} ></input>
      <label className="radiolabel">Greater then 1000</label>
      <br></br><br></br>
      </>)}
      
<div>
      <label >Rows: </label>
<select id ="rows-select"value={rowsperpage} onChange={(e)=>{setRowsPerPage(Number(e.target.value));setCurrentPage(1)}}>
    <option value={15}>Default</option>
    <option value={30}>30</option>
    <option value={50}>50</option>
    <option value={99999}>All</option>
    {/* <option value={50}>50</option> */}
</select>

<button id="back-btn" onClick={()=>
    {if(currentpage>1){setCurrentPage(currentpage-1)}}} disabled={currentpage===1}>&lt;
</button>
<span>showing {currentpage} of {totalPages}</span>
<button id="forward-btn" onClick={()=>
    {if(currentpage<totalPages){setCurrentPage(currentpage+1)}}} disabled={currentpage>=totalPages}> &gt;
</button>

<button id="find-btn" onClick={getAllDetails}>Find</button>
<button id="print-btn" onClick={downloadPDF}> Print PDF</button>
<button id="export-btn"onClick={downloadExcel}>Export Excel</button>
<br></br><br></br>
</div>
    <table id="printtable">
    <thead>
<tr>
    <th style={{width:'50px'}}>No.</th>
    <th>Invoice Date</th>
    <th>Customer Name</th>
    <th>Item Name</th>
    <th>Rate</th>
    <th>Quantity</th>
    <th>Tax Amount</th>
    <th>Discount</th>
    <th>Total Amount</th>
   
</tr>
</thead>
    <tbody>
{currentShowingRows.map((detail,index)=>(
<tr key={index}>
    <td >{i++}</td>
    <td>{new Date(detail.invoice_date).toLocaleDateString()}</td>
    <td>{detail.customer_name}</td>
    <td> { detail.item_name}</td>
    <td>{Number(detail.invoice_detail_rate).toFixed(2)}</td>
    <td>{Number(detail.invoice_detail_quantity).toFixed(2)}</td>
    <td>{ Number(detail.tax_amount).toFixed(2)}</td>
    <td>{Number(detail.invoice_detail_discount).toFixed(2)} </td>
    <td>{Number (detail.final_total).toFixed(2)}</td>
    
</tr>
))}
</tbody>
<tfoot>
  <tr>
    <td><strong>Grand Total</strong></td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td><strong>{currentShowingRows.reduce((sum, item) =>sum+ Number(item.invoice_detail_quantity||0),0).toFixed(2)}</strong></td>
    <td><strong>{currentShowingRows.reduce((sum,item)=>sum+Number(item.tax_amount ||0),0).toFixed(2)}</strong></td>
    <td><strong>{currentShowingRows.reduce((sum,item)=>sum+Number(item.invoice_detail_discount||0),0).toFixed(2)}</strong></td>
<td><strong>{currentShowingRows.reduce((sum,item)=>sum+Number(item.final_total||0),0).toFixed(2)}</strong></td>
</tr>
    </tfoot>

    </table>

    </div>
  )
  
}

export default Report

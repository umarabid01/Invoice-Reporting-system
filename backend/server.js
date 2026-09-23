import express from "express";
import cors from "cors";
import pool from "./db_config.js";

const app = express();

app.use(cors());
app.use(express.json());


// =====================================================
// HOME / DEPLOYMENT TEST
// =====================================================

app.get("/", (req, res) => {
    res.send("Backend is running");
});


// =====================================================
// CUSTOMER
// =====================================================

// GET all customers
app.get("/customer", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Customer"
        );

        res.json(result.rows);
    } catch (err) {
        console.log("Error while getting customers:", err);
        res.status(500).json({ error: err.message });
    }
});


// ADD customer
app.post("/customer", async (req, res) => {
    try {
        const { customer_name, customer_address } = req.body;

        await pool.query(
            `INSERT INTO Customer
             (customer_name, customer_address)
             VALUES ($1, $2)`,
            [customer_name, customer_address]
        );

        res.json({
            message: "Customer Added"
        });

    } catch (err) {
        console.log("Error while adding customer:", err);
        res.status(500).json({ error: err.message });
    }
});


// UPDATE customer
app.put("/customer/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const {
            customer_name,
            customer_address
        } = req.body;

        await pool.query(
            `UPDATE Customer
             SET customer_name = $1,
                 customer_address = $2
             WHERE customer_id = $3`,
            [customer_name, customer_address, id]
        );

        res.json({
            message: "Customer Updated"
        });

    } catch (err) {
        console.log("Error while updating customer:", err);
        res.status(500).json({ error: err.message });
    }
});


// DELETE customer
app.delete("/customer/:id", async (req, res) => {
    try {
        const id = req.params.id;

        await pool.query(
            "DELETE FROM Customer WHERE customer_id = $1",
            [id]
        );

        res.json({
            message: "Customer Deleted"
        });

    } catch (err) {
        console.log("Error while deleting customer:", err);
        res.status(500).json({ error: err.message });
    }
});


// =====================================================
// TAX
// =====================================================

// GET all taxes
app.get("/tax", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM S_Tax"
        );

        res.json(result.rows);

    } catch (err) {
        console.log("Error while getting tax:", err);
        res.status(500).json({ error: err.message });
    }
});


// ADD tax
app.post("/tax", async (req, res) => {
    try {
        const { s_tax_percentage } = req.body;

        await pool.query(
            `INSERT INTO S_Tax
             (s_tax_percentage)
             VALUES ($1)`,
            [s_tax_percentage]
        );

        res.json({
            message: "Tax Added"
        });

    } catch (err) {
        console.log("Error while adding tax:", err);
        res.status(500).json({ error: err.message });
    }
});


// UPDATE tax
app.put("/tax/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const { s_tax_percentage } = req.body;

        await pool.query(
            `UPDATE S_Tax
             SET s_tax_percentage = $1
             WHERE s_tax_id = $2`,
            [s_tax_percentage, id]
        );

        res.json({
            message: "Tax Updated"
        });

    } catch (err) {
        console.log("Error while updating tax:", err);
        res.status(500).json({ error: err.message });
    }
});


// DELETE tax
app.delete("/tax/:id", async (req, res) => {
    try {
        const id = req.params.id;

        await pool.query(
            "DELETE FROM S_Tax WHERE s_tax_id = $1",
            [id]
        );

        res.json({
            message: "Tax Deleted"
        });

    } catch (err) {
        console.log("Error while deleting tax:", err);
        res.status(500).json({ error: err.message });
    }
});


// =====================================================
// ITEM
// =====================================================

// GET all items
app.get("/item", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Item"
        );

        res.json(result.rows);

    } catch (err) {
        console.log("Error while getting items:", err);
        res.status(500).json({ error: err.message });
    }
});


// ADD item
app.post("/item", async (req, res) => {
    try {
        const {
            item_name,
            item_price,
            item_code
        } = req.body;

        await pool.query(
            `INSERT INTO Item
             (item_name, item_price, item_code)
             VALUES ($1, $2, $3)`,
            [item_name, item_price, item_code]
        );

        res.json({
            message: "Item Added"
        });

    } catch (err) {
        console.log("Error while adding item:", err);
        res.status(500).json({ error: err.message });
    }
});


// UPDATE item
app.put("/item/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const {
            item_name,
            item_price,
            item_code
        } = req.body;

        await pool.query(
            `UPDATE Item
             SET item_name = $1,
                 item_price = $2,
                 item_code = $3
             WHERE item_id = $4`,
            [
                item_name,
                item_price,
                item_code,
                id
            ]
        );

        res.json({
            message: "Item Updated"
        });

    } catch (err) {
        console.log("Error while updating item:", err);
        res.status(500).json({ error: err.message });
    }
});


// DELETE item
app.delete("/item/:id", async (req, res) => {
    try {
        const id = req.params.id;

        await pool.query(
            "DELETE FROM Item WHERE item_id = $1",
            [id]
        );

        res.json({
            message: "Item Deleted"
        });

    } catch (err) {
        console.log("Error while deleting item:", err);
        res.status(500).json({ error: err.message });
    }
});


// =====================================================
// INVOICE
// =====================================================

// GET all invoices
app.get("/invoice", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Invoice"
        );

        res.json(result.rows);

    } catch (err) {
        console.log("Error while getting invoices:", err);
        res.status(500).json({ error: err.message });
    }
});


// ADD invoice
app.post("/invoice", async (req, res) => {
    try {
        const {
            customer_id,
            date
        } = req.body;

        const result = await pool.query(
            `INSERT INTO Invoice
             (invoice_cid, invoice_date)
             VALUES ($1, $2)
             RETURNING invoice_id`,
            [customer_id, date]
        );

        res.json(result.rows[0]);

    } catch (err) {
        console.log("Error while adding invoice:", err);
        res.status(500).json({ error: err.message });
    }
});


// UPDATE invoice
app.put("/invoice/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const {
            invoice_cid,
            invoice_date
        } = req.body;

        await pool.query(
            `UPDATE Invoice
             SET invoice_cid = $1,
                 invoice_date = $2
             WHERE invoice_id = $3`,
            [
                invoice_cid,
                invoice_date,
                id
            ]
        );

        res.json({
            message: "Invoice Updated"
        });

    } catch (err) {
        console.log("Error while updating invoice:", err);
        res.status(500).json({ error: err.message });
    }
});


// DELETE invoice
app.delete("/invoice/:id", async (req, res) => {
    try {
        const id = req.params.id;

        await pool.query(
            "DELETE FROM Invoice WHERE invoice_id = $1",
            [id]
        );

        res.json({
            message: "Invoice Deleted"
        });

    } catch (err) {
        console.log("Error while deleting invoice:", err);
        res.status(500).json({ error: err.message });
    }
});


// =====================================================
// INVOICE DETAIL
// =====================================================

// GET invoice details
app.get("/invoicedetail", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Invoice_Detail"
        );

        res.json(result.rows);

    } catch (err) {
        console.log("Error while getting invoice details:", err);
        res.status(500).json({ error: err.message });
    }
});


// ADD invoice details
app.post("/invoicedetail", async (req, res) => {
    try {

        const invoicedata = req.body;

        for (const row of invoicedata) {

            const {
                item_id,
                quantity,
                rate,
                tax_id,
                discount,
                invoice_id
            } = row;

            await pool.query(
                `INSERT INTO Invoice_Detail
                (
                    invoice_detail_iid,
                    invoice_detail_quantity,
                    invoice_detail_rate,
                    invoice_detail_sid,
                    invoice_detail_discount,
                    invoice_detail_invoiceid
                )
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    item_id,
                    quantity,
                    rate,
                    tax_id,
                    discount,
                    invoice_id
                ]
            );
        }

        res.json({
            message: "Invoice Details Added"
        });

    } catch (err) {

        console.log("Error while adding invoice details:", err);

        res.status(500).json({
            error: err.message
        });
    }
});


// UPDATE invoice detail
app.put("/invoicedetail/:id", async (req, res) => {
    try {

        const id = req.params.id;

        const {
            invoice_detail_iid,
            invoice_detail_quantity,
            invoice_detail_rate,
            invoice_detail_sid,
            invoice_detail_discount
        } = req.body;

        await pool.query(
            `UPDATE Invoice_Detail
             SET invoice_detail_iid = $1,
                 invoice_detail_quantity = $2,
                 invoice_detail_rate = $3,
                 invoice_detail_sid = $4,
                 invoice_detail_discount = $5
             WHERE invoice_detail_id = $6`,
            [
                invoice_detail_iid,
                invoice_detail_quantity,
                invoice_detail_rate,
                invoice_detail_sid,
                invoice_detail_discount,
                id
            ]
        );

        res.json({
            message: "Invoice Details Updated"
        });

    } catch (err) {

        console.log("Error while updating invoice details:", err);

        res.status(500).json({
            error: err.message
        });
    }
});


// DELETE invoice detail
app.delete("/invoicedetail/:id", async (req, res) => {
    try {

        const id = req.params.id;

        await pool.query(
            "DELETE FROM Invoice_Detail WHERE invoice_detail_id = $1",
            [id]
        );

        res.json({
            message: "Invoice Detail Deleted"
        });

    } catch (err) {

        console.log("Error while deleting invoice detail:", err);

        res.status(500).json({
            error: err.message
        });
    }
});


// =====================================================
// REPORT
// =====================================================

app.post("/alldetails", async (req, res) => {

    try {

        const {
            customerid,
            itemid,
            date1,
            date2,
            radiovalue
        } = req.body;


        // Convert selected IDs to numbers
        const customerids = customerid.map(Number);
        const itemids = itemid.map(Number);


        const result = await pool.query(

            `SELECT *
             FROM (

                SELECT
                    i.invoice_date,
                    c.customer_name,
                    it.item_name,

                    id.invoice_detail_rate,
                    id.invoice_detail_quantity,

                    ROUND(
                        (
                            id.invoice_detail_rate *
                            id.invoice_detail_quantity
                        ) *
                        st.s_tax_percentage / 100,
                        2
                    ) AS tax_amount,

                    id.invoice_detail_discount,

                    ROUND(
                        (
                            (
                                id.invoice_detail_rate *
                                id.invoice_detail_quantity
                            )
                            -
                            id.invoice_detail_discount
                        )
                        +
                        (
                            (
                                id.invoice_detail_rate *
                                id.invoice_detail_quantity
                            )
                            *
                            st.s_tax_percentage / 100
                        ),
                        2
                    ) AS final_total

                FROM Invoice i

                JOIN Customer c
                    ON c.customer_id = i.invoice_cid

                JOIN Invoice_Detail id
                    ON id.invoice_detail_invoiceid = i.invoice_id

                JOIN Item it
                    ON it.item_id = id.invoice_detail_iid

                JOIN S_Tax st
                    ON st.s_tax_id = id.invoice_detail_sid

                WHERE
                    i.invoice_cid = ANY($1)
                    AND id.invoice_detail_iid = ANY($2)
                    AND i.invoice_date BETWEEN $3 AND $4

             ) AS report

             WHERE
                ($5 = 'all')
                OR
                ($5 = 'less' AND final_total <= 1000)
                OR
                ($5 = 'greater' AND final_total >= 1000)

            `,

            [
                customerids,
                itemids,
                date1,
                date2,
                radiovalue
            ]
        );


        res.json(result.rows);

    } catch (err) {

        console.log("Error while generating report:", err);

        res.status(500).json({
            error: err.message
        });
    }
});


// =====================================================
// START SERVER
// =====================================================

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

export default app;
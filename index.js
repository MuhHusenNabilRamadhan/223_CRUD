const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mahasiswa",
  password: "nbllrmdn2396",
  port: 5432,
});

app.use(express.json());

app.get("/biodata", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM biodata");

    res.status(200).json({
      message: "Berhasil mengambil data biodata",
      data: result.rows,
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan pada server atau database" });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
// post
app.post("/biodata", async (req, res) => {
  try {
    const data = req.body;
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");

    const query = `INSERT INTO biodata (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`;
    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Berhasil menambahkan data biodata",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan pada server atau database" });
  }
});
//put
app.put("/biodata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(", ");

    const query = `UPDATE biodata SET ${setClause} WHERE id = $${columns.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.status(200).json({
      message: "Berhasil mengubah data biodata",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan pada server atau database" });
  }
});

require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const pool = require("./../../model/sqlConfig");

exports.registration = async (req, res) => {
  console.log("hello");
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password)
    return res.status(400).json({
      status: 0,
      msg: "name, email, phone , password this fields are require",
    });

  try {
    const connect = await pool.getConnection();
    const sql = `SELECT COUNT(1) as count FROM user WHERE email = '${email}' OR phone = '${phone}'`;

    const [countData] = await connect.execute(sql);

    if (countData[0].count > 0) {
      return res.status(400).json({
        status: 0,
        msg: "Email or Phone number already registered.",
      });
    }
    const ePassword = await bcryptjs.hash(password.toString(), 10);
    console.log(countData);
    console.log(ePassword);

    const insertQuery = `INSERT INTO user (name, email, phone, password, role) VALUES('${name}','${email}','${phone}','${ePassword}', '1')`;
    const insertData = await connect.execute(insertQuery);

    if (!insertData)
      return res.status(400).json({
        status: 0,
        msg: "Data not saved.",
      });

    connect.release();

    const token = await jwt.sign({ name: name, role: 1 }, process.env.JWT_KEY);

    return res.status(200).json({
      status: 1,
      msg: "user registered successfully",
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0, msg: "Something error" });
  }
};

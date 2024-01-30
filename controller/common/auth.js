require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const pool = require("./../../model/sqlConfig");

exports.login = async (req, res) => {
  const { email, phone, password } = req.body;

  const type = req.params.type;

  try {
    const connect = await pool.getConnection();

    // login time koi bhi ek se ham login kar sakte hai--->>
    const sql = `SELECT * FROM user WHERE email = '${
      email ? email : "b@gmail.com"
    }' OR phone = '${phone ? phone : "123456789"}' LIMIT 1`;

    const [data] = await connect.execute(sql);

    if (data.length == 0)
      return res.status(400).json({ status: 0, msg: "User not found" });

    const userData = data[0];

    const check = await bcryptjs.compare(password, userData.password);

    if (!check)
      return res
        .status(400)
        .json({ status: 0, msg: "Password does not matched" });

    // if (userData.password != password)
    //   return res
    //     .status(400)
    //     .json({ status: 0, msg: "Password does not matched" });

    if (type == "admin") {
      if (userData.role != 3)
        return res
          .status(400)
          .json({ status: 0, msg: "Role does not matched" });
    }
    if (type == "user") {
      if (userData.role != 1)
        return res
          .status(400)
          .json({ status: 0, msg: "Role does not matched" });
    }
    if (type == "driver") {
      if (userData.role != 2)
        return res
          .status(400)
          .json({ status: 0, msg: "Role does not matched" });
    }

    // jwt ka ek funtion name hai sign
    const token = await jwt.sign(
      { name: userData.name, role: userData.role },
      process.env.JWT_KEY
    );

    connect.release();

    return res
      .status(200)
      .json({ status: 1, msg: "Authenticate successfully", token: token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0, msg: "Server error" });
  }
};

//Tokon validation middelwair 
exports.validateToken = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(400).json({
      status: 0,
      msg: "Please login to proceed!",
    });
  }

  try {
    const path = req.originalUrl;
    const token = req.headers.token;
    let decode;
    let auth = true;
    try {
      decode = await jwt.verify(token, process.env.JWT_KEY);
      // console.log(decode);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ status: 0, msg: "Invalid Token" });
    }
    console.log(decode);
    if (path.startsWith(`${process.env.APP_VERSION}/admin`)) {
      if (decode.role == 3) {
        req.decode = decode;
       return next();
      } else {
        auth = false;
      }
    } else if (path.startsWith(`${process.env.APP_VERSION}/user`)) {
      if (decode.role == 1) {
        req.decode = decode;
       return next();
      } else {
        auth = false;
      }
    } else if (path.startsWith(`${process.env.APP_VERSION}/driver`)) {
      if (decode.role == 2) {
        req.decode = decode;
       return next();
      } else {
        auth = false;
      }
    }

    if (!auth) {
      return res.status(400).json({ status: 0, msg: "You are not Atherized" });
    }

    console.log(path);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 0, msg: "Server error" });
  }
};

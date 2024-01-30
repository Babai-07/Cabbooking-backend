require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const multer = require("multer");

const pool = require("./../../model/sqlConfig");

// Create
const addVehicle = async (req, res) => {
//   const token = req.headers.token;

//   if (!token) {
//     return res.status(400).json({
//       status: 0,
//       msg: "Please login to proceed!",
//     });
//   }
//   const { role } = await jwt.verify(token, process.env.JWT_KEY);
// //   console.log(role);
//   if (role !== 3) {
//     return res.status(400).json({
//       status: 0,
//       msg: "You are not Authorized to make changes!",
//     });
//   }

  const { car_model, car_no, sit, color, type } = req.body;

  try {
    if (!car_model || !car_no || !sit || !color || !type) {
      return res.status(400).json({
        status: 0,
        msg: "Please fill in all the fields in order to proceed!",
      });
    }

    const connect = await pool.getConnection();

    const query = `SELECT COUNT(1) as count FROM cars WHERE car_no = "${car_no}"`;

    const [countData] = await connect.execute(query);

    console.log(countData);
    
    if (countData[0].count > 0) {
        console.log(countData);
        return res.status(400).json({
            status: 0,
        msg: "Data already present",
      });
    }

    const insertQuery = `INSERT INTO cars (car_model, car_no, sit, color, type) VALUES ('${car_model}','${car_no}','${sit}','${color}','${type}')`;
    const [insertData] = await connect.execute(insertQuery);

    connect.release();

    if (!insertData) {
      return res.status(400).json({
        status: 0,
        msg: "Could not add the provided data!",
      });
    }

    res.status(201).json({
      status: 1,
      msg: "Data added successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 0,
      msg: "Server Error!",
    });
  }
};

//Get request
//Fetch all the car List 
const getAllVehicle = async (req, res) => {
  const token = req.headers.token;
  if(!token){
      return res.status(400).json({
          status: 0,
          msg: "Please login to proceed!",
      });
  }
  try{
      const connect = await pool.getConnection();

      const getQuery =`SELECT * FROM cars`;

      const [data]= await connect.execute(getQuery);

      connect.release();

      if(!data){
          return res.status(400).json({
              status:0,
              msg: "Could not fetch the required data!",
          });
      }
      res.status(200).json({
          status:1,
          msg: "Data fetch the required data!",
          data: data,
      });
  }catch(err){
      console.log(err);
      res.status(500).json({
          status:0,
          msg: "Server Error!",
      });
  }
};

// Update

const updateVehicle = async (req, res) => {
  // const token = req.headers.token;

  // if (!token) {
  //   return res.status(400).json({
  //     status: 0,
  //     msg: "Please login to proceed!",
  //   });
  // }

  // const { role } = jwt.verify(token, process.env.JWT_KEY);

  // if (role !== 3) {
  //   return res.status(400).json({
  //     status: 0,
  //     msg: "You are not authorized to make changes!",
  //   });
  // }

  const { car_model, car_no, sit, color, type } = req.body;
  const id = req.params.id;

  try {
    if (!car_model && !car_no && !sit && !color && !type) {
      return res.status(400).json({
        status: 0,
        mgs: "Please provide atleast one field in order to update",
      });
    }

    let update = "";

    car_model && (update += `car_model ='${car_model}',`);
    car_no && (update += `car_no ='${car_no}',`);
    sit && (update += `sit = '${sit}',`);
    color && (update += `color = '${color}',`);

    update = update.slice(0, -1);

    const updateQuery = `UPDATE cars SET ${update} WHERE car_id = ${id}`;

    const connect = await pool.getConnection();

    const [updateData] = await connect.execute(updateQuery);

    connect.release();

    if (updateData.changedRows === 0) {
      return res.status(400).json({
        status: 0,
        msg: "No data is updated since same data is provided!",
      });
    }
    res.status(200).json({
      status: 1,
      msg: "Data update successfully!",
      data: updateData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 0,
      msg: "Server Error!",
    });
  }
};

// Delete

const deleteVehicle = async (req, res) => {
  // const token = req.headers.token;

  // if (!token) {
  //   return res.status(400).json({
  //     status: 0,
  //     msg: "Please login to proceed!",
  //   });
  // }
  // const { role } = jwt.verify(token, process.env.JWT_KEY);

  // if (role !== 3) {
  //   return res.status(400).json({
  //     status: 0,
  //     msg: "You are not authorized to make changes!",
  //   });
  // }

  const id = req.params.id;

  try {
    const connect = await pool.getConnection();

    const deleteQuery = `DELETE FROM cars WHERE car_id=${id}`;

    try {
      await connect.execute(deleteQuery);
    } catch (err) {
      return res.status(400).json({
        statas: 0,
        msg: "Could not delete the data!",
      });
    }
    connect.release();

    res.status(200).json({
      status: 1,
      msg: "Data Deleted successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 0,
      msg: "Server Error!",
    });
  }
};

//image uplode by Multer ---> 

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "./images");
  },
  filename: function(req, file, cb){
    const name = `carimage-${new Date().getTime()}.png`;
    cb(null, name);
  }
})

const uplode = multer({ storage: storage });



module.exports = { addVehicle, updateVehicle, deleteVehicle, getAllVehicle, uplode };

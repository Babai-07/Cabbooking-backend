const pool = require("../../model/sqlConfig");
//Get request
//Fetch all the car List 
const getAllVehicle = async (req, res) => {
    // const token = req.headers.token;
    // if(!token){
    //     return res.status(400).json({
    //         status: 0,
    //         msg: "Please login to proceed!",
    //     });
    // }
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

module.exports ={ getAllVehicle };
const bcrypt=require('bcryptjs');
const User=require('../model/userModel');
const getProfile=async (req,res)=>{
    const userId=req.user.id;
    try{
        const user=await User.findById(userId).select('-password');
        if(user){
            return res.status(200).json({
                success:true,
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
                emailVerified:user.emailVerified
            });
        }else{
            return res.status(404).json({
                success:false,
                message:"data missed."
            })
        }
    }catch(e){
        return res.status(500).json({
                success:false,
                message:e.message
            })
    }
}
const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if(password!==confirmPassword){
    return res.status(401).json({
        success:false,
        message:"password miss match"
    });
  }
  try {
    const updateData = {};

    if (firstName !== undefined) {
      updateData.firstName = firstName;
    }

    if (lastName !== undefined) {
      updateData.lastName = lastName;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully."
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};
module.exports={getProfile,updateProfile};
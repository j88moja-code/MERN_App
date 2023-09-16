const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const e = require('express');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
};

// Register User
const registerUser = asyncHandler( async (req, res) => {
    const {name, email, password} = req.body

    // Validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please fill in all required fields')
    }
    if (password.length < 6) {
        res.status(400)
        throw new Error('Password must be at least 6 characters')
    }

    // Check if user email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    

    // Create new user
    const user = await User.create({
        name,
        email,
        password,
    });

    // Generate token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expiresIn: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true
    });

    if (user) {
        const {_id, name, email, photo, phone, bio} = user
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////

// Login User
const loginUser = asyncHandler( async (req, res) => {
    
    const { email, password } = req.body;

    // Validate required parameters
    if (!email || !password) {
        res.status(400)
        throw new Error('Please add email and password')
    };

    // Check if the user exists
    const user = await User.findOne({ email: email});

    if (!user) {
        res.status(400)
        throw new Error('User not found, please sign up')
    };

    // User exists, check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    // Generate token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expiresIn: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true
    });
    if (user && passwordIsCorrect) {
        const {_id, name, email, photo, phone, bio} = user
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        });
    } else {
        res.status(400)
        throw new Error('Invalid email or password');
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////

// Logout User
const logout =  asyncHandler( async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expiresIn: new Date(0),
        sameSite: "none",
        secure: true
    });
    return res.status(200).json({
        message: "Successfully logged out"
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////

// Get User Data
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const {_id, name, email, photo, phone, bio} = user;
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    };
});

////////////////////////////////////////////////////////////////////////////////////////////////

// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {

    const token = req.cookies.token;
    if (!token) {
        return res.json(false);
    }
    //Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
        return res.json(true);
    }
    return res.json(false);
});

////////////////////////////////////////////////////////////////////////////////////////////////

// Update User Profile
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { name, email, photo, phone, bio } = user;
        user.email = email;
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;
        user.photo = req.body.phote || photo;

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            photo: updatedUser.photo,
            phone: updatedUser.phone,
            bio: updatedUser.bio,
        })
    } else {
        res.status(404);
        throw new Error('User not found')
    };
});

////////////////////////////////////////////////////////////////////////////////////////////////

// Update User Password

const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    const { oldPassword, password } = req.body;
    if (!user) {
        res.status(400);
        throw new Error('User not found, please sign in');
    };

    // Validate
    if (!oldPassword || !password) {
        res.status(400);
        throw new Error('Please enter old and new password');
    }

    // Check if old password matches password in DB
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

    // Save new password
    if (user && passwordIsCorrect) {
        user.password = password;
        await user.save();
        res.status(200).send("Password has been changed successfully")
    } else {
        res.status(400);
        throw new Error('Old password is incorrect');
    }

});

module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword
};
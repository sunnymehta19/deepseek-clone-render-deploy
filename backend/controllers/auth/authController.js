import express from "express"
import bcrypt from "bcrypt"
import userModel from "../../model/user.js"
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExist = await userModel.findOne({ email: email });

        if (userExist) {
            return res.status(401).json({
                success: false,
                message: "User already exist! try Login."
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            username,
            email,
            password: hashPassword,
        });
        await newUser.save();

        return res.status(200).json({
            success: true,
            message: "Sign up successfull"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occured while sign up."
        })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkUser = await userModel.findOne({ email: email });

        if (!checkUser) {
            return res.status(403).json({
                success: false,
                message: "Something went wrong",
            });
        }

        let checkPassworkMatch = await bcrypt.compare(password, checkUser.password);
        if (!checkPassworkMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect email or password! Try again."
            })
        }

        const token = jwt.sign({ id: checkUser._id }, process.env.CLIENT_SECRET_KEY, {
            expiresIn: "1d",
        });

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: "none",
            // secure: false,
            // sameSite: "lax",
        }

        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            success: true,
            message: "Logged in successfull",
            checkUser: {
                _id: checkUser._id,
                username: checkUser.username,
                email: checkUser.email,
            },
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occured while login."
        })
    }
}

const authenticate = async (req, res) => {

    return res.status(200).json({
        success: true,
        user: req.user,
    });
};



const logOut = (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({
            success: true,
            message: "Logout successfull"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occured while log out."
        })
    }
}

export { signup, login, logOut, authenticate }

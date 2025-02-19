import { hash, verify } from "argon2"
import User from "../user/user.model.js"
import { generateJWT } from "../helpers/generate-jwt.js";
import bcrypt from "bcryptjs"
export const register = async (req, res) => {
    try {
        const data = req.body;
        let profilePicture = req.file ? req.file.filename : null;
        const encryptedPassword = await hash(data.password)
        data.password = encryptedPassword
        data.profilePicture = profilePicture

        const user = await User.create(data);

        return res.status(201).json({
            message: "User has been created",
            name: user.name,
            email: user.email
        });
    } catch (err) {
        return res.status(500).json({
            message: "User registration failed",
            error: err.message
        });
    }
}

export const login = async (req, res) => {
    const { email, username, password } = req.body
    try{
        const user = await User.findOne({
            $or:[{email: email}, {username: username}]
        })

        if(!user){
            return res.status(400).json({
                message: "Crendenciales inválidas",
                error:"No existe el usuario o correo ingresado"
            })
        }

        const validPassword = await verify(user.password, password)

        if(!validPassword){
            return res.status(400).json({
                message: "Crendenciales inválidas",
                error: "Contraseña incorrecta"
            })
        }

        const token = await generateJWT(user.id)

        return res.status(200).json({
            message: "Login successful",
            userDetails: {
                token: token,
                profilePicture: user.profilePicture
            }
        })
    }catch(err){
        return res.status(500).json({
            message: "login failed, server error",
            error: err.message
        })
    }
}

// creacion de ADMIN_ROLE
export const initializeAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ role: "ADMIN_ROLE" })

        if (!adminExists) {
            const hashedPassword = bcrypt.hashSync("ADMIN25$ki", 10)

            const admin = new User({
                name: "Admin",
                surname: "Space",
                username: "admin_role",
                email: "admin@spacesocial.com",
                password: hashedPassword,
                phone: "21326554",
                role: "ADMIN_ROLE",
                status: true
            })

            await admin.save()
            console.log("Usuario ADMIN_ROLE creado")
        } 
    } catch (error) {
        console.error("Error al inicializar el usuario ADMIN_ROLE:", error)
    }
}
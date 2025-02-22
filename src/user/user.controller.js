import { hash, verify } from "argon2";
import User from "./user.model.js";
import fs from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Actualizar Contraseña
/**
 * @swagger
 * /users/updatePassword/{uid}:
 *   patch:
 *     summary: Update user password
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export const updatePassword = async (req, res) => {
    try {
        const { uid } = req.params;
        const { newPassword } = req.body;
        const { oldPassword } = req.body;

        const user = await User.findById(uid);

        const matchPassword = await verify(user.password, newPassword);
        const isOldPasswordCorrect = await verify(user.password, oldPassword);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "La contraseña anterior es incorrecta",
            });
        }
        if (matchPassword) {
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior",
            });
        }

        const encryptedPassword = await hash(newPassword);

        await User.findByIdAndUpdate(uid, { password: encryptedPassword });

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar contraseña",
            error: err.message,
        });
    }
};

// Actualizar Users
/**
 * @swagger
 * /users/updateUser/{uid}:
 *   put:
 *     summary: Update user information
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const data = req.body;

        const user = await User.findByIdAndUpdate(uid, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Usuario Actualizado",
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar usuario",
            error: err.message,
        });
    }
};

//Listar User
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: integer
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
export const getUsers = async (req, res) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { status: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query).skip(Number(desde)).limit(Number(limite)),
        ]);

        return res.status(200).json({
            success: true,
            total,
            users,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message,
        });
    }
};

// Actualizar Foto
/**
 * @swagger
 * /users/updateProfilePicture/{uid}:
 *   patch:
 *     summary: Update user profile picture
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture updated
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export const updateProfilePicture = async (req, res) => {
    try {
        const { uid } = req.params;
        let newProfilePicture = req.file ? req.file.filename : null;

        if (!newProfilePicture) {
            return res.status(400).json({
                success: false,
                message: "No hay archivo en la petición",
            });
        }

        const user = await User.findById(uid);

        if (user.profilePicture) {
            const oldProfilePicture = join(
                __dirname,
                "../../public/uploads/profile-pictures",
                user.profilePicture
            );
            await fs.unlink(oldProfilePicture);
        }

        user.profilePicture = newProfilePicture;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Foto actualizada",
            profilePicture: user.profilePicture,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la foto",
            error: err.message,
        });
    }
};

/**
 * Initialize admin user if not exists
 */
export const initializeAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ role: "ADMIN_ROLE" });

        if (!adminExists) {
            const hashedPassword = await hash("ADMIN254$sin");

            const admin = new User({
                name: "Admin",
                surname: "Space",
                username: "admin_role",
                email: "admin@spacesocial.com",
                password: hashedPassword,
                phone: "21326554",
                role: "ADMIN_ROLE",
                status: true,
            });

            await admin.save();
            console.log("✅ Usuario ADMIN_ROLE creado correctamente");
        }
    } catch (error) {
        console.error("❌ Error al inicializar el usuario ADMIN_ROLE:", error);
    }
};
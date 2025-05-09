import Post from "./post.model.js"
import Course from "../course/course.model.js"
import Comment from "../comment/comment.model.js"

// para usar 
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({ status: { $ne: false } }) 
            .select("title content course user createdAt") 
            .populate("course", "name") 
            .populate("user", "name") 
            .lean(); 

        if (!posts || posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron publicaciones",
            });
        }

        const formattedPosts = posts.map(post => ({
            user: post.user?.name || "Usuario no encontrado",
            title: post.title,
            content: post.content,
            course: post.course?.name || "Curso no encontrado",
            createdAt: post.createdAt
        }));

        return res.status(200).json({
            success: true,
            total: formattedPosts.length,
            posts: formattedPosts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener las publicaciones",
            error: err.message,
        });
    }
};
// para usar
export const getPostById = async (req, res) => {
    try {
        const { post_id } = req.params;

        const post = await Post.findById(post_id)
            .populate("user", "name") 
            .populate("course", "name") 
            .populate({
                path: "comments",
                select: "nameUser content createdAt", 
            })
            .lean();

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Publicación no encontrada",
            });
        }

        const formattedPost = {
            user: post.user?.name || "Usuario no encontrado",
            title: post.title,
            content: post.content,
            course: post.course?.name || "Curso no encontrado",
            createdAt: post.createdAt,
            comments: post.comments.map(comment => ({
                nameUser: comment.nameUser,
                content: comment.content,
                createdAt: comment.createdAt,
            })),
        };

        return res.status(200).json({
            success: true,
            post: formattedPost,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener la publicación",
            error: err.message,
        });
    }
};
// para usar
export const publicarPost = async (req, res) => {
    try {
        const uid = req.user?.id || req.usuario?._id;
        if (!uid) {
            return res.status(401).json({
                message: "Token de usuario no encontrado"
            });
        }

        const { title, courseName, content } = req.body;
        if (!title || !courseName || !content) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios"
            });
        }

        // Buscar el curso por nombre
        const course = await Course.findOne({ name: new RegExp(`^${courseName}$`, "i") });
        if (!course) {
            return res.status(404).json({
                message: "El curso especificado no existe"
            });
        }

        // Crear la publicación
        const post = new Post({
            title: title.trim(),
            course: course._id, // Enlazar con el ID del curso encontrado
            content,
            user: uid,
            status: true
        });

        await post.save();

        return res.status(201).json({
            message: "Publicación creada exitosamente",
            post
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error creando la publicación",
            error: err.message
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const data = req.body;
        const user = req.usuario;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        const post = await Post.findById(post_id);

        if (!post || post.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para actualizar esta publicación',
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(post_id, data, { new: true });

        res.status(200).json({
            success: true,
            message: 'Publicación actualizada',
            updatedPost,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la publicación',
            error: err.message,
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const post = await Post.findByIdAndUpdate(post_id, { status: false }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Publicación eliminada correctamente",
            post
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar la publicación",
            error: err.message
        });
    }
};


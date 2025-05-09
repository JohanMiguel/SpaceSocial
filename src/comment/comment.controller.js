import Comment from "./comment.model.js";
import Post from "../post/post.model.js";

export const createComment = async (req, res) => {
    try {
        const { nameUser, content, post_id } = req.body;

        // Validar que los campos requeridos estén presentes
        if (!nameUser || !content || !post_id) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos (nameUser, content, post_id) son obligatorios",
            });
        }

        // Verificar que el post exista
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Publicación no encontrada",
            });
        }

        // Crear el comentario
        const comment = new Comment({
            nameUser,
            content,
            post: post_id,
        });

        // Guardar el comentario en la base de datos
        await comment.save();

        // Agregar el comentario al array de comentarios del post
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            success: true,
            message: "Comentario creado",
            comment,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al crear el comentario",
            error: err.message,
        });
    }
};
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.usuario;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        if (comment.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para eliminar este comentario'
            });
        }

        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Comentario eliminado'
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar comentario',
            error: err.message
        });
    }
}
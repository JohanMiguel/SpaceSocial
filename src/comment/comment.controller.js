import Comment from "./comment.model.js";
import Post from "../post/post.model.js";

export const createComment = async (req, res) => {
    try {
        
        const { content, post_id } = req.body;
        const user = req.usuario;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const post = await Post.findById(post_id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        const comment = new Comment({
            content,
            user: user._id,
            post: post_id
        });

        await comment.save();

        post.comments.push(comment._id);
        await post.save();
    

        res.status(201).json({
            success: true,
            message: "Comentario creado",
            comment
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear comentario",
            error: err.message
        });
    }
}

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
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
                message: 'No tienes permiso para actualizar este comentario'
            });
        }

        comment.content = content;
        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comentario actualizado',
            comment
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar comentario',
            error: err.message
        });
    }
}

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
import Post from "./post.model.js"
import fs from "fs/promises"
import { join, dirname } from "path"
import path from "path"
import Category from "../category/category.model.js"

export const createPost = async (req, res) => {
    try {
        const data = req.body;
        const user = req.usuario;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        if (!data.category) {
            const sinCategoria = await Category.findOne({ name: "Globala" });
            if (!sinCategoria) {
                return res.status(404).json({
                    success: false,
                    message: "La categoría 'x' no existe",
                });
            }
            data.category = sinCategoria._id;
        }

        const post = new Post({
            ...data,
            user: user._id
        });

        await post.save();

        const populatedPost = await Post.findById(post._id)
            .populate('user', 'name')
            .populate('category', 'name');

        res.status(201).json({
            success: true,
            message: "Publicación creada",
            populatedPost
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al hacer publicación",
            error: err.message
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        pid
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

export const getPostsByCategory = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'name')
            .populate('category', 'name')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'name'
                }
            });

        return res.status(200).json({
            success: true,
            total: posts.length,
            posts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los posts",
            error: err.message,
        });
    }
};





export const publicarPost = async (req, res) => {
    try {
      const uid = req.user?.id || req.usuario?._id;
      if (!uid) {
        return res.status(401).json({
          message: "Token de usuario no encontrado"
        });
      }
  
      const { title, category, content } = req.body;
      if (!title || !category || !content) {
        return res.status(400).json({
          message: "Todos los campos son obligatorios"
        });
      }
  
      const post = new Post({
        title: title.trim(),
        category,
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

 
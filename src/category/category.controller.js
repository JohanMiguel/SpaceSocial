import Category from "./category.model.js";
import User from "../user/user.model.js"
import Post from "../post/post.model.js";

//quemar de 3 categorias
const defectCategory = async () => {
    try {
        const user = await User.findOne({ role: "ADMIN_ROLE" });

        if (!user) {
            console.log("No se encontró un usuario con el rol 'ADMIN_ROLE'");
            return;
        }

        const categoriesData = ["Sport", "Salud", "Global"];

        for (let name of categoriesData) {
            const exists = await Category.findOne({ 
                name: { $regex: new RegExp('^' + name + '$', 'i') } 
            });

            if (!exists) {
                const newCategory = new Category({ name, usuariop: user._id });
                await newCategory.save();
                console.log(`✅ Categoría '${name}' creada con éxito.`);
            } else {
                console.log(`⚠ La categoría '${name}' ya existe.`);
            }
        }
    } catch (error) {
        console.error(" Error al crear las categorías:", error);
    }
}



// crear categoria
export const createCategory = async (req, res) => {
    try {
      const { name } = req.body;
      const existingCategory = await Category.findOne({ name: name.toLowerCase() });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "La categoría ya existe",
        });
      }
  
      const category = new Category({ name: name.toLowerCase() });
      await category.save();
  
      res.status(201).json({
        success: true,
        message: "Categoría creada exitosamente",
        category,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error al crear la categoría",
        error: err.message,
      });
    }
  };
  
// listar categorias
export const getCategorys = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: { $ne: false } };

    try {
        const categories = await Category.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .select("_id name usuariop") // Solo obtenemos estos campos
            .lean(); 

        const categoriesWithUserNames = await Promise.all(categories.map(async (category) => {
            let createdBy = "Usuario no encontrado";

            if (category.usuariop) {
                const user = await User.findById(category.usuariop).select("nombre").lean();
                if (user) {
                    createdBy = user.nombre;
                }
            }

            return {
                _id: category._id,
                name: category.name,
                createdBy
            };
        }));

        res.status(200).json({
            success: true,
            categories: categoriesWithUserNames
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las categorías",
            error: error.message
        });
    }
};



// buscar una categoria
export const getCategoryByName = async (req, res) => {
    try {
        const { name } = req.params;
        const category = await Category.findOne({ name: new RegExp(`^${name}$`, "i") });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada",
            });
        }

        res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al buscar la categoría",
            error: error.message,
        })
    }
}

// editar
export const updateCategory = async (req, res) => {
    try {
      const { categoria_id } = req.params;
      const data = req.body;
  
      const category = await Category.findByIdAndUpdate(categoria_id, data, { new: true });
      if (!category) {
        return res.status(404).json({
          success: false,
          msg: "Categoría no encontrada",
        });
      }
  
      res.status(200).json({
        success: true,
        msg: "Categoría actualizada",
        category,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        msg: "Error al actualizar la categoría",
        error: err.message,
      });
    }
  };
  
// eliminar
    export const deleteCategory = async (req, res) => {
        try {
          const { id } = req.params;
          const category = await Category.findById(id);
          if (!category) {
            return res.status(404).json({
              message: "Categoría no encontrada"
            });
          }
      
          if (category.isDefault) {
            return res.status(400).json({
              message: "No se puede eliminar la categoría por defecto"
            });
          }
      
          category.status = false;
          await category.save();
      
          return res.status(200).json({
            message: "Categoría eliminada (desactivada) exitosamente",
            category
          });
        } catch (err) {
          return res.status(500).json({
            message: "Error eliminando la categoría",
            error: err.message
          });
        }
      };
export { defectCategory};

  
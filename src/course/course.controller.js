import Course from "./course.model.js";
import User from "../user/user.model.js";

const defectCourse = async () => {
    try {
        const user = await User.findOne({ role: "ADMIN_ROLE" });

        if (!user) {
            console.log("No se encontró un usuario con el rol 'ADMIN_ROLE'");
            return;
        }

        const coursesData = ["TECNOLOGIA", "TALLER", "PRACTICA SUPERVISADA"];

        for (let name of coursesData) {
            const exists = await Course.findOne({ 
                name: { $regex: new RegExp('^' + name + '$', 'i') } 
            });

            if (!exists) {
                const newCourse = new Course({ name, usuariop: user._id });
                await newCourse.save();
                console.log(`✅ Curso '${name}' creado con éxito.`);
            } else {
                console.log(`⚠ El curso '${name}' ya existe.`);
            }
        }
    } catch (error) {
        console.error("Error al crear los cursos:", error);
    }
};

export const getCourses = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: { $ne: false } };

    try {
        const courses = await Course.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            
            .lean(); 

        const coursesWithUserNames = await Promise.all(courses.map(async (course) => {
            

            return {
                _id: course._id,
                name: course.name,
            };
        }));

        res.status(200).json({
            success: true,
            courses: coursesWithUserNames
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los cursos",
            error: error.message
        });
    }
};

export const getCourseByName = async (req, res) => {
    try {
        const { name } = req.params;
        const course = await Course.findOne({ name: new RegExp(`^${name}$`, "i") });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado",
            });
        }

        res.status(200).json({
            success: true,
            course,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al buscar el curso",
            error: error.message,
        });
    }
};

export { defectCourse };
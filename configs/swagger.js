import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options ={
    swaggerDefinition:{
        openapi:"3.0.0",
        info:{
            title: "Gestor de opiniones API",
            version: "1.0.0",
            description: "API para un sistema de gestión de comentarios",
            contact:{
                name: "Johan Tojin",
                email: "jtojin-2020591@kinal.edu.gt"
            }
        },
        servers:[
            {
                url: "http://127.0.0.1:3001/spacesocial/v1"
            }
        ]
    },
    apis:[
        "./src/auth/auth.routes.js",
        "./src/user/user.routes.js",
        "./src/category/category.routes.js",
        "./src/post/post.routes.js",
        "./src/comment/comment.routes.js"
    ]
}

const swaggerDocs = swaggerJSDoc(options)

export { swaggerDocs, swaggerUi}

const dotenv = require('dotenv').config();

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      version: "1.0.0",
      title: "YOUR OWN STORE SERVICE",
      description:
        "This is the API docs for your own store service (auth, products, orders)",
      contact: {
        name: "Developer",
        email: "jude.nwadiogor.dev@gmail.com",
      },
      license: {
        name: "Apache 2.0",
        url: "https://www.apache.org/licenses/LICENSE-2.0.html",
      },

      components: {},
      security: [
        {
          bearerAuth: [],
        },
      ],
      paths: {},
    },
    tags: [
      {
        name: "Auth",
      },
    ],
    servers: [
    {
      url: process.env.BACKEND_URL,
      description: "Local server",
    },
  ],
  },
  apis: ["./routes/*.js"],
  
};

module.exports = options;
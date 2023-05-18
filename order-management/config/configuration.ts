const env = process.env.NODE_ENV;

let config = {
  port: 3000,
  rabbitmq : {
      host: "",
      exchange: "",
      queue: ""
  },
  mongodb: {
    read: "",
    write: ""
  }
};

let devConfig = {
  port: 3000,
    rabbitmq : {
        host: "amqp://localhost:5672",
        exchange: "ball-com",
        queue: "ball-com.order-management"
    },
    mongodb: {
      read: "mongodb://localhost:27018/order-management-read",
      write: "mongodb://localhost:27018/order-management-write"
    }
}
let prodConfig = {
  port: 3000,
    rabbitmq : {
        host: "amqp://rabbitmq",
        exchange: "ball-com",
        queue: "ball-com.order-management"
    },
    mongodb: {
      read: "mongodb://mongo-order-management:27017/order-management-read",
      write: "mongodb://mongo-order-management:27017/order-management-write"
    }
}
if (env === 'development') {
  config = {
    ...devConfig,
    // Add or change properties specific to the development environment
  }
} else {
  config = {
    ...prodConfig
  }
}
export default config;
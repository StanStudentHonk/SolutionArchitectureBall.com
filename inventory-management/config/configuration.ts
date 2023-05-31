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
    write: "",
    eventStore: ""

  }
};

let devConfig = {
  port: 3000,
    rabbitmq : {
        host: "amqp://localhost:5672",
        exchange: "ball-com",
        queue: "ball-com.inventory-management"
    },
    mongodb: {
      read: "mongodb://localhost:27017/inventory-management-read",
      write: "mongodb://localhost:27017/inventory-management-write",
      eventStore: "mongodb://localhost:27017/inventory-management-event-store"
    }
}
let prodConfig = {
  port: 3000,
    rabbitmq : {
        host: "amqp://rabbitmq",
        exchange: "ball-com",
        queue: "ball-com.payment-management"
    },
    mongodb: {
      read: "mongodb://mongo-inventory-management:27017/inventory-management-read",
      write: "mongodb://mongo-inventory-management:27017/inventory-management-write",
      eventStore: "mongodb://mongo-inventory-management:27017/inventory-management-event-store"
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
console.log(config)
export default config;
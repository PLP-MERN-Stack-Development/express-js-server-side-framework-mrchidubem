import { v4 as uuidv4 } from "uuid";

let products = [
  {
    id: uuidv4(),
    name: "Wireless Mouse",
    description: "Ergonomic Bluetooth mouse",
    price: 25.5,
    category: "Electronics",
    inStock: true
  }
];

export default products;

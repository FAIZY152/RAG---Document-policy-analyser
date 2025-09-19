import { prepareDoc } from "./prepareDoc.js";

const filePath = path.resolve(process.cwd(), "src", "utils", "p-docs.pdf");
prepareDoc(filePath);

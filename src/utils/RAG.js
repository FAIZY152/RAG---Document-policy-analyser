import { loadPDF } from "./prepareDoc.js";
import path from "path";

const filePath = path.resolve(process.cwd(), "src", "utils", "p-docs.pdf");
loadPDF(filePath);

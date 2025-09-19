import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function loadPDF(relativePath) {
  // Resolve to absolute path
  const filePath = path.resolve(process.cwd(), relativePath);
  console.log("📄 Loading PDF from:", filePath);

  // Initialize PDF loader
  const loader = new PDFLoader(filePath, { splitPages: false });

  // Load and return docs
  const docs = await loader.load();
  console.log("📄 Docs loaded:", docs[0].pageContent);

  return docs;
}

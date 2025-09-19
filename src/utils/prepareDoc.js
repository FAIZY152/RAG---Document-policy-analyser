import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TokenTextSplitter } from "@langchain/textsplitters";
import * as fs from "node:fs";

export async function loadPDF(relativePath) {
  // Resolve to absolute path
  const filePath = path.resolve(process.cwd(), relativePath);
  console.log("📄 Loading PDF from:", filePath);

  // Initialize PDF loader
  const loader = new PDFLoader(filePath, { splitPages: false });

  // Load and return docs
  const docs = await loader.load();
  const document = docs[0].pageContent;
  //   console.log("📄 Docs loaded:", docs[0].pageContent);

  const textSplitter = new TokenTextSplitter({
    chunkSize: 300,
    chunkOverlap: 80,
  });

  const texts = await textSplitter.splitText(document);
  console.log(texts.length, "texts");
  fs.writeFileSync("src/utils/texts.json", JSON.stringify(texts));

  return docs;
}

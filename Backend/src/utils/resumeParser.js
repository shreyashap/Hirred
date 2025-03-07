import fs from "fs";
import pdfParse from "pdf-parse";

const extractTextFromPDF = async (resumeFilePath) => {
  if (!resumeFilePath || !fs.existsSync(resumeFilePath)) {
    console.warn("PDF file does not exist:", resumeFilePath);
    return;
  }

  try {
    const pdfBuffer = fs.readFileSync(resumeFilePath);
    const pdfData = await pdfParse(pdfBuffer);
    return pdfData.text;
  } catch (error) {
    console.error(error);
  }
};

export default extractTextFromPDF;

import axiosInstance from "./axiosInstance";

export const downloadPdf = async (enrollment_id: string, email: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/enrol/download-certificate/${enrollment_id}`,
      {
        responseType: "blob",
      }
    );
    const pdfBlob = new Blob([response.data], { type: "application/pdf" });
    const name = email.substring(0, email.indexOf('.'));
    const url = window.URL.createObjectURL(pdfBlob);
    const tempLink = document.createElement("a");
    tempLink.href = url;
    tempLink.setAttribute("download", `${name}_hipaa.pdf`);
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw error;
  }
};

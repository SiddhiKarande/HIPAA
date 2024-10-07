import xlsx from "xlsx";

export const convertCsvToJson = (csvFilePath: string) => {
	const workbook = xlsx.readFile(csvFilePath);
	const sheetName = workbook.SheetNames[0];
	const worksheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];

	return worksheetData.map((item) => ({
		question: item["Question"],
		options: [item["Option 1"], item["Option 2"], item["Option 3"], item["Option 4"]],
		correctAns: item["Correct Answer"],
	}));
};

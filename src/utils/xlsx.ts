import { Media, SuppliersCommissionsColumn } from "@/payload-types";
import * as XLSX from "xlsx";

const letterToNumber = (letter: string): number => {
  let result = 0;
  const upperLetter = letter.toUpperCase(); // Convert to uppercase first
  for (let i = 0; i < upperLetter.length; i++) {
    result = result * 26 + (upperLetter.charCodeAt(i) - 64);
  }
  return result - 1; // Convert to 0-based index
};

export const extractData = async ({
  file,
  columns,
  codes,
}: {
  file: Media;
  columns: {
    codeLetter: SuppliersCommissionsColumn["code_column_letter"];
    typeLetter: SuppliersCommissionsColumn["type_column_letter"];
    amountLetter: SuppliersCommissionsColumn["amount_column_letter"];
  };
  codes: string[];
}) => {
  let totalProduction = 0;
  let totalEncours = 0;
  let totalStructured = 0;

  /** WORKSHEET EXCEL */
  try {
    const response = await fetch((file as Media).url!);
    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    /** WORKSHEET TO JSON */
    const dataSheet = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: false,
    });

    /** LOOP OVER ALL ROWS  */
    for (const row of dataSheet) {
      if (!Array.isArray(row)) continue;

      // console.log(letterToNumber(columns.codeLetter));
      // console.log(letterToNumber(columns.typeLetter));
      // console.log(letterToNumber(columns.amountLetter));

      const codeInColumn = row[letterToNumber(columns.codeLetter)];
      const typeInColumn = row[letterToNumber(columns.typeLetter)];
      const amountInColumn = row[letterToNumber(columns.amountLetter)];

      // console.log(codeInColumn, typeInColumn, amountInColumn);

      if (
        !codeInColumn ||
        !typeInColumn ||
        !amountInColumn ||
        !codes.includes(codeInColumn.toString())
      )
        continue;

      // console.log(codeInColumn, typeInColumn, amountInColumn);

      /** CHECK THE TYPE OF THE COLUMN TYPE */
      const typeString = typeInColumn.toString().toLowerCase();
      const amount = parseFloat(amountInColumn.toString()) || 0;

      /** ACCUMULATE ON CORRECT TYPE */
      if (
        mappingType.production.some((keyword) => typeString.includes(keyword))
      ) {
        totalProduction += amount;
      } else if (
        mappingType.encours.some((keyword) => typeString.includes(keyword))
      ) {
        totalEncours += amount;
      } else if (
        mappingType.structured.some((keyword) => typeString.includes(keyword))
      ) {
        totalStructured += amount;
      }
    }

    return {
      totalProduction,
      totalEncours,
      totalStructured,
    };
  } catch (error) {
    console.error(error);
    throw new Error(
      `Nous n'avons pas pu lire le fichier de commission ${file.filename}, contactez le développeur.`,
    );
  }
};

const mappingType = {
  production: ["chiffre", "arbitrage", "versements"],
  encours: ["encours", "gestion", "support "],
  structured: ["structured product"],
};

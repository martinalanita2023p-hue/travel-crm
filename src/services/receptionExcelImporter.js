import * as XLSX from "xlsx";

function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function toNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

/*
 * Find the row containing "Agents Name".
 *
 * We intentionally do NOT care about:
 * - worksheet name
 * - header row number
 * - column order
 */
function findHeaderRow(rows) {
  for (
    let rowIndex = 0;
    rowIndex < rows.length;
    rowIndex++
  ) {
    const row = rows[rowIndex] || [];

    const hasAgentHeader = row.some(
      (cell) =>
        normalizeHeader(cell) ===
        "AGENTS NAME"
    );

    if (hasAgentHeader) {
      return rowIndex;
    }
  }

  return -1;
}

/*
 * Find the worksheet containing the Reception
 * summary table.
 *
 * The worksheet name does not matter.
 */
function findReceptionSheet(workbook) {
  for (const sheetName of workbook.SheetNames) {
    const worksheet =
      workbook.Sheets[sheetName];

    if (!worksheet) continue;

    const rows =
      XLSX.utils.sheet_to_json(
        worksheet,
        {
          header: 1,
          defval: null,
          raw: true,
        }
      );

    const headerRowIndex =
      findHeaderRow(rows);

    if (headerRowIndex !== -1) {
      return {
        sheetName,
        worksheet,
        rows,
        headerRowIndex,
      };
    }
  }

  return null;
}


/*
 * Main Reception Excel importer.
 *
 * Supported:
 * .xlsx
 * .xls
 * .csv
 *
 * The importer looks at the CONTENT of the
 * worksheet rather than its name.
 */
export async function importReceptionExcel(
  file
) {
  if (!file) {
    throw new Error(
      "Please select an Excel file."
    );
  }

  const fileName =
    file.name?.toLowerCase() || "";

  const allowedExtensions = [
    ".xlsx",
    ".xls",
    ".csv",
  ];

  const validExtension =
    allowedExtensions.some(
      (extension) =>
        fileName.endsWith(extension)
    );

  if (!validExtension) {
    throw new Error(
      "Please upload an Excel or CSV file."
    );
  }

  const arrayBuffer =
    await file.arrayBuffer();

  const workbook = XLSX.read(
    arrayBuffer,
    {
      type: "array",
    }
  );

  if (
    !workbook.SheetNames ||
    workbook.SheetNames.length === 0
  ) {
    throw new Error(
      "The uploaded file does not contain any worksheets."
    );
  }

  /*
   * Search every worksheet for the
   * "Agents Name" header.
   */
  const receptionSheet =
    findReceptionSheet(workbook);

  if (!receptionSheet) {
    throw new Error(
      'Could not find a Reception table containing an "Agents Name" column.'
    );
  }

  const {
    sheetName,
    rows,
    headerRowIndex,
  } = receptionSheet;

  const headerRow =
    rows[headerRowIndex] || [];

  /*
   * Build column map from the actual headers.
   *
   * This means column order doesn't matter.
   */
  const columnMap = {};

  headerRow.forEach(
    (header, index) => {
      const normalized =
        normalizeHeader(header);

      if (normalized) {
        columnMap[normalized] =
          index;
      }
    }
  );

  /*
   * Required column.
   */
  if (
    columnMap["AGENTS NAME"] ===
    undefined
  ) {
    throw new Error(
      'The Reception table must contain an "Agents Name" column.'
    );
  }

  /*
   * Read the rows underneath the header.
   */
  const importedRows = [];

  for (
    let rowIndex =
      headerRowIndex + 1;
    rowIndex < rows.length;
    rowIndex++
  ) {
    const row =
      rows[rowIndex] || [];

    const rawAgentName =
      row[
        columnMap["AGENTS NAME"]
      ];

    /*
     * Ignore empty rows.
     */
    if (
      rawAgentName === null ||
      rawAgentName === undefined ||
      String(rawAgentName).trim() ===
        ""
    ) {
      continue;
    }

    const agentName =
      String(rawAgentName).trim();

    const normalizedAgentName =
      agentName.toUpperCase();

    /*
     * Ignore summary rows.
     */
    if (
      normalizedAgentName ===
        "GRAND TOTAL" ||
      normalizedAgentName ===
        "TOTAL"
    ) {
      continue;
    }

    importedRows.push({
      agent_name: agentName,

      dc:
        columnMap["DC"] !==
        undefined
          ? toNumber(
              row[
                columnMap["DC"]
              ]
            )
          : 0,

      ex_ind:
        columnMap["EX.IND"] !==
        undefined
          ? toNumber(
              row[
                columnMap["EX.IND"]
              ]
            )
          : 0,

      ex_usa:
        columnMap["EX.USA"] !==
        undefined
          ? toNumber(
              row[
                columnMap["EX.USA"]
              ]
            )
          : 0,

      maccall:
        columnMap["MACCALL"] !==
        undefined
          ? toNumber(
              row[
                columnMap["MACCALL"]
              ]
            )
          : 0,

      managercall:
        columnMap["MANAGERCALL"] !==
        undefined
          ? toNumber(
              row[
                columnMap["MANAGERCALL"]
              ]
            )
          : 0,

      namecall:
        columnMap["NAMECALL"] !==
        undefined
          ? toNumber(
              row[
                columnMap["NAMECALL"]
              ]
            )
          : 0,

      /*
       * SC = Schedule Change
       */
      schedule_change:
        columnMap["SC"] !==
        undefined
          ? toNumber(
              row[
                columnMap["SC"]
              ]
            )
          : 0,

      grand_total:
        columnMap["GRAND TOTAL"] !==
        undefined
          ? toNumber(
              row[
                columnMap["GRAND TOTAL"]
              ]
            )
          : 0,
    });
  }

  if (
    importedRows.length === 0
  ) {
    throw new Error(
      "No agent rows were found in the Reception table."
    );
  }

  /*
   * Return clean data for the
   * Reception preview.
   *
   * Nothing is saved to Supabase here.
   */
  return {
    fileName: file.name,
    sheetName,
    headerRowIndex,
    columnsFound:
      Object.keys(columnMap),
    rows: importedRows,
    totalAgents:
      importedRows.length,
  };
}
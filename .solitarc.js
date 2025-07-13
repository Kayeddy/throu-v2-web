const path = require("path");

const programName = "program_real_state";
const programId = "GBVDdRqWoge6nFPEcXQLtcPyihcfptLAYyBHkGvvAxai";
const idlDir = path.join(__dirname, "src", "utils", "idls");
const sdkDir = path.join(__dirname, "src", "generated", "solana");
const binaryInstallDir = path.join(__dirname, ".crates");

module.exports = {
  idlGenerator: "anchor",
  programName,
  programId,
  idlDir,
  sdkDir,
  binaryInstallDir,
  formatCode: true,
  typeAliases: {
    // Add any type aliases if needed
  },
  serializers: {
    // Add custom serializers if needed
  },
  anchorRemainingAccounts: false,
  removeExistingIdl: false, // Prevent removing our IDL file
};

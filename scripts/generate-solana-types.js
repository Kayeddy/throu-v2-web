const path = require("path");
const { Solita } = require("@metaplex-foundation/solita");
const fs = require("fs");

async function generateSolanaTypes() {
  try {
    console.log("🔄 Starting Solana TypeScript generation...");

    // Paths
    const idlPath = path.join(
      __dirname,
      "..",
      "src",
      "utils",
      "idls",
      "program_real_state.json"
    );
    const outputDir = path.join(__dirname, "..", "src", "generated", "solana");

    // Check if IDL file exists
    if (!fs.existsSync(idlPath)) {
      console.error("❌ IDL file not found at:", idlPath);
      console.error(
        "📋 Please place your IDL file at: src/utils/idls/program_real_state.json"
      );
      process.exit(1);
    }

    // Load IDL
    console.log("📖 Loading IDL from:", idlPath);
    const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));

    // Ensure IDL has program ID
    if (!idl.metadata || !idl.metadata.address) {
      console.log("🔧 Adding program ID to IDL metadata...");
      idl.metadata = {
        ...idl.metadata,
        address: "8GYVnwsURhjhjDktJ7vNggS7jkgunEyTbpbvHbJxXd8q",
      };
    }

    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate TypeScript SDK
    console.log("⚙️ Generating TypeScript SDK...");
    const gen = new Solita(idl, {
      formatCode: true,
      anchorRemainingAccounts: false,
    });

    await gen.renderAndWriteTo(outputDir);

    console.log("✅ Successfully generated Solana TypeScript SDK!");
    console.log("📁 Output directory:", outputDir);
    console.log(
      "🎉 You can now import generated types and instructions from src/generated/solana"
    );
  } catch (error) {
    console.error("❌ Error generating Solana types:", error);
    process.exit(1);
  }
}

generateSolanaTypes();

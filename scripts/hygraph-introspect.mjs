import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env");

// Parse .env manually
const envContent = readFileSync(envPath, "utf-8");
const tokenMatch = envContent.match(/HYGRAPH_TOKEN\s*=\s*(.+)/);
if (!tokenMatch) throw new Error("HYGRAPH_TOKEN not found in .env");
const token = tokenMatch[1].trim();

const ENDPOINT =
  "https://eu-west-2.cdn.hygraph.com/content/cmnylbgot01mo07us6qai7jya/master";

async function query(q) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: q }),
  });
  return res.json();
}

// 1. Get Projet fields
const fieldsResult = await query(`{
  __type(name: "Projet") {
    fields {
      name
      type { name kind ofType { name kind } }
    }
  }
}`);

console.log("=== Champs du type Projet ===");
fieldsResult.data.__type.fields.forEach((f) => {
  const typeName =
    f.type.name || `${f.type.kind}(${f.type.ofType?.name ?? "?"})`;
  console.log(`  ${f.name}: ${typeName}`);
});

// 2. Fetch actual projets
const projetsResult = await query(`{
  projets {
    id
    createdAt
    updatedAt
    publishedAt
  }
}`);

console.log("\n=== Projets (raw) ===");
console.log(JSON.stringify(projetsResult, null, 2));

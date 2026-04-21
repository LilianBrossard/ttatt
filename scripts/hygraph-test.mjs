import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(join(__dirname, "..", ".env"), "utf-8");
const token = envContent.match(/HYGRAPH_TOKEN\s*=\s*(.+)/)[1].trim();

const ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmnylbgot01mo07us6qai7jya/master";

async function gql(query) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

// Check exact type of texte, videos, liens on Projet
const result = await gql(`{
  __type(name: "Projet") {
    fields {
      name
      type {
        name
        kind
        ofType {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
}`);

console.log("Projet field types:");
result.data.__type.fields.forEach(f => {
  const t = f.type;
  const str = `${t.kind}(${t.name ?? '?'}) -> ${t.ofType?.kind}(${t.ofType?.name ?? '?'}) -> ${t.ofType?.ofType?.kind}(${t.ofType?.ofType?.name ?? '?'})`;
  console.log(`  ${f.name}: ${str}`);
});

// Now try a basic query with scalar fields only
const q = `
{
  __type(name: "Query") {
    fields {
      name
    }
  }
}
`;
const projets = await gql(q);
console.log("\nBasic projets query:", JSON.stringify(projets, null, 2));

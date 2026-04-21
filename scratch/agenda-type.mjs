import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(join(__dirname, '..', '.env'), 'utf-8');
const tokenMatch = envContent.match(/HYGRAPH_TOKEN\s*=\s*(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

const ENDPOINT = 'https://eu-west-2.cdn.hygraph.com/content/cmnylbgot01mo07us6qai7jya/master';

const query = `
{
  agendas(first: 10) {
    id
    titre
    description
    dateEtHeure
    lieu
    lien
    image {
      url
      fileName
      width
      height
    }
  }
}
`;

fetch(ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  },
  body: JSON.stringify({ query })
}).then(r => r.json()).then(d => {
  console.log(JSON.stringify(d, null, 2));
}).catch(console.error);

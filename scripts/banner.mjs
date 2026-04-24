import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

const banner = `
${CYAN}${BOLD}
   _____                                 __  ___                                      
  / ___/_________  ____ _____ ___  ___   /  |/  /___ _____  ____ _____ ____  _____    
  \\__ \\/ ___/ __ \\/ __ \`/ __ \`__ \\/ _ \\ / /|_/ / __ \`/ __ \\/ __ \`/ __ \`/ _ \\/ ___/    
 ___/ / /__/ /_/ / /_/ / / / / / /  __// /  / / /_/ / / / / /_/ / /_/ /  __/ /        
/____/\\___/\\____/\\__,_/_/ /_/ /_/\\___//_/  /_/\\__,_/_/ /_/\\__,_/\\__, /\\___/_/         
                                                              /____/                 
${RESET}
  ${GREEN}${BOLD}Score Management System${RESET}  ${GREEN}v${pkg.version}${RESET}
`;

console.log(banner);

export default true;
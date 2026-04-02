const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            content = content.replace(/\(change\)=/g, '(ngModelChange)=');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Modified (change):', fullPath);
            }
        }
    }
}
replaceInDir('c:/Users/sashw/OneDrive/Documents/GitHub/SLCMS/frontend/frontend-app/src/app/pages');

// Also fix the zone.js global issue in app.config.ts and main.ts so we don't need manual ChangeDetectorRef everywhere!
const appConfigPath = 'c:/Users/sashw/OneDrive/Documents/GitHub/SLCMS/frontend/frontend-app/src/app/app.config.ts';
let appConfig = fs.readFileSync(appConfigPath, 'utf8');
if (!appConfig.includes('provideZoneChangeDetection')) {
    appConfig = appConfig.replace(
        "import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';",
        "import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';"
    );
    appConfig = appConfig.replace(
        "providers: [",
        "providers: [\n    provideZoneChangeDetection({ eventCoalescing: true }),"
    );
    fs.writeFileSync(appConfigPath, appConfig, 'utf8');
    console.log('Modified zone in app.config.ts');
}

const mainTsPath = 'c:/Users/sashw/OneDrive/Documents/GitHub/SLCMS/frontend/frontend-app/src/main.ts';
let mainTs = fs.readFileSync(mainTsPath, 'utf8');
if (!mainTs.includes('zone.js')) {
    fs.writeFileSync(mainTsPath, "import 'zone.js';\n" + mainTs, 'utf8');
    console.log('Added zone.js to main.ts');
}

const { join } = require('path');
const { readFileSync } = require('fs');
const { buildProject, cleanBuildDirectory, mergeInjectFiles } = require('./buildHelper');


// define paths
const PROJECT_ROOT = join(__dirname, '..', '..');
const PACKAGE_JSON_PATH = join(PROJECT_ROOT, 'package.json');

const SOURCE_ROOT = join(PROJECT_ROOT, require(PACKAGE_JSON_PATH).config.sourceDir);
const BUILD_ROOT = join(PROJECT_ROOT, require(PACKAGE_JSON_PATH).config.buildDir);
const LICENSE_FILE = join(PROJECT_ROOT, require(PACKAGE_JSON_PATH).config.licenseFile);

const STANDALONE_DIR = join(BUILD_ROOT, 'standalone');

// clean build directory
cleanBuildDirectory(BUILD_ROOT);

// build main script
const mainProjectDir = 'main';
buildProject({
    entryPoints: [join(SOURCE_ROOT, mainProjectDir, 'index.js')],
    outfile: join(STANDALONE_DIR, 'inject.js'),
    sourceRoot: join(SOURCE_ROOT, mainProjectDir),
    bundle: true,
    packages: 'bundle',
    treeShaking: true,
    sourcemap: 'inline',
    minify: false,
    banner: {
        "js": readFileSync(LICENSE_FILE, 'utf-8')
            .split('\n')
            .map(line => `// ${line}`)
            .join('\n') + '\n'
    },
});

// build preload script
const preloadProjectDir = 'preload';
buildProject({
    entryPoints: [join(SOURCE_ROOT, preloadProjectDir, 'index.js')],
    outfile: join(STANDALONE_DIR, 'index.js'),
    sourceRoot: join(SOURCE_ROOT, preloadProjectDir),
    bundle: false,
    packages: 'external',
    treeShaking: false,
    sourcemap: 'inline',
    minify: false,
    banner: {
        "js": readFileSync(LICENSE_FILE, 'utf-8')
            .split('\n')
            .map(line => `// ${line}`)
            .join('\n') + '\n'
    },
});
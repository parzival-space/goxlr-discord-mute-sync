const { join, dirname, basename } = require('path');
const { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } = require('fs');
const esbuild = require('esbuild');

module.exports = {
    /**
     * Builds the project using esbuild.
     * @param options {esbuild.BuildOptions}
     * @param quitOnError {boolean} - If true, the process will exit on build errors.
     * @return {esbuild.BuildResult<esbuild.BuildOptions>}
     */
    buildProject: function (options, quitOnError = true) {
        console.log(
            `Building Project: ${dirname(options.sourceRoot)} \n` +
            `> ${options.sourceRoot}\n` +
            options.entryPoints
                .map(entryPoint => `  > ${basename(entryPoint)} -> ${join(options.outdir, entryPoint)}`)
                .join('\n')
        );

        // build the project
        const result = esbuild.buildSync(options);

        if (result.errors.length > 0) {
            console.error(`Build failed with errors:`);
            result.errors.forEach(err => console.error(err));
            if (quitOnError) {
                process.exit(1);
            }
        } else {
            console.log(`Build completed successfully.`);
        }

        return result;
    },

    /**
     * Cleans the build directory by removing it and creating a new one.
     * @param buildDir {string} - The path to the build directory.
     */
    cleanBuildDirectory: function (buildDir) {
        console.log(`Cleaining build directory: ${buildDir}`);
        if (!existsSync(buildDir)) {
            mkdirSync(buildDir, { recursive: true });
            return;
        }

        rmSync(buildDir, { recursive: true });
        mkdirSync(buildDir, { recursive: true });
    },

    /**
     * Injects code from a file into another file at a specific placeholder.
     * @param targetFile {string} - The file to inject code into.
     * @param sourceFile {string} - The file containing the code to inject.
     * @param placeholder {string} - The placeholder in the target file where the code will be injected.
     */
    mergeInjectFiles: function (sourceFile, injectFile, outputPath, injectPlaceholder = '@injectCode') {
        console.log(`Merging files: ${sourceFile} + ${injectFile} -> ${outputPath}`);

        // read the files
        const sourceContent = readFileSync(sourceFile, 'utf-8');
        const injectContent = readFileSync(injectFile, 'utf-8');

        // replace the placeholder with the inject content
        const mergedContent = sourceContent.replace(injectPlaceholder, injectContent);

        // write the merged content to the output file
        writeFileSync(outputPath, mergedContent, 'utf-8');
    }
}
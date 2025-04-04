
const fs = require('fs');
const { program } = require('commander');

program
    .requiredOption('-i, --input <path>', 'шлях до вхідного файлу (JSON з даними)')
    .option('-o, --output <path>', 'шлях до файлу для запису результату')
    .option('-d, --display', 'вивід результату у консоль');

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
    console.error("Please, specify input file");
    process.exit(1);
}

if (!fs.existsSync(options.input)) {
    console.error("Cannot find input file");
    process.exit(1);
}

try {
    const rawData = fs.readFileSync(options.input, 'utf8');
    const jsonData = JSON.parse(rawData);

    let resultLines = [];

    if (Array.isArray(jsonData)) {
        resultLines = jsonData.map(item => {
            const stockCode = item.StockCode || '';
            const valCode = item.ValCode || '';
            const attraction = item.Attraction || '';
            return `${stockCode}-${valCode}-${attraction}`;
        });
    } else if (typeof jsonData === 'object') {
        resultLines.push(`${jsonData.StockCode || ''}-${jsonData.ValCode || ''}-${jsonData.Attraction || ''}`);
    }

    const result = resultLines.join('\n');

    if (options.display) {
        console.log(result);
    }

    if (options.output) {
        fs.writeFileSync(options.output, result, 'utf8');
    }
} catch (error) {
    console.error("Error processing file:", error.message);
    process.exit(1);
}

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'src', 'assets', 'icons');
const outputFile = path.join(__dirname, '..', 'src', 'components', 'ui', 'SvgIcon.tsx');

function main() {
  if (!fs.existsSync(iconsDir)) {
    console.error('Icons directory does not exist.');
    return;
  }

  const files = fs.readdirSync(iconsDir);
  const xmls = {};

  files.forEach((file) => {
    if (path.extname(file) === '.svg') {
      const name = path.basename(file, '.svg');
      const content = fs.readFileSync(path.join(iconsDir, file), 'utf-8');

      // Clean up SVG content a bit (remove xml declaration if present)
      const cleanContent = content
        .replace(/<\?xml.*\?>/g, '')
        .replace(/<!DOCTYPE.*>/g, '')
        .trim();

      xmls[name] = cleanContent;
    }
  });

  const code = `import React from 'react';
import { SvgXml } from 'react-native-svg';

export const SVG_XMLS = ${JSON.stringify(xmls, null, 2)} as const;

export type SvgIconName = keyof typeof SVG_XMLS;

interface SvgIconProps {
  name: SvgIconName;
  width?: number | string;
  height?: number | string;
  fill?: string;
  stroke?: string;
  className?: string;
}

export function SvgIcon({
  name,
  width,
  height,
  fill,
  stroke,
  className
}: SvgIconProps) {
  let xml = SVG_XMLS[name];
  if (!xml) {
    console.warn(\`SvgIcon: Icon "\${name}" not found.\`);
    return null;
  }

  // Dynamically replace color vars/fills if props are provided
  if (fill) {
    xml = xml.replace(/fill="[^"]*"/g, \`fill="\${fill}"\`);
  }
  if (stroke) {
    xml = xml.replace(/stroke="[^"]*"/g, \`stroke="\${stroke}"\`);
  }

  return <SvgXml xml={xml} width={width} height={height} className={className} />;
}
`;

  fs.writeFileSync(outputFile, code, 'utf-8');
  console.log(`Generated SvgIcon.tsx at ${outputFile}`);
}

main();

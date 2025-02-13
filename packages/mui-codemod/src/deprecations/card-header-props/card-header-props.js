import movePropIntoSlotProps from '../utils/movePropIntoSlotProps';

/**
 * @param {import('jscodeshift').FileInfo} file
 * @param {import('jscodeshift').API} api
 */
export default function transformer(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const printOptions = options.printOptions;

  movePropIntoSlotProps(j, {
    root,
    componentName: 'CardHeader',
    propName: 'titleTypographyProps',
    slotName: 'title',
  });

  movePropIntoSlotProps(j, {
    root,
    componentName: 'CardHeader',
    propName: 'subheaderTypographyProps',
    slotName: 'subheader',
  });

  return root.toSource(printOptions);
}

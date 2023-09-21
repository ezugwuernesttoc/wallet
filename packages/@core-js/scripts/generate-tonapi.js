const { generateApi } = require('swagger-typescript-api');
const path = require('path');

generateApi({
  url: 'https://raw.githubusercontent.com/tonkeeper/opentonapi/master/api/openapi.yml',
  output: path.resolve(__dirname, '../src/TonAPI'),
  name: 'TonAPIGenerated',
  extractRequestParams: true,
  apiClassName: 'TonAPIGenerated',
  hooks: {
    onFormatTypeName: (typeName) => {
      if (typeName === 'NftItem') {
        return `Raw${typeName}`;
      }

      return typeName;
    },
  },
  moduleNameIndex: 1,
  extractEnums: true,
  singleHttpClient: true,
  unwrapResponseData: true,
});

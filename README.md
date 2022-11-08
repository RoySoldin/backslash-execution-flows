# Backslash execution flow mapping

Find execution flows which starts at Lambda / API and ends in DynamoDb sink

## Description

Flow:
1. Clone the example repo
2. Map all *.ts files which resides in the repo folder
3. For each file (without node_modules files) build AST using type script parser
4. Using recursion build execution flows which ends in DynamoDb function call
5. Create a json file which maps between file name to it's execution flows

Execution flows output example:
```
{
  "delete-product.ts": [
    [
      {
        "indentLevel": 0,
        "lineNumber": 0,
        "syntaxType": "SourceFile",
        "nodeText": "import { APIGatewayProxyEvent, APIGatewayProxyResult } from \"aws-lambda\";\nimport { DynamoDbStore } f..."
      },
      {
        "indentLevel": 4,
        "lineNumber": 12,
        "syntaxType": "ArrowFunction",
        "nodeText": "async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {\n\n  logger.appendKeys({\n    ..."
      },
      {
        "indentLevel": 10,
        "lineNumber": 32,
        "syntaxType": "CallExpression",
        "nodeText": "store.deleteProduct(id)"
      }
    ]
  ],
  "get-product.ts": [
    [
      {
        "indentLevel": 0,
        "lineNumber": 0,
        "syntaxType": "SourceFile",
        "nodeText": "import { APIGatewayProxyEvent, APIGatewayProxyResult } from \"aws-lambda\";\nimport { DynamoDbStore } f..."
      },
      {
        "indentLevel": 4,
        "lineNumber": 12,
        "syntaxType": "ArrowFunction",
        "nodeText": "async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {\n\n  logger.appendKeys({\n    ..."
      },
      {
        "indentLevel": 12,
        "lineNumber": 31,
        "syntaxType": "CallExpression",
        "nodeText": "store.getProduct(id)"
      }
    ]
  ],
  "get-products.ts": [
    [
      {
        "indentLevel": 0,
        "lineNumber": 0,
        "syntaxType": "SourceFile",
        "nodeText": "import { APIGatewayProxyEvent, APIGatewayProxyResult} from \"aws-lambda\";\nimport { DynamoDbStore } fr..."
      },
      {
        "indentLevel": 4,
        "lineNumber": 13,
        "syntaxType": "ArrowFunction",
        "nodeText": "async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {\n\n  logger.appendKeys({\n    ..."
      },
      {
        "indentLevel": 12,
        "lineNumber": 20,
        "syntaxType": "CallExpression",
        "nodeText": "store.getProducts()"
      }
    ]
  ],
  "put-product.ts": [
    [
      {
        "indentLevel": 0,
        "lineNumber": 0,
        "syntaxType": "SourceFile",
        "nodeText": "import { APIGatewayProxyEvent, APIGatewayProxyResult } from \"aws-lambda\";\nimport { Product } from \"...."
      },
      {
        "indentLevel": 4,
        "lineNumber": 13,
        "syntaxType": "ArrowFunction",
        "nodeText": "async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {\n\n  logger.appendKeys({\n    ..."
      },
      {
        "indentLevel": 10,
        "lineNumber": 74,
        "syntaxType": "CallExpression",
        "nodeText": "store.putProduct(product)"
      }
    ]
  ]
}
```

## Assumptions

1. The exmaple repo URL is constant, if this is not the case we can get repo URL from the user when running the program
2. The DynamoDBstore name is always store, if this is not the case we can find the name by searching for the NewExpression where DynamoDbStore instance is created and grep it's name 

## Getting Started

run the following commands to install and execute:

```
npm install
npx tsc
node index.js
```

## Authors

Contributors names and contact info

Roy Soldin  

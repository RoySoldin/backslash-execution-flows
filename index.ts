import * as ts from 'typescript';
import * as fs from 'fs';
const glob = require('glob');
const shell = require('shelljs')

interface executionNode {
    indentLevel: number;
    lineNumber: number;
    syntaxType: string;
    nodeText: string;
}

// Clone the example repo to current dirctory
shell.cd(__dirname)
shell.exec('git clone https://github.com/aws-samples/serverless-typescript-demo.git')

var executionFlowsByFile: { [id: string]: executionNode[][]; } = {};
var fileExecutionFlows : executionNode[][] = []

var getDirectories = function (src: string, callback: (err: any, res: any) => void) {
    glob(src + '/**/*.ts', callback);
};

// Get all ts files in the cloned directory and for get execution flows for each file which is not under node_modules directory
getDirectories(__dirname + '/serverless-typescript-demo', function (err: any, res: string[]) {
    if (err) {
        console.log('Error', err);
    } else {
        res.forEach((file_path) => {
            if(!file_path.includes('node_modules')){
                var filename = file_path.replace(/^.*[\\\/]/, '')
                var sourceFile = ts.createSourceFile(filename, 
                                        fs.readFileSync(file_path,'utf8'), 
                                        ts.ScriptTarget.ES2015, true, ts.ScriptKind.TS);

                fileExecutionFlows = [];    
                buildFileExecutionFlows(sourceFile, 0, sourceFile, []);
                if(fileExecutionFlows.length > 0){
                    executionFlowsByFile[filename] = fileExecutionFlows;
                }
            }
        })
        // Write execution flows per ts file to a json file
        var json = JSON.stringify(executionFlowsByFile);
        console.log('Writing repo execution flows to execution_flows_by_file.json file...')
        fs.writeFile('execution_flows_by_file.json', json, 'utf8', () => {});
        console.log('Execution flows:');
        console.log(executionFlowsByFile);
        }
});


function buildFileExecutionFlows(
    node: ts.Node, indentLevel: number, sourceFile: ts.SourceFile, executionFlow: executionNode[]
  ) {
    const syntaxKind = ts.SyntaxKind[node.kind];
    const nodeText = node.getText(sourceFile);
    
    var execNode = {
        indentLevel: indentLevel,
        lineNumber: sourceFile.getLineAndCharacterOfPosition(node.pos).line,
        syntaxType: syntaxKind,
        nodeText: (nodeText.length < 100) ? nodeText : nodeText.substring(0,100) + '...'
    }

    // Use the name of DynamoDbStore instance to look for db function calls
    // Could be done dynamiclly by searching for the NewExpression where the instance is initialize and extract it's name
    if(nodeText.includes('store.') && syntaxKind.includes('CallExpression')){
        executionFlow.push(execNode);
        // End of an execution flow, push the flow to the file flows
        fileExecutionFlows.push(executionFlow);
    }

    // Add the source file and functions to the execution flow
    if(syntaxKind.includes('Function') || syntaxKind.includes('SourceFile')){
        executionFlow.push(execNode)
    }

    // Recursion call
    node.forEachChild(child =>
        buildFileExecutionFlows(child, indentLevel + 1, sourceFile, executionFlow)
    );
  }
  



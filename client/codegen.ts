import "dotenv"
import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {

    schema: process.env.GRAPHQL_URL,
    // this assumes that all your source files are in a top-level 'src/` directory - you might need to adjust this to your file structure.
    documents: ["src/**/*.{ts, tsx, js, jsx}"],
    generates: {
       "./src/__generated__/": {
            preset: "client",
            plugins: [],
            presetConfig: {
                useTypeImports: true,
                gqlTagName: "gql",
                enumsAsTypes: true
            },
            config: {
                useTypeImports: true,
                //gqlTagName: "gql",
                enumsAsTypes: true
            }
        },
       },
    ignoreNoDocuments: true,
};

export default config;

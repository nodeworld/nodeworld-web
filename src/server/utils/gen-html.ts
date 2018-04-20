import { renderToString } from "react-dom/server";

export const genHtml = (manifest?: { main: string, vendor: string }, app?: any) => `
<!DOCTYPE HTML>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nodeworld</title>
    </head>
    <body>
        <div id="root">
            ${ app && app }
        </div>
        ${ app && manifest ?
            `
            <script src="dist/${manifest.vendor}"></script>
            <script src="dist/${manifest.main}"></script>
            `
            :
            `<script src="dist/main.bundle.js"></script>`
        }
    </body>
</html>
`;
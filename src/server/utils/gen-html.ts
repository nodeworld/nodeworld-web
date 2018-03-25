import { renderToString } from "react-dom/server";

export const genHtml = (app?: any) => `
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
        <script src="dist/main.bundle.js"></script>
    </body>
</html>
`;
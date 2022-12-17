import {Hono} from 'hono'
import {cors} from 'hono/cors';
import wasm from "../wasm/backend_bg.wasm";
import init, {endianness} from "../wasm/backend";

// See https://honojs.dev/docs/examples/ for more examples.
export interface Bindings {
    // DB: D1Database;

    // docs: https://developers.cloudflare.com/r2/data-access/workers-api/workers-api-reference/
    // R2: R2Bucket;

    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    // MY_KV_NAMESPACE: KVNamespace;
    
    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace;

    // Following https://honojs.dev/docs/getting-started/cloudflare-workers/#bindings
    // Add environment variables here:
    APPNAME: string;
    // ENV_1: string;
    // ENV_2: string;
}

type Env = {
    Bindings: Bindings,
}

const app = new Hono<Env>()

const createCorsOrigin = (origin: string, corsDomain: string): string => {
    console.info(`Origin visited: ${origin}`)
    // Need to accept 'http://localhost:58159' with abtrary ports.
    const regex = /http:\/\/localhost:\d+/;
    const isLocalhost = origin.match(regex)
    if (isLocalhost) return origin;
    // Handle subdomains
    if (origin.endsWith(`.${corsDomain}`)) return origin;
    // Handle exact paths:
    const defaultCorsDomainHttps = `https://${corsDomain}`
    if (origin == defaultCorsDomainHttps) return defaultCorsDomainHttps;
    return defaultCorsDomainHttps;
}

// These custom middlewares exist to give environment variables to the
// createCorsOrigin function taken from context
app.use('/api/*', async (ctx, next) => cors({
    origin: (origin: string) => createCorsOrigin(origin, ctx.env.APPNAME)
})(ctx, next))
// CORS Preflight request
app.options('*', async (ctx) => ctx.body(null, 200))

let jsEndianness = () => {
    let uInt32 = new Uint32Array([0x11223344]);
    let uInt8 = new Uint8Array(uInt32.buffer);

    if (uInt8[0] === 0x44) {
        return 'Little Endian';
    } else if (uInt8[0] === 0x11) {
        return 'Big Endian';
    } else {
        return 'Maybe mixed-endian?';
    }
};

app.get('/', async ctx => {
    await init(wasm);
    console.log(`Javascript endianness: ${jsEndianness()}`);
    console.log(`Rust endianness: ${endianness()}`);
    return ctx.body("Endianness has been logged to the server. " +
        "Run `wrangler tail` with credentials and refetch this URL.", 200);
})

export default app;

import {Hono} from 'hono'
import {cors} from 'hono/cors';

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

app.get('/', async ctx => {
    return ctx.body("Hello Cloudflare.", 200);
})

export default app;

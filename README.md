# Template for Cloudflare Worker

Includes:
- Typescript and Rust (using Wasm)
    - Typescript:
        - Vitest
        - pnpm for dependency management
        - esbuild for bundling
    - Rust:
        - Example getting endianness in Javascript and Wasm/Rust.
        - wasm-bindgen
        - wasm-pack
        - wasm-opt
- Miniflare (only works if you don't enable Wasm)

## Useful commands:

### Prerequisites
- Optional: [install wrangler globally](https://developers.cloudflare.com/workers/wrangler/install-and-update/#install-wrangler-globally) by running `npm install --global wrangler`

### For backend
- Install nodeJS 18 LTS. 
  - I've found that Node installed using NVM might cause errors with applying SQL commands to D1. See [BUG: Can't execute D1 SQL](https://github.com/cloudflare/wrangler2/issues/2220#issuecomment-1355587661). So install Node from the nodeJS website instead.
- Install non-project-specific tools: 
  - run `npm install --global wrangler pnpm miniflare` 
- Install dependencies: `pnpm i`
- Run backend locally: `wrangler dev`
- Deploy backend application: `wrangler publish`
    - Read logs in realtime: `wrangler tail`
    - Warning: if you use Wasm and use the wrong imports in your typescript file, the worker can be quite large.
    - The maximum the worker  can be is 5MB.
- Reset database to `schema.sql`:
    - Reset preview database: `wrangler d1 execute appname_preview --file schemas/schema.sql`
    - Reset production database: `wrangler d1 execute appname --file schemas/schema.sql`

## Rust worker compilation
    - Install wasm-pack: run `curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh`
        - Ensure it is the latest version from . Check your current version by running `wasm-pack -V`. Install using another method if necessary. I found reinstalling it with the same command fixed it.
    - Install worker-build, run `cargo install -q worker-build`
    - Install wasm-bindgen: `cargo install wasm-bindgen-cli`
    - Install rust using [rust-up](https://rustup.rs/): run `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
    - Launch the backend dev server: run `wrangler dev`

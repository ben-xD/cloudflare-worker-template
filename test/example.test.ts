import {describe, it, expect} from "vitest";
import app from '../src/index';

describe('Test the application', () => {
    it('Should return 200 response', async () => {
        const res = await app.request('http://localhost/')
        expect(res.status).toBe(200)
		const response = await res.text()
        expect(response).toBe("Hello Cloudflare.")
    })
})
  
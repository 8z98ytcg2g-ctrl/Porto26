import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'
import fs from 'fs'

const CONTENT_MIMES = {
  '.json': 'application/json',
  '.csv': 'text/csv; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4',
}

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [{ src: 'content', dest: '.' }],
    }),
    {
      name: 'serve-content',
      configureServer(server) {
        server.middlewares.use('/content', (req, res, next) => {
          const filePath = path.join(
            process.cwd(),
            'content',
            decodeURIComponent(req.url)
          )
          try {
            const stat = fs.statSync(filePath)
            if (stat.isFile()) {
              const ext = path.extname(filePath).toLowerCase()
              res.setHeader(
                'Content-Type',
                CONTENT_MIMES[ext] || 'application/octet-stream'
              )
              fs.createReadStream(filePath).pipe(res)
            } else {
              next()
            }
          } catch {
            next()
          }
        })
      },
    },
  ],
})

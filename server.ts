/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '30mb' }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. Start Veo Video Generation: POST /api/generate-video
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, imageBytes, mimeType, aspectRatio } = req.body;
    const ai = getGeminiClient();

    const selectedAspectRatio: '16:9' | '9:16' =
      aspectRatio === '16:9' ? '16:9' : '9:16';

    const defaultPrompt =
      'Un video sagrado de Primera Comunión con suave brisa celestial, cálidos destellos de luz dorada divina, sutiles pétalos blancos y atmósfera de paz reverente.';

    const payload: Parameters<typeof ai.models.generateVideos>[0] = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: (prompt && prompt.trim().length > 0) ? prompt.trim() : defaultPrompt,
      config: {
        numberOfVideos: 1,
        aspectRatio: selectedAspectRatio,
      },
    };

    if (imageBytes && typeof imageBytes === 'string') {
      // Strip potential data URL prefix
      const cleanBytes = imageBytes.includes(',')
        ? imageBytes.split(',')[1]
        : imageBytes;

      payload.image = {
        imageBytes: cleanBytes,
        mimeType: mimeType || 'image/jpeg',
      };
    }

    const operation = await ai.models.generateVideos(payload);
    return res.json({ operationName: operation.name });
  } catch (error: unknown) {
    console.error('Error generating video with Veo:', error);
    const message = error instanceof Error ? error.message : 'Error al solicitar generación de video';
    return res.status(500).json({ error: message });
  }
});

// 2. Poll Veo Video Status: POST /api/video-status
app.post('/api/video-status', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'Falta operationName' });
    }

    const ai = getGeminiClient();
    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });
    return res.json({
      done: Boolean(updated.done),
      error: updated.error || null,
    });
  } catch (error: unknown) {
    console.error('Error polling video status:', error);
    const message = error instanceof Error ? error.message : 'Error al consultar estado del video';
    return res.status(500).json({ error: message });
  }
});

// 3. Download Generated Video: POST /api/video-download
app.post('/api/video-download', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'Falta operationName' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Falta GEMINI_API_KEY' });
    }

    const ai = getGeminiClient();
    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });
    const videoUri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!videoUri) {
      return res.status(404).json({ error: 'No se encontró la URI del video generado' });
    }

    const videoRes = await fetch(videoUri, {
      headers: {
        'x-goog-api-key': apiKey,
      },
    });

    if (!videoRes.ok) {
      return res.status(videoRes.status).json({ error: 'Error al descargar el video de Google Cloud' });
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="primera-comunion-veo.mp4"');

    if (videoRes.body) {
      const arrayBuffer = await videoRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return res.send(buffer);
    } else {
      return res.status(500).json({ error: 'Cuerpo de video vacío' });
    }
  } catch (error: unknown) {
    console.error('Error downloading video:', error);
    const message = error instanceof Error ? error.message : 'Error al descargar video';
    return res.status(500).json({ error: message });
  }
});

// Mount Vite middleware for dev / serve dist in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

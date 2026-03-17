import { Router, Request, Response } from 'express';
import { getJobStatus } from '../cache/redis';

export const statusRouter = Router();

// GET /score/status/:jobId
statusRouter.get('/status/:jobId', async (req: Request, res: Response): Promise<void> => {
  const { jobId } = req.params;

  if (!jobId) {
    res.status(400).json({ error: 'jobId is required' });
    return;
  }

  try {
    const job = await getJobStatus(jobId);

    if (!job) {
      res.status(404).json({ error: 'Job not found or expired' });
      return;
    }

    res.json(job);

  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

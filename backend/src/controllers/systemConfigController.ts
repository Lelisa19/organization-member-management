import { Request, Response } from 'express';

export type SystemConfig = {
  platformName: string;
  supportEmail: string;
  maintenanceMode: boolean;
};

// In-memory config for the demo. Replace with DB-backed storage if needed.
let currentConfig: SystemConfig = {
  platformName: 'OMMS',
  supportEmail: 'support@example.com',
  maintenanceMode: false,
};

export const getSystemConfig = (_req: Request, res: Response) => {
  res.status(200).json(currentConfig);
};

export const updateSystemConfig = (req: Request, res: Response) => {
  try {
    const { platformName, supportEmail, maintenanceMode } = req.body as Partial<SystemConfig>;

    if (typeof platformName !== 'string' || !platformName.trim()) {
      return res.status(400).json({ message: 'platformName is required' });
    }
    if (typeof supportEmail !== 'string' || !supportEmail.trim()) {
      return res.status(400).json({ message: 'supportEmail is required' });
    }
    if (typeof maintenanceMode !== 'boolean') {
      return res.status(400).json({ message: 'maintenanceMode must be a boolean' });
    }

    currentConfig = {
      platformName: platformName.trim(),
      supportEmail: supportEmail.trim(),
      maintenanceMode,
    };

    res.status(200).json(currentConfig);
  } catch (error) {
    res.status(500).json({ message: 'Error updating system config', error });
  }
};


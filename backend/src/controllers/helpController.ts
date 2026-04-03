import { Response } from 'express';

/**
 * Help copy and nav links for the org-admin header — served from API so the client does not embed content.
 */
export const getHelpResources = (_req: unknown, res: Response) => {
  res.status(200).json({
    intro:
      'Manage members under Members, schedules under Events, and organization defaults under Settings.',
    links: [
      { label: 'Contact support', path: '/contact' },
      { label: 'About OMMS', path: '/about' },
    ],
  });
};

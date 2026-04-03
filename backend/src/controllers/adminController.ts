import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const getOrganizations = async (req: any, res: Response) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({ message: 'Forbidden: SuperAdmin only' });
  }

  try {
    const organizations = await prisma.user.findMany({
      where: { role: 'orgAdmin' },
      include: { plan: true, members: true },
    });
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organizations', error });
  }
};

export const createOrganization = async (req: any, res: Response) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({ message: 'Forbidden: SuperAdmin only' });
  }

  try {
    const { name, email, password, organization_name, organization_type, plan_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const organization = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        organization_name,
        organization_type,
        role: 'orgAdmin',
        plan_id: plan_id ? parseInt(plan_id) : undefined,
      },
    });

    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Error creating organization', error });
  }
};

export const updateOrganization = async (req: any, res: Response) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({ message: 'Forbidden: SuperAdmin only' });
  }

  try {
    const { id } = req.params;
    const { name, email, organization_name, organization_type, plan_id } = req.body;

    const organization = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        organization_name,
        organization_type,
        plan_id: plan_id ? parseInt(plan_id) : undefined,
      },
    });

    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Error updating organization', error });
  }
};

export const deleteOrganization = async (req: any, res: Response) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({ message: 'Forbidden: SuperAdmin only' });
  }

  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting organization', error });
  }
};

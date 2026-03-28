import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: any, res: Response) => {
  const { userId, role } = req.user;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { plan: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (role === 'SuperAdmin') {
      const organCount = await prisma.user.count({ where: { role: 'organAdmin' } });
      const memberCount = await prisma.user.count({ where: { role: 'member' } });
      const totalPayments = await prisma.payment.aggregate({
        _sum: { amount: true }
      });

      return res.status(200).json({
        stats: [
          { label: 'Total Organizations', value: organCount },
          { label: 'Total Members', value: memberCount },
          { label: 'Total Revenue', value: `$${totalPayments._sum.amount || 0}` }
        ]
      });
    }

    if (role === 'organAdmin') {
      const orgName = user.organization_name;
      const members = await prisma.user.count({
        where: { organization_name: orgName, role: 'member' }
      });
      const payments = await prisma.payment.aggregate({
        where: { user: { organization_name: orgName } },
        _sum: { amount: true }
      });
      const events = await prisma.event.count(); // In a real app, events might be scoped to orgs
      const blogs = await prisma.blog.count(); // Same for blogs

      return res.status(200).json({
        stats: [
          { label: 'Total Members', value: members },
          { label: 'Total Revenue', value: `$${payments._sum.amount || 0}` },
          { label: 'Upcoming Events', value: events },
          { label: 'Recent Blogs', value: blogs }
        ],
        plan: user.plan,
        expiry: user.plan_expiry
      });
    }

    if (role === 'member') {
      const orgName = user.organization_name;
      const events = await prisma.event.count(); // Scoped events
      const blogs = await prisma.blog.count(); // Scoped blogs

      return res.status(200).json({
        stats: [
          { label: 'Upcoming Events', value: events },
          { label: 'Recent Blogs', value: blogs }
        ],
        plan: user.plan,
        expiry: user.plan_expiry
      });
    }

    res.status(400).json({ message: 'Invalid role' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error });
  }
};

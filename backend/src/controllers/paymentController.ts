import { Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPayments = async (req: any, res: Response) => {
  try {
    const whereClause = req.user.role === 'SuperAdmin' ? {} : { user_id: req.user.userId };
    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: { plan: true, user: true },
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
};

export const createPayment = async (req: any, res: Response) => {
  try {
    const { plan_id, amount, payment_method, transaction_id } = req.body;
    const payment = await prisma.payment.create({
      data: {
        amount,
        payment_method,
        status: 'completed',
        transaction_id,
        user_id: req.user.userId,
        plan_id,
      },
    });

    // Update user's plan and expiry date
    const plan = await prisma.plan.findUnique({ where: { id: plan_id } });
    if (plan) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + plan.duration_days);

      await prisma.user.update({
        where: { id: req.user.userId },
        data: {
          plan_id: plan.id,
          plan_expiry: expiryDate,
        },
      });
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment', error });
  }
};

export const getPaymentById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id), user_id: req.user.userId },
      include: { plan: true },
    });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error });
  }
};

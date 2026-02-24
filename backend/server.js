const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Validation Schemas
const employeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  fullName: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  department: z.string().min(1, 'Department is required'),
});

const attendanceSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  status: z.enum(['Present', 'Absent'], { errorMap: () => ({ message: 'Status must be Present or Absent' }) }),
  employeeId: z.number().int().positive('Valid internal Employee ID required'),
});

// Employee APIs
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        _count: {
          select: { attendances: { where: { status: 'Present' } } }
        }
      }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const validatedData = employeeSchema.parse(req.body);
    
    // Check for unique employeeId and email
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        OR: [
          { employeeId: validatedData.employeeId },
          { email: validatedData.email }
        ]
      }
    });

    if (existingEmployee) {
      const field = existingEmployee.employeeId === validatedData.employeeId ? 'Employee ID' : 'Email';
      return res.status(400).json({ error: `${field} already exists` });
    }

    const employee = await prisma.employee.create({
      data: validatedData,
    });
    res.status(201).json(employee);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.employee.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Attendance APIs
app.post('/api/attendance', async (req, res) => {
  try {
    const validatedData = attendanceSchema.parse(req.body);
    
    const attendance = await prisma.attendance.upsert({
      where: {
        date_employeeId: {
          date: validatedData.date,
          employeeId: validatedData.employeeId
        }
      },
      update: { status: validatedData.status },
      create: validatedData
    });
    
    res.status(201).json(attendance);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

app.get('/api/attendance/:employeeId', async (req, res) => {
  try {
    const employeeId = parseInt(req.params.employeeId);
    const records = await prisma.attendance.findMany({
      where: { employeeId },
      orderBy: { date: 'desc' }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance history' });
  }
});

// Dashboard Stats (Bonus)
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const employeeCount = await prisma.employee.count();
    const today = new Date().toISOString().split('T')[0];
    const presentToday = await prisma.attendance.count({
      where: { date: today, status: 'Present' }
    });
    
    res.json({
      totalEmployees: employeeCount,
      presentToday: presentToday
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

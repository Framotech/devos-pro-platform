import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';
import { z } from 'zod';

// Strict validation schema
const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name too short'),
  email: z.string().trim().email('Invalid email').toLowerCase(),
  subject: z.string().trim().optional().default('No Subject'),
  message: z.string().trim().min(10, 'Message too short'),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Establish Database Connection
    await connectDB();

    // 2. Parse and Validate Request Body
    const body = await req.json();
    const validatedData = contactSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validatedData.data;

    // 3. Optional: Rate Limiting / Duplicate Check
    // Prevents the same person from sending the exact same message twice within 10 mins
    const existingLead = await Lead.findOne({ 
      email, 
      message, 
      createdAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) } 
    });

    if (existingLead) {
      return NextResponse.json(
        { success: false, error: "Duplicate transmission detected. Please wait." },
        { status: 429 }
      );
    }

    // 4. Create Lead in MongoDB
    const lead = await Lead.create({
      name,
      email,
      subject,
      message,
      source: 'portfolio_v2', // Tracking which version/site sent the lead
      status: 'new'
    });

    // 5. System Response
    console.log(`[TERMINAL] New Lead Received: ${name} (${email})`);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Transmission Successful', 
        transmissionID: lead._id 
      },
      { status: 201 }
    );

  } catch (error) {
    // Precise Error Logging for Production
    console.error('[DATABASE ERROR]:', error);

    return NextResponse.json(
      { 
        success: false, 
        error: 'System failure: Failed to transmit message to core database.' 
      },
      { status: 500 }
    );
  }
}
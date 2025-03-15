import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Memory } from '@/models/Memory';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const memories = await Memory.find({}).sort({ date: -1 });
    return NextResponse.json(memories);
  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch memories' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const memory = await request.json();
    const newMemory = await Memory.create(memory);
    return NextResponse.json(newMemory);
  } catch (error) {
    console.error('Error creating memory:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create memory' 
    }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Memory } from '@/models/Memory';

export async function GET() {
  try {
    await connectDB();
    const memories = await Memory.find({}).sort({ date: -1 });
    return NextResponse.json(memories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const memory = await request.json();
    const newMemory = await Memory.create(memory);
    return NextResponse.json(newMemory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create memory' }, { status: 500 });
  }
} 
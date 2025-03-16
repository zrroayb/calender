import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Memory } from '@/models/Memory';

// Use the correct type for route handlers in Next.js App Router
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    const comment = await request.json();
    
    const memory = await Memory.findOne({ id: id });
    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    if (!memory.comments) {
      memory.comments = [];
    }
    
    memory.comments.push(comment);
    await memory.save();

    return NextResponse.json(memory);
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
} 
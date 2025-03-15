import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Memory } from '@/models/Memory';
import { NextRequest } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(
  request: NextRequest,
  context: RouteParams
) {
  try {
    await connectDB();
    const memory = await Memory.findByIdAndDelete(context.params.id);
    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Memory deleted successfully' });
  } catch (err) {
    console.error('Error deleting memory:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete memory' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteParams
) {
  try {
    await connectDB();
    const { comment } = await request.json();
    
    const memory = await Memory.findById(context.params.id);
    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    memory.comments.push(comment);
    await memory.save();

    return NextResponse.json(memory);
  } catch (err) {
    console.error('Error adding comment:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to add comment' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Memory } from '@/models/Memory';

type Props = {
  params: {
    id: string;
  };
};

export async function DELETE(
  request: Request,
  { params }: Props
) {
  try {
    await connectDB();
    const memory = await Memory.findOneAndDelete({ id: params.id });
    
    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
  }
} 
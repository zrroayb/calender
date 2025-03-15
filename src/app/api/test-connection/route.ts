import { NextResponse } from 'next/server';
import { testMongoDBConnection } from '@/lib/mongodb';

export async function GET() {
  try {
    await testMongoDBConnection();
    return NextResponse.json({ message: 'MongoDB connection successful' });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Connection test failed' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { TRIP_CONFIG } from '@/lib/constants';
import { getTodayInTimezone, isDateInFuture, isDateWithinTripRange } from '@/lib/dates';
import { validatePersonAmount } from '@/lib/calculations';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { DailyContribution } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('trip_id') || TRIP_CONFIG.id;

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        source: 'local_mode',
        data: [],
      });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ success: true, source: 'local_mode', data: [] });
    }

    const { data, error } = await supabase
      .from('daily_contributions')
      .select('*')
      .eq('trip_id', tripId)
      .order('contribution_date', { ascending: true });

    if (error) {
      console.warn('Supabase query note (schema may need initialization):', error.message);
      return NextResponse.json({
        success: true,
        source: 'local_mode',
        needsSchemaInit: true,
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      source: 'supabase',
      data: data || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      trip_id = TRIP_CONFIG.id,
      contribution_date,
      sreeram_amount = 0,
      niyaa_amount = 0,
      notes = '',
    } = body;

    // 1. Verify date existence and format
    if (!contribution_date || typeof contribution_date !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Contribution date is required (YYYY-MM-DD).' },
        { status: 400 }
      );
    }

    // 2. Verify date is within the trip bounds (Oct 01, 2026 -> Dec 10, 2026)
    if (!isDateWithinTripRange(contribution_date)) {
      return NextResponse.json(
        {
          success: false,
          error: `Date must be between ${TRIP_CONFIG.startDate} and ${TRIP_CONFIG.targetDate}.`,
        },
        { status: 400 }
      );
    }

    // 3. BACKWARD-ONLY RULE: Server-side check against Asia/Kolkata current date
    const todayInKolkata = getTodayInTimezone(TRIP_CONFIG.timezone);
    if (isDateInFuture(contribution_date, TRIP_CONFIG.timezone)) {
      return NextResponse.json(
        {
          success: false,
          error: "That day hasn't happened yet ✦",
          todayInKolkata,
        },
        { status: 400 }
      );
    }

    // 4. Validate Sreeram contribution
    const sValidation = validatePersonAmount(sreeram_amount);
    if (!sValidation.valid) {
      return NextResponse.json({ success: false, error: sValidation.error }, { status: 400 });
    }

    // 5. Validate Niyaa contribution
    const nValidation = validatePersonAmount(niyaa_amount);
    if (!nValidation.valid) {
      return NextResponse.json({ success: false, error: nValidation.error }, { status: 400 });
    }

    const cleanRecord: DailyContribution = {
      trip_id,
      contribution_date,
      sreeram_amount: Math.floor(sreeram_amount),
      niyaa_amount: Math.floor(niyaa_amount),
      notes: typeof notes === 'string' ? notes.trim() : '',
      updated_at: new Date().toISOString(),
    };

    // 6. Persist to Supabase if configured
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('daily_contributions')
          .upsert(cleanRecord, {
            onConflict: 'trip_id,contribution_date',
          })
          .select()
          .single();

        if (error) {
          console.warn('Supabase write error (schema may need initialization):', error.message);
          // If table doesn't exist yet, save locally so user progress is never lost
          return NextResponse.json({
            success: true,
            source: 'local_mode',
            needsSchemaInit: true,
            warning: error.message,
            data: {
              ...cleanRecord,
              id: `local-${contribution_date}`,
              created_at: new Date().toISOString(),
            },
          });
        }

        return NextResponse.json({
          success: true,
          source: 'supabase',
          data,
        });
      }
    }

    // Local / fallback mode
    return NextResponse.json({
      success: true,
      source: 'local_mode',
      data: {
        ...cleanRecord,
        id: `local-${contribution_date}`,
        created_at: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request payload';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

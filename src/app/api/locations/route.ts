import { NextRequest, NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createAdminServerClient();

    const { data: locations, error } = await supabase
      .from("locations")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching locations:", error);
      return NextResponse.json(
        { error: "Failed to fetch locations" },
        { status: 500 }
      );
    }

    return NextResponse.json({ locations });
  } catch (error) {
    console.error("Error in locations GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminServerClient();
    const body = await request.json();

    const { name, code, address, phone, email, manager_name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { data: location, error } = await supabase
      .from("locations")
      .insert([
        {
          name,
          code: code || null,
          address: address || null,
          phone: phone || null,
          email: email || null,
          manager_name: manager_name || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating location:", error);
      return NextResponse.json(
        { error: "Failed to create location" },
        { status: 500 }
      );
    }

    return NextResponse.json({ location }, { status: 201 });
  } catch (error) {
    console.error("Error in locations POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminServerClient();
    const body = await request.json();

    const { id, name, code, address, phone, email, manager_name, is_active } =
      body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID and name are required" },
        { status: 400 }
      );
    }

    const { data: location, error } = await supabase
      .from("locations")
      .update({
        name,
        code: code || null,
        address: address || null,
        phone: phone || null,
        email: email || null,
        manager_name: manager_name || null,
        is_active: is_active !== undefined ? is_active : true,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating location:", error);
      return NextResponse.json(
        { error: "Failed to update location" },
        { status: 500 }
      );
    }

    return NextResponse.json({ location });
  } catch (error) {
    console.error("Error in locations PUT:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createAdminServerClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase.from("locations").delete().eq("id", id);

    if (error) {
      console.error("Error deleting location:", error);
      return NextResponse.json(
        { error: "Failed to delete location" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("Error in locations DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

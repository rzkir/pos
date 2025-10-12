import { NextRequest, NextResponse } from "next/server";

import { createAdminServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createAdminServerClient();

    const { data: branch, error } = await supabase
      .from("branch")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching branch:", error);
      return NextResponse.json(
        { error: "Failed to fetch branch" },
        { status: 500 }
      );
    }

    return NextResponse.json({ branch });
  } catch (error) {
    console.error("Error in branch GET:", error);
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

    const { data: branch, error } = await supabase
      .from("branch")
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
      console.error("Error creating branch:", error);
      return NextResponse.json(
        { error: "Failed to create branch" },
        { status: 500 }
      );
    }

    return NextResponse.json({ branch }, { status: 201 });
  } catch (error) {
    console.error("Error in branch POST:", error);
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

    const { data: branch, error } = await supabase
      .from("branch")
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
      console.error("Error updating branch:", error);
      return NextResponse.json(
        { error: "Failed to update branch" },
        { status: 500 }
      );
    }

    return NextResponse.json({ branch });
  } catch (error) {
    console.error("Error in branch PUT:", error);
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

    const { error } = await supabase.from("branch").delete().eq("id", id);

    if (error) {
      console.error("Error deleting branch:", error);
      return NextResponse.json(
        { error: "Failed to delete branch" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error("Error in branch DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

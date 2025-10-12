import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { createAdminServerClient } from "@/lib/supabase";

// GET - Fetch single supplier
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase: SupabaseClient = createAdminServerClient();
    const { id } = await params;

    const { data: supplier, error } = await supabase
      .from("suppliers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching supplier:", error);
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ supplier });
  } catch (error) {
    console.error("Error in GET /api/products/suppliers/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update supplier
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase: SupabaseClient = createAdminServerClient();
    const { id } = await params;
    const body = await request.json();
    const { name, phone, email, address } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Supplier name is required" },
        { status: 400 }
      );
    }

    const { data: supplier, error } = await supabase
      .from("suppliers")
      .update({
        name: name.trim(),
        phone: phone || null,
        email: email || null,
        address: address || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating supplier:", error);
      return NextResponse.json(
        { error: "Failed to update supplier" },
        { status: 500 }
      );
    }

    return NextResponse.json({ supplier });
  } catch (error) {
    console.error("Error in PUT /api/products/suppliers/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete supplier
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase: SupabaseClient = createAdminServerClient();
    const { id } = await params;

    // Check if supplier is being used by any products
    const { data: products, error: checkError } = await supabase
      .from("products")
      .select("id")
      .eq("supplier_id", id)
      .limit(1);

    if (checkError) {
      console.error("Error checking supplier usage:", checkError);
      return NextResponse.json(
        { error: "Failed to check supplier usage" },
        { status: 500 }
      );
    }

    if (products && products.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete supplier that is being used by products" },
        { status: 409 }
      );
    }

    const { error } = await supabase.from("suppliers").delete().eq("id", id);

    if (error) {
      console.error("Error deleting supplier:", error);
      return NextResponse.json(
        { error: "Failed to delete supplier" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/products/suppliers/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

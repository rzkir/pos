import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";

import { createAdminServerClient } from "@/lib/supabase";

// GET - Fetch single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase: SupabaseClient = createAdminServerClient();
    const { id } = await params;

    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_categories(name),
        product_sizes(name),
        suppliers(name)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error in GET /api/products/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase: SupabaseClient = createAdminServerClient();
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      price,
      stock,
      unit,
      image_url,
      category_id,
      size_id,
      barcode,
      is_active,
      // Tambahan penting
      sku,
      min_stock,
      discount,
      description,
      supplier_id,
      location_id,
      expiration_date,
      tax,
    } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    if (!price || price < 0) {
      return NextResponse.json(
        { error: "Valid price is required" },
        { status: 400 }
      );
    }

    if (stock === undefined || stock < 0) {
      return NextResponse.json(
        { error: "Valid stock quantity is required" },
        { status: 400 }
      );
    }

    // Normalize optional relations
    const normalizedSupplierId =
      supplier_id && supplier_id !== "none" ? supplier_id : null;

    const { data: product, error } = await supabase
      .from("products")
      .update({
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
        unit: unit || "pcs",
        image_url: image_url || null,
        category_id: category_id || null,
        size_id: size_id || null,
        barcode: barcode || null,
        is_active: is_active !== undefined ? is_active : true,
        // Tambahan penting
        sku: sku || null,
        min_stock: min_stock ? parseInt(min_stock) : 0,
        discount: discount ? parseFloat(discount) : 0,
        description: description || null,
        supplier_id: normalizedSupplierId,
        location_id: location_id || null,
        expiration_date: expiration_date || null,
        tax: tax ? parseFloat(tax) : 0,
      })
      .eq("id", id)
      .select(
        `
        *,
        product_categories(name),
        product_sizes(name),
        suppliers(name)
      `
      )
      .single();

    if (error) {
      console.error("Error updating product:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Product barcode already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error in PUT /api/products/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Increment sold and decrement stock for a product (transaction hook)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase: SupabaseClient = createAdminServerClient();
    const { id } = await params;
    const body = await request.json();
    const qty = parseInt(body?.qty ?? 0);

    if (!qty || qty <= 0) {
      return NextResponse.json(
        { error: "qty must be a positive integer" },
        { status: 400 }
      );
    }

    // Call SQL function to atomically update
    const { data, error } = await supabase.rpc("increment_product_sold", {
      p_product_id: parseInt(id),
      p_qty: qty,
    });

    if (error) {
      console.error("Error incrementing sold:", error);
      return NextResponse.json(
        { error: error.message || "Failed to increment sold" },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: data });
  } catch (error) {
    console.error("Error in POST /api/products/[id] (increment sold):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase: SupabaseClient = createAdminServerClient();
    const { id } = await params;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/products/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

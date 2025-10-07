import { NextRequest, NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase";

// GET - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminServerClient();
    const { searchParams } = new URL(request.url);
    const barcode = searchParams.get("barcode");

    if (barcode && barcode.trim() !== "") {
      const { data: product, error } = await supabase
        .from("products")
        .select(
          `
          *,
          product_categories(name),
          product_sizes(name)
        `
        )
        .eq("barcode", barcode)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching product by barcode:", error);
        return NextResponse.json(
          { error: "Failed to fetch product by barcode" },
          { status: 500 }
        );
      }

      if (!product) {
        return NextResponse.json({ product: null }, { status: 200 });
      }

      return NextResponse.json({ product }, { status: 200 });
    }

    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_categories(name),
        product_sizes(name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error in GET /api/products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminServerClient();
    const body = await request.json();
    const {
      name,
      price,
      modal,
      stock,
      image_url,
      category_id,
      size_id,
      barcode,
      uid,
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

    if (!uid || typeof uid !== "string") {
      return NextResponse.json(
        { error: "User context missing (uid)" },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert([
        {
          name: name.trim(),
          price: parseFloat(price),
          modal:
            modal !== undefined && modal !== null ? parseFloat(modal) : null,
          stock: parseInt(stock),
          sold: 0,
          image_url: image_url || null,
          category_id: category_id || null,
          size_id: size_id || null,
          barcode: barcode || null,
          uid,
        },
      ])
      .select(
        `
        *,
        product_categories(name),
        product_sizes(name)
      `
      )
      .single();

    if (error) {
      console.error("Error creating product:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Product barcode already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      );
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

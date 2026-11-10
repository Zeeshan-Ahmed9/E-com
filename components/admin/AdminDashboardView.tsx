"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  CheckCheck,
  XCircle,
  Upload,
  Copy,
  Check,
  MessageCircle,
  ArrowRight,
  Filter,
  DollarSign,
  Boxes,
  Eye,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { formatPKR } from "@/lib/utils";
import {
  SerializedProduct,
  SerializedCategory,
  SerializedOrder,
} from "@/lib/serialize";
import {
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
  updateOrderStatus,
  deleteOrder,
  createCategory,
  CreateProductInput,
} from "@/app/actions/admin";

interface AdminDashboardViewProps {
  initialProducts: SerializedProduct[];
  initialCategories: SerializedCategory[];
  initialOrders: SerializedOrder[];
  stats: {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    deliveredOrders: number;
    totalProducts: number;
    activeProducts: number;
  };
  secretSlug: string;
  defaultTab?: "products" | "orders";
}

export function AdminDashboardView({
  initialProducts,
  initialCategories,
  initialOrders,
  stats: initialStats,
  secretSlug,
  defaultTab = "products",
}: AdminDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"products" | "orders">(defaultTab);
  const [products, setProducts] = useState<SerializedProduct[]>(initialProducts);
  const [categories, setCategories] = useState<SerializedCategory[]>(initialCategories);
  const [orders, setOrders] = useState<SerializedOrder[]>(initialOrders);
  const [stats, setStats] = useState(initialStats);

  const [isPending, startTransition] = useTransition();
  const [copiedLink, setCopiedLink] = useState(false);

  // Products Filter & Search
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productStatusFilter, setProductStatusFilter] = useState<"all" | "ACTIVE" | "DRAFT">("all");

  // Orders Filter & Search
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  // Add / Edit Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SerializedProduct | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  // Product Form State
  const [formName, setFormName] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formNewCategory, setFormNewCategory] = useState("");
  const [formShowNewCatInput, setFormShowNewCatInput] = useState(false);
  const [formRegularPrice, setFormRegularPrice] = useState("");
  const [formSalePrice, setFormSalePrice] = useState("");
  const [formStock, setFormStock] = useState("15");
  const [formDescription, setFormDescription] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formStatus, setFormStatus] = useState<"ACTIVE" | "DRAFT">("ACTIVE");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formError, setFormError] = useState("");

  // Copy private access link
  const copyPrivateLink = () => {
    if (typeof window !== "undefined") {
      const fullUrl = `${window.location.origin}/${secretSlug}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategoryId(categories[0]?.id || "");
    setFormNewCategory("");
    setFormShowNewCatInput(false);
    setFormRegularPrice("");
    setFormSalePrice("");
    setFormStock("15");
    setFormDescription("");
    setFormBadge("");
    setFormIsFeatured(false);
    setFormStatus("ACTIVE");
    setFormImageUrl("");
    setFormError("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (p: SerializedProduct) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategoryId(p.categoryId);
    setFormNewCategory("");
    setFormShowNewCatInput(false);
    setFormRegularPrice(String(p.regularPrice));
    setFormSalePrice(String(p.salePrice));
    setFormStock(String(p.stockQuantity));
    setFormDescription(p.description || "");
    setFormBadge(p.badge || "");
    setFormIsFeatured(p.isFeatured);
    setFormStatus(p.status);
    setFormImageUrl(p.images[0]?.url || "");
    setFormError("");
    setIsModalOpen(true);
  };

  // Cloudinary Image Upload Handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setImageUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload to Cloudinary");
      }

      setFormImageUrl(data.url);
    } catch (err: any) {
      setImageUploadError(err.message || "Upload failed. Try entering image URL.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Submit Product Form
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim()) {
      setFormError("Product name is required.");
      return;
    }

    if (!formSalePrice || Number(formSalePrice) <= 0) {
      setFormError("Valid sale price is required.");
      return;
    }

    if (!formImageUrl.trim()) {
      setFormError("Please upload an image or provide an image URL.");
      return;
    }

    startTransition(async () => {
      if (editingProduct) {
        // Update
        const res = await updateProduct(editingProduct.id, {
          name: formName,
          categoryId: formCategoryId,
          regularPrice: Number(formRegularPrice) || Number(formSalePrice),
          salePrice: Number(formSalePrice),
          stockQuantity: Number(formStock) || 0,
          description: formDescription,
          badge: formBadge,
          isFeatured: formIsFeatured,
          status: formStatus,
          imageUrl: formImageUrl,
        });

        if (!res.success) {
          setFormError(res.error || "Failed to update product.");
          return;
        }

        // Update local state
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  name: formName,
                  categoryId: formCategoryId,
                  regularPrice: Number(formRegularPrice) || Number(formSalePrice),
                  salePrice: Number(formSalePrice),
                  stockQuantity: Number(formStock) || 0,
                  description: formDescription,
                  badge: formBadge || null,
                  isFeatured: formIsFeatured,
                  status: formStatus,
                  images: [{ ...p.images[0], url: formImageUrl, id: p.images[0]?.id || "img-1", publicId: "", alt: formName, sortOrder: 0 }],
                }
              : p
          )
        );
        setIsModalOpen(false);
      } else {
        // Create
        const payload: CreateProductInput = {
          name: formName,
          categoryId: formCategoryId,
          newCategoryName: formShowNewCatInput ? formNewCategory : undefined,
          regularPrice: Number(formRegularPrice) || Number(formSalePrice),
          salePrice: Number(formSalePrice),
          stockQuantity: Number(formStock) || 15,
          description: formDescription,
          badge: formBadge,
          isFeatured: formIsFeatured,
          status: formStatus,
          imageUrl: formImageUrl,
        };

        const res = await createProduct(payload);
        if (!res.success || !res.product) {
          setFormError(res.error || "Failed to create product.");
          return;
        }

        setProducts((prev) => [res.product!, ...prev]);
        setStats((prev) => ({
          ...prev,
          totalProducts: prev.totalProducts + 1,
          activeProducts: formStatus === "ACTIVE" ? prev.activeProducts + 1 : prev.activeProducts,
        }));

        // If new category was created, add to local categories
        if (formShowNewCatInput && formNewCategory.trim()) {
          setCategories((prev) => [
            ...prev,
            {
              id: res.product!.categoryId,
              name: formNewCategory.trim(),
              slug: formNewCategory.toLowerCase().replace(/\s+/g, "-"),
              description: null,
              imageUrl: null,
              isFeatured: true,
              sortOrder: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ]);
        }

        setIsModalOpen(false);
      }
    });
  };

  // Toggle Active/Draft Status
  const handleToggleStatus = (p: SerializedProduct) => {
    startTransition(async () => {
      const res = await toggleProductStatus(p.id, p.status);
      if (res.success && res.newStatus) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === p.id ? { ...item, status: res.newStatus! } : item
          )
        );
        setStats((prev) => ({
          ...prev,
          activeProducts:
            res.newStatus === "ACTIVE"
              ? prev.activeProducts + 1
              : prev.activeProducts - 1,
        }));
      }
    });
  };

  // Delete Product
  const handleDeleteProduct = (p: SerializedProduct) => {
    if (!confirm(`Are you sure you want to delete "${p.name}"? It will be removed from your store.`)) return;

    startTransition(async () => {
      const res = await deleteProduct(p.id);
      if (res.success) {
        setProducts((prev) => prev.filter((item) => item.id !== p.id));
        setStats((prev) => ({
          ...prev,
          totalProducts: prev.totalProducts - 1,
          activeProducts: p.status === "ACTIVE" ? prev.activeProducts - 1 : prev.activeProducts,
        }));
      }
    });
  };

  // Update Order Status Handler
  const handleOrderStatusChange = (
    orderId: string,
    newStatus: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  ) => {
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        );

        // Update stats
        setStats((prev) => {
          const currentOrders = orders.map((o) =>
            o.id === orderId ? { ...o, orderStatus: newStatus } : o
          );
          return {
            ...prev,
            pendingOrders: currentOrders.filter((o) => o.orderStatus === "PENDING").length,
            confirmedOrders: currentOrders.filter((o) => o.orderStatus === "CONFIRMED").length,
            deliveredOrders: currentOrders.filter((o) => o.orderStatus === "DELIVERED").length,
          };
        });
      }
    });
  };

  // Delete / Archive Order
  const handleDeleteOrder = (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    startTransition(async () => {
      const res = await deleteOrder(orderId);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        setStats((prev) => ({
          ...prev,
          totalOrders: prev.totalOrders - 1,
        }));
      }
    });
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.slug.toLowerCase().includes(productSearch.toLowerCase());

      const matchesCat =
        productCategoryFilter === "all" || p.categoryId === productCategoryFilter;

      const matchesStatus =
        productStatusFilter === "all" || p.status === productStatusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, productSearch, productCategoryFilter, productStatusFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerPhone.includes(orderSearch) ||
        o.city.toLowerCase().includes(orderSearch.toLowerCase());

      const matchesStatus =
        orderStatusFilter === "all" || o.orderStatus === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans pb-24">
      {/* Top Luxury Admin Header */}
      <header className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Left: Brand & Admin Tag */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-black tracking-tight uppercase text-white">
                  ZAPPMART
                </span>
                <span className="bg-neutral-800 text-amber-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-widest border border-neutral-700">
                  ADMIN PORTAL
                </span>
              </Link>
            </div>

            {/* Middle: Fast Secret URL Indicator */}
            <div className="hidden lg:flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-3 py-1 text-xs text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Private URL: <strong className="text-neutral-200">/{secretSlug}</strong> (No Password Required)</span>
              <button
                onClick={copyPrivateLink}
                className="ml-2 inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2 py-0.5 rounded transition-colors"
                title="Copy private link to clipboard"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedLink ? "Copied!" : "Copy URL"}
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 px-3 py-2 rounded-lg transition-colors"
              >
                <span>Live Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Card 1: Total Sales */}
          <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-4 md:p-5 shadow-sm">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Store Sales</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">
              {formatPKR(stats.totalRevenue)}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Excludes cancelled orders</p>
          </div>

          {/* Card 2: Total Orders & Pending Badge */}
          <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-4 md:p-5 shadow-sm">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
              <ShoppingCart className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
              {stats.totalOrders}
              {stats.pendingOrders > 0 && (
                <span className="text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  {stats.pendingOrders} Pending
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              {stats.confirmedOrders} Confirmed • {stats.deliveredOrders} Delivered
            </p>
          </div>

          {/* Card 3: Products Listed */}
          <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-4 md:p-5 shadow-sm">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Products Catalog</span>
              <Package className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">
              {stats.totalProducts}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              <span className="text-emerald-400 font-semibold">{stats.activeProducts} Active</span> on storefront
            </p>
          </div>

          {/* Card 4: Store Health */}
          <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-4 md:p-5 shadow-sm">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">System Status</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              100% Operational
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Neon DB & Cloudinary Connected</p>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("products")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                activeTab === "products"
                  ? "bg-white text-black shadow-md"
                  : "bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all relative ${
                activeTab === "orders"
                  ? "bg-white text-black shadow-md"
                  : "bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
              {stats.pendingOrders > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-2 right-2" />
              )}
            </button>
          </div>

          {/* Tab Specific Quick Action */}
          {activeTab === "products" && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          )}
        </div>

        {/* ================================================================= */}
        {/* TAB 1: PRODUCT MANAGEMENT                                         */}
        {/* ================================================================= */}
        {activeTab === "products" && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search products by title, category, or slug..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-white transition-colors"
                />
              </div>

              {/* Category filter */}
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-white"
              >
                <option value="all">All Categories ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={productStatusFilter}
                onChange={(e) => setProductStatusFilter(e.target.value as any)}
                className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-white"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="DRAFT">Draft Only</option>
              </select>
            </div>

            {/* Products Table */}
            <div className="bg-neutral-950/70 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-900/80 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Regular Price</th>
                      <th className="py-3.5 px-4">Sale Price</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-neutral-500">
                          <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
                          <p className="text-sm font-semibold">No products found</p>
                          <p className="text-xs text-neutral-600 mt-1">
                            Click &ldquo;+ Add Product&rdquo; to add your first product with image.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const img = p.images[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30";
                        const discount =
                          p.regularPrice > p.salePrice
                            ? Math.round(((p.regularPrice - p.salePrice) / p.regularPrice) * 100)
                            : 0;

                        return (
                          <tr key={p.id} className="hover:bg-neutral-900/40 transition-colors">
                            {/* Product Info */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-lg bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800">
                                  <Image
                                    src={img}
                                    alt={p.name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                </div>
                                <div>
                                  <div className="font-bold text-white line-clamp-1">{p.name}</div>
                                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                                    /{p.slug}
                                  </div>
                                  {p.badge && (
                                    <span className="inline-block mt-1 bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                                      {p.badge}
                                    </span>
                                  )}
                                  {p.isFeatured && (
                                    <span className="inline-block mt-1 ml-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                                      FEATURED
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4">
                              <span className="bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md text-[11px] font-medium border border-neutral-700/60">
                                {p.category?.name || "General"}
                              </span>
                            </td>

                            {/* Regular Price */}
                            <td className="py-3.5 px-4 font-mono text-neutral-400 line-through">
                              {formatPKR(p.regularPrice)}
                            </td>

                            {/* Sale Price */}
                            <td className="py-3.5 px-4 font-bold text-white font-mono">
                              {formatPKR(p.salePrice)}
                              {discount > 0 && (
                                <span className="ml-1.5 text-[10px] font-bold text-red-400">
                                  -{discount}%
                                </span>
                              )}
                            </td>

                            {/* Stock Quantity */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 font-semibold text-[11px] px-2 py-0.5 rounded-full ${
                                  p.stockQuantity > 5
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : p.stockQuantity > 0
                                    ? "bg-amber-500/10 text-amber-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {p.stockQuantity > 0 ? `${p.stockQuantity} in stock` : "Out of stock"}
                              </span>
                            </td>

                            {/* Status Toggle */}
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => handleToggleStatus(p)}
                                disabled={isPending}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                                  p.status === "ACTIVE"
                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30"
                                    : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700"
                                }`}
                                title="Click to toggle Active / Draft"
                              >
                                {p.status}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <Link
                                  href={`/products/${p.slug}`}
                                  target="_blank"
                                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                                  title="View on Store"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>

                                <button
                                  onClick={() => openEditModal(p)}
                                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleDeleteProduct(p)}
                                  disabled={isPending}
                                  className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: ORDER MANAGEMENT                                           */}
        {/* ================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {/* Order Filter Tabs & Search */}
            <div className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search orders by Order #, Customer Name, Phone, or City..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-white transition-colors"
                />
              </div>

              {/* Status Pill Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {[
                  { key: "all", label: "All" },
                  { key: "PENDING", label: "Pending" },
                  { key: "CONFIRMED", label: "Confirmed" },
                  { key: "PROCESSING", label: "Processing" },
                  { key: "SHIPPED", label: "Shipped" },
                  { key: "DELIVERED", label: "Delivered" },
                  { key: "CANCELLED", label: "Cancelled" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setOrderStatusFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      orderStatusFilter === tab.key
                        ? "bg-white text-black"
                        : "bg-neutral-900 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Cards List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-500">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold">No orders found</p>
                  <p className="text-xs text-neutral-600 mt-1">
                    When customers place orders via Cash on Delivery or WhatsApp, they will appear here.
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const isPendingStatus = order.orderStatus === "PENDING";
                  const isConfirmed = order.orderStatus === "CONFIRMED";
                  const isDelivered = order.orderStatus === "DELIVERED";

                  // Clean WhatsApp phone number (e.g. 03001234567 -> 923001234567)
                  let waNumber = order.customerPhone.replace(/\D/g, "");
                  if (waNumber.startsWith("0")) {
                    waNumber = "92" + waNumber.slice(1);
                  }

                  const waMessage = encodeURIComponent(
                    `Hello ${order.customerName}! Thank you for placing your order (#${order.orderNumber}) with ZappMart. Total amount is Rs. ${order.totalAmount.toLocaleString()} via 100% Cash on Delivery with Free Nationwide Shipping. Your parcel will be delivered within 5-7 working days to: ${order.shippingAddress}, ${order.city}.`
                  );

                  return (
                    <div
                      key={order.id}
                      className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4 transition-all hover:border-neutral-700"
                    >
                      {/* Top Row: Order Number, Date, Status */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/60 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-extrabold text-base text-white">
                            #{order.orderNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              order.orderStatus === "PENDING"
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                : order.orderStatus === "CONFIRMED"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : order.orderStatus === "PROCESSING"
                                ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                : order.orderStatus === "SHIPPED"
                                ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                                : order.orderStatus === "DELIVERED"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {new Date(order.createdAt).toLocaleString("en-PK", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Fast Status Action Buttons */}
                        <div className="flex items-center gap-2">
                          {isPendingStatus && (
                            <button
                              onClick={() => handleOrderStatusChange(order.id, "CONFIRMED")}
                              disabled={isPending}
                              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors active:scale-95 shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirm Order</span>
                            </button>
                          )}

                          {isConfirmed && (
                            <button
                              onClick={() => handleOrderStatusChange(order.id, "DELIVERED")}
                              disabled={isPending}
                              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors active:scale-95 shadow-sm"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>Mark Delivered (Complete)</span>
                            </button>
                          )}

                          {/* Full Status Selector Dropdown */}
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value as any)}
                            disabled={isPending}
                            className="bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-white"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered (Complete)</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={isPending}
                            className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                            title="Delete order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Main Order Content: Customer Details + Items + Pricing */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        {/* Customer Information (5 cols) */}
                        <div className="md:col-span-5 bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3.5 space-y-2 text-xs">
                          <div className="font-bold text-white text-sm flex items-center justify-between">
                            <span>{order.customerName}</span>
                            <a
                              href={`https://wa.me/${waNumber}?text=${waMessage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#1ebd5a] text-black font-bold text-[11px] px-2.5 py-1 rounded-md transition-colors shadow-xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-current" />
                              <span>WhatsApp</span>
                            </a>
                          </div>

                          <div className="text-neutral-300">
                            <span className="text-neutral-500">Phone: </span>
                            <span className="font-mono font-medium">{order.customerPhone}</span>
                          </div>

                          {order.customerEmail && (
                            <div className="text-neutral-300">
                              <span className="text-neutral-500">Email: </span>
                              <span>{order.customerEmail}</span>
                            </div>
                          )}

                          <div className="text-neutral-300">
                            <span className="text-neutral-500">City: </span>
                            <span className="font-semibold text-white">{order.city}</span>
                          </div>

                          <div className="text-neutral-300">
                            <span className="text-neutral-500">Address: </span>
                            <span>{order.shippingAddress}</span>
                          </div>

                          {order.orderNotes && (
                            <div className="bg-neutral-950 border border-neutral-800 rounded p-2 text-[11px] text-amber-300/90">
                              <span className="font-bold">Customer Note: </span>
                              &ldquo;{order.orderNotes}&rdquo;
                            </div>
                          )}
                        </div>

                        {/* Items in this Order (4 cols) */}
                        <div className="md:col-span-4 bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-3.5 space-y-2.5">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                            Ordered Items ({order.items.length})
                          </div>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-2.5 text-xs">
                                {item.imageUrl ? (
                                  <div className="relative w-9 h-9 rounded bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800">
                                    <Image
                                      src={item.imageUrl}
                                      alt={item.productName}
                                      fill
                                      className="object-cover"
                                      sizes="36px"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-9 h-9 rounded bg-neutral-800 flex items-center justify-center shrink-0">
                                    <Package className="w-4 h-4 text-neutral-500" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-white truncate">{item.productName}</div>
                                  <div className="text-[11px] text-neutral-400 font-mono">
                                    {item.quantity} × {formatPKR(item.price)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Financial Breakdown (3 cols) */}
                        <div className="md:col-span-3 bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3.5 space-y-2 text-xs flex flex-col justify-between">
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                              Payment Summary
                            </div>
                            <div className="flex justify-between text-neutral-400">
                              <span>Subtotal</span>
                              <span className="font-mono text-neutral-200">{formatPKR(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-neutral-400">
                              <span>Shipping</span>
                              <span className="text-emerald-400 font-bold uppercase text-[10px]">Free</span>
                            </div>
                            <div className="border-t border-neutral-800 my-1 pt-1 flex justify-between font-bold text-white text-sm">
                              <span>Total</span>
                              <span className="font-mono text-amber-400">{formatPKR(order.totalAmount)}</span>
                            </div>
                          </div>

                          <div className="bg-neutral-950 border border-neutral-800 rounded p-2 text-[10px] text-neutral-400 space-y-0.5">
                            <div>Method: <strong className="text-white">Cash on Delivery (100%)</strong></div>
                            <div>Shipping: <strong className="text-emerald-400">FREE NATIONWIDE</strong></div>
                            <div>Payable at Doorstep: <strong className="text-amber-300 font-bold">{formatPKR(order.totalAmount)}</strong></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT                                         */}
      {/* ================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl text-left my-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
              <div>
                <h3 className="text-lg md:text-xl font-extrabold uppercase text-white tracking-tight">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Save product details and image to list instantly on ZappMart.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleProductSubmit} className="space-y-5 text-xs">
              {/* Product Title */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-white transition-colors"
                />
              </div>

              {/* Category Selector + Create Category Inline */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold uppercase tracking-wider text-neutral-300">
                    Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormShowNewCatInput(!formShowNewCatInput)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    {formShowNewCatInput ? "← Select Existing" : "+ New Category"}
                  </button>
                </div>

                {formShowNewCatInput ? (
                  <input
                    type="text"
                    placeholder="Enter new category name (e.g. Smart Watches, Gaming)"
                    value={formNewCategory}
                    onChange={(e) => setFormNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-amber-500/40 rounded-xl text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400"
                  />
                ) : (
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-hidden focus:border-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Pricing & Stock Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Regular Price */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Regular Price (PKR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 4800"
                    value={formRegularPrice}
                    onChange={(e) => setFormRegularPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-white"
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Sale Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 3850"
                    value={formSalePrice}
                    onChange={(e) => setFormSalePrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-white font-bold"
                  />
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-hidden focus:border-white"
                  />
                </div>
              </div>

              {/* Cloudinary Image Upload & Preview */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Product Image * (Cloudinary Upload or Direct URL)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  {/* File Upload Button / Area */}
                  <div className="sm:col-span-7 space-y-2">
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-neutral-800 hover:border-neutral-700 rounded-2xl cursor-pointer bg-neutral-900/50 transition-colors">
                      <Upload className="w-5 h-5 text-neutral-400 mb-1" />
                      <span className="text-xs font-semibold text-neutral-200">
                        {isUploadingImage ? "Uploading to Cloudinary..." : "Choose Image from Device"}
                      </span>
                      <span className="text-[10px] text-neutral-500 mt-0.5">
                        PNG, JPG, WEBP up to 10MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                    </label>

                    {/* Or URL Input */}
                    <div className="relative">
                      <span className="text-[10px] text-neutral-500 block mb-1">
                        Or paste image link:
                      </span>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-white"
                      />
                    </div>

                    {imageUploadError && (
                      <p className="text-[11px] text-red-400">{imageUploadError}</p>
                    )}
                  </div>

                  {/* Image Preview Box */}
                  <div className="sm:col-span-5 flex flex-col items-center">
                    <div className="relative w-full h-36 rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center">
                      {formImageUrl ? (
                        <>
                          <Image
                            src={formImageUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                            sizes="200px"
                          />
                          <button
                            type="button"
                            onClick={() => setFormImageUrl("")}
                            className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full text-xs"
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <div className="text-center text-neutral-600 p-2">
                          <Package className="w-8 h-8 mx-auto mb-1 opacity-50" />
                          <span className="text-[11px]">No Image Selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Key features, specifications, and details for customer."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-white transition-colors"
                />
              </div>

              {/* Badge & Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {/* Badge */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Optional Badge
                  </label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-hidden focus:border-white"
                  >
                    <option value="">None</option>
                    <option value="SALE">SALE</option>
                    <option value="HOT">HOT</option>
                    <option value="NEW">NEW</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="LIMITED">LIMITED</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Store Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-hidden focus:border-white"
                  >
                    <option value="ACTIVE">ACTIVE (Visible)</option>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                  </select>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isFeaturedCheck"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-white focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="isFeaturedCheck" className="text-xs text-neutral-300 cursor-pointer font-medium">
                    Feature on Homepage Spotlight
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || isUploadingImage}
                  className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? "Save Changes" : "Create Product"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


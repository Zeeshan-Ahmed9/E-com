"use client";

import { useState } from "react";
import { Send, CheckCircle2, MessageCircle } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    orderNumber: "",
    subject: "Order Status",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate fast processing
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const handleWhatsAppDirect = () => {
    const text = `Hello ZappMart Support!\n\n*Name:* ${formData.name || "Customer"}\n*Phone:* ${formData.phone || "Not provided"}\n*Order #:* ${formData.orderNumber || "None"}\n*Subject:* ${formData.subject}\n*Message:* ${formData.message || "I need assistance with an order."}`;
    window.open(`https://wa.me/923245003393?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (submitted) {
    return (
      <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-neutral-900">Message Received!</h3>
        <p className="text-xs md:text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
          Thank you for reaching out. A ZappMart representative will contact you via WhatsApp or phone call within 2–4 business hours.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: "", phone: "", orderNumber: "", subject: "Order Status", message: "" });
            }}
            className="text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:text-black py-2 px-4 border border-neutral-300 rounded"
          >
            Send Another Message
          </button>
          <button
            onClick={handleWhatsAppDirect}
            className="inline-flex items-center justify-center gap-2 bg-brand-whatsapp text-white text-xs font-semibold uppercase tracking-wider py-2 px-4 rounded shadow-xs"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            Chat on WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
      <div>
        <h3 className="text-lg md:text-xl font-bold text-neutral-900 tracking-tight">
          Send Us a Message
        </h3>
        <p className="text-xs text-neutral-500 mt-1">
          Fill out the details below and our support team will respond promptly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Full Name <span className="text-brand-sale">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ali Ahmed"
            className="w-full bg-neutral-50 border border-neutral-200 rounded px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition"
          />
        </div>

        {/* WhatsApp / Phone */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Phone / WhatsApp <span className="text-brand-sale">*</span>
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. 03001234567"
            className="w-full bg-neutral-50 border border-neutral-200 rounded px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Order # */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Order Number <span className="text-neutral-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={formData.orderNumber}
            onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
            placeholder="e.g. 2S-1042"
            className="w-full bg-neutral-50 border border-neutral-200 rounded px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Inquiry Subject
          </label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full bg-neutral-50 border border-neutral-200 rounded px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition cursor-pointer"
          >
            <option value="Order Status">Order Status & Delivery</option>
            <option value="Advance Payment">Advance Rs. 300 Confirmation</option>
            <option value="Product Question">Product Specification / In stock</option>
            <option value="Return / Replacement">Checking Warranty / Return</option>
            <option value="Other">Other Inquiry</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
          Your Message <span className="text-brand-sale">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="How can we help you today?"
          className="w-full bg-neutral-50 border border-neutral-200 rounded px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black focus:bg-white transition resize-none"
        />
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <span>{loading ? "Sending Message..." : "Submit Message"}</span>
          <Send className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleWhatsAppDirect}
          className="sm:w-auto px-5 bg-brand-whatsapp hover:opacity-95 text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>WhatsApp Chat</span>
        </button>
      </div>
    </form>
  );
}


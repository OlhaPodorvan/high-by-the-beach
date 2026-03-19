"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { placeOrderAction, type CheckoutFormData } from "@/app/actions/checkout";

type Field = { label: string; name: string; type?: string; placeholder?: string };

const CONTACT_FIELDS: Field[] = [
  { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
  { label: "Full name", name: "name", placeholder: "Jane Smith" },
];

const ADDRESS_FIELDS: Field[] = [
  { label: "Address", name: "address", placeholder: "123 Ocean Drive" },
  { label: "City", name: "city", placeholder: "Miami Beach" },
  { label: "State / Province", name: "state", placeholder: "FL" },
  { label: "ZIP / Postal code", name: "zip", placeholder: "33139" },
  { label: "Country", name: "country", placeholder: "United States" },
];

const inputClass = "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500";

function FormSection({
  title,
  fields,
  errors = {},
  onBlur,
}: {
  title: string;
  fields: Field[];
  errors?: Record<string, string>;
  onBlur?: (name: string, el: HTMLInputElement) => void;
}) {
  return (
    <div>
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      <div className="space-y-3">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="mb-1 block text-xs text-zinc-500">{f.label}</label>
            <input
              type={f.type ?? "text"}
              name={f.name}
              placeholder={f.placeholder}
              required
              onBlur={(e) => onBlur?.(f.name, e.currentTarget)}
              className={`${inputClass} ${errors[f.name] ? "border-red-400 focus:border-red-400" : ""}`}
            />
            {errors[f.name] && (
              <p className="mt-1 text-xs text-red-500">{errors[f.name]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type CardFieldsProps = {
  expiry: string;
  expiryError: string;
  onExpiryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryBlur: () => void;
};

function CardFields({ expiry, expiryError, onExpiryChange, onExpiryBlur }: CardFieldsProps) {
  const [cardNumber, setCardNumber] = useState("");

  function handleCardNumber(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(digits.replace(/(.{4})/g, "$1 ").trim());
  }

  return (
    <div>
      <h2 className="mb-4 text-base font-semibold">Payment</h2>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Card number</label>
          <input
            name="card"
            value={cardNumber}
            onChange={handleCardNumber}
            placeholder="4242 4242 4242 4242"
            inputMode="numeric"
            maxLength={19}
            required
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Expiry</label>
            <input
              name="expiry"
              value={expiry}
              onChange={onExpiryChange}
              onBlur={onExpiryBlur}
              placeholder="MM/YY"
              inputMode="numeric"
              maxLength={5}
              required
              className={`${inputClass} ${expiryError ? "border-red-400 focus:border-red-400" : ""}`}
            />
            {expiryError && (
              <p className="mt-1 text-xs text-red-500">{expiryError}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">CVV</label>
            <input
              name="cvv"
              placeholder="123"
              inputMode="numeric"
              maxLength={4}
              required
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expiry, setExpiry] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const expiryRef = useRef("");

  const checkFormValid = useCallback(() => {
    const htmlValid = formRef.current?.checkValidity() ?? false;
    const [mm, yy] = expiryRef.current.split("/");
    const month = parseInt(mm, 10);
    const year = parseInt(`20${yy}`, 10);
    const expiryValid =
      !!mm && !!yy && yy.length === 2 &&
      month >= 1 && month <= 12 &&
      new Date(year, month) > new Date();
    setFormValid(htmlValid && expiryValid);
  }, []);

  function handleFieldBlur(name: string, el: HTMLInputElement) {
    if (!el.validity.valid) {
      const message = el.validity.typeMismatch ? "Enter a valid email address" : el.validationMessage;
      setFieldErrors((prev) => ({ ...prev, [name]: message }));
    } else {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted = raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
    expiryRef.current = formatted;
    setExpiry(formatted);
    setExpiryError("");
    checkFormValid();
  }

  function validateExpiry(): boolean {
    const [mm, yy] = expiry.split("/");
    const month = parseInt(mm, 10);
    const year = parseInt(`20${yy}`, 10);
    if (!mm || !yy || yy.length < 2 || month < 1 || month > 12) {
      setExpiryError("Invalid date");
      return false;
    }
    const now = new Date();
    if (new Date(year, month) <= now) {
      setExpiryError("Card has expired");
      return false;
    }
    return true;
  }

  if (!cart || cart.lines.length === 0) {
    router.replace("/");
    return null;
  }

  const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
  const currency = cart.cost.subtotalAmount.currencyCode;
  const total = subtotal;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!validateExpiry()) return;

    setSubmitting(true);

    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const form: CheckoutFormData = {
      email: data.email,
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
    };

    try {
      if (!cart) return;
      await placeOrderAction(form, cart.lines);
      await clearCart();
      router.push("/checkout/confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-semibold">Checkout</h1>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        onChange={checkFormValid}
        className="grid grid-cols-1 gap-10 lg:grid-cols-2"
      >
        {/* Left — form fields */}
        <div className="space-y-8">
          <FormSection title="Contact" fields={CONTACT_FIELDS} errors={fieldErrors} onBlur={handleFieldBlur} />
          <FormSection title="Shipping address" fields={ADDRESS_FIELDS} />
          <CardFields
            expiry={expiry}
            expiryError={expiryError}
            onExpiryChange={handleExpiryChange}
            onExpiryBlur={validateExpiry}
          />

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!formValid || submitting}
            className="w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {submitting ? "Placing order…" : `Pay ${total.toFixed(2)} ${currency}`}
          </button>
        </div>

        {/* Right — order summary */}
        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="mb-4 text-base font-semibold">Order summary</h2>
          <ul className="space-y-4">
            {cart.lines.map((line) => (
              <li key={line.id} className="flex items-center gap-4">
                {line.merchandise.product.featuredImage && (
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <Image
                      src={line.merchandise.product.featuredImage.url}
                      alt={line.merchandise.product.featuredImage.altText ?? line.merchandise.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 text-sm">
                  <p className="font-medium">{line.merchandise.product.title}</p>
                  <p className="text-zinc-500">{line.merchandise.title} · qty {line.quantity}</p>
                </div>
                <p className="text-sm font-medium">
                  {parseFloat(line.cost.totalAmount.amount).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} {currency}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{total.toFixed(2)} {currency}</span>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

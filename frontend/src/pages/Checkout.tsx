import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Check, MapPin, Truck, CreditCard, Building2, Smartphone, Banknote, ShieldCheck, Lock, Tv, WashingMachine } from "lucide-react";
import { Link } from "react-router-dom";

const savedAddresses = [
  { id: 1, name: "Rajesh Kumar", phone: "9876543210", address: "42, Krishna Apartments, MG Road", city: "Mumbai", state: "Maharashtra", pincode: "400001", isDefault: true },
  { id: 2, name: "Priya Sharma", phone: "9123456789", address: "15, Sunshine Colony, Sector 5", city: "Pune", state: "Maharashtra", pincode: "411001", isDefault: false },
];

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  tv: Tv,
  "washing-machine": WashingMachine,
};

const cartSummary = [
  { id: 1, name: "Samsung 55\" Crystal 4K UHD Smart TV", icon: "tv", price: 42990, quantity: 1 },
  { id: 2, name: "Whirlpool 7.5kg Washing Machine", icon: "washing-machine", price: 21490, quantity: 1 },
];

type Step = "address" | "delivery" | "payment";

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState<Step>("address");
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0].id);
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showAddressForm, setShowAddressForm] = useState(false);

  const subtotal = cartSummary.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryOption === "express" ? 99 : 0;
  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Tv;
    return <IconComponent className="w-6 h-6 text-muted-foreground" />;
  };

  const steps = [
    { id: "address", label: "Address", icon: MapPin },
    { id: "delivery", label: "Delivery", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
  ];

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {steps.map((step, i) => {
        const isActive = currentStep === step.id;
        const isComplete = steps.findIndex(s => s.id === currentStep) > i;
        const Icon = step.icon;
        
        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => isComplete && setCurrentStep(step.id as Step)}
              disabled={!isComplete}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                isActive
                  ? "bg-accent text-primary"
                  : isComplete
                  ? "bg-krishna-green text-white cursor-pointer"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isComplete ? (
                <Check className="w-4 h-4" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={`w-8 md:w-16 h-0.5 mx-1 ${isComplete ? "bg-krishna-green" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const AddressStep = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Select Delivery Address</h2>
      
      {savedAddresses.map((addr) => (
        <label
          key={addr.id}
          className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            selectedAddress === addr.id
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent/50"
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="address"
              checked={selectedAddress === addr.id}
              onChange={() => setSelectedAddress(addr.id)}
              className="mt-1 w-4 h-4 text-accent focus:ring-accent"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-foreground">{addr.name}</span>
                {addr.isDefault && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">Default</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-sm text-muted-foreground">Phone: {addr.phone}</p>
            </div>
          </div>
        </label>
      ))}

      <button
        onClick={() => setShowAddressForm(!showAddressForm)}
        className="w-full py-3 border-2 border-dashed border-border rounded-lg text-sm text-krishna-blue-link font-medium hover:border-accent transition-colors"
      >
        + Add New Address
      </button>

      {showAddressForm && (
        <div className="bg-muted/30 p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Full Name" className="px-3 py-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent" />
            <input type="tel" placeholder="Phone Number" className="px-3 py-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <input type="text" placeholder="Address Line 1" className="w-full px-3 py-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent" />
          <input type="text" placeholder="Address Line 2 (Optional)" className="w-full px-3 py-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <input type="text" placeholder="City" className="px-3 py-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent" />
            <input type="text" placeholder="State" className="px-3 py-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent" />
            <input type="text" placeholder="Pincode" className="col-span-2 sm:col-span-1 px-3 py-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <button className="w-full py-2 bg-accent text-primary font-medium rounded-lg">
            Save Address
          </button>
        </div>
      )}

      <button
        onClick={() => setCurrentStep("delivery")}
        className="w-full py-3 bg-accent hover:bg-krishna-orange-hover text-primary font-medium rounded-lg transition-colors"
      >
        Deliver to this Address
      </button>
    </div>
  );

  const DeliveryStep = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Choose Delivery Option</h2>

      <label
        className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${
          deliveryOption === "standard"
            ? "border-accent bg-accent/5"
            : "border-border hover:border-accent/50"
        }`}
      >
        <div className="flex items-start gap-3">
          <input
            type="radio"
            name="delivery"
            checked={deliveryOption === "standard"}
            onChange={() => setDeliveryOption("standard")}
            className="mt-1 w-4 h-4 text-accent focus:ring-accent"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Standard Delivery</span>
              <span className="text-krishna-green font-medium">FREE</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Delivery by <strong>Tomorrow, 8 PM</strong>
            </p>
          </div>
        </div>
      </label>

      <label
        className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${
          deliveryOption === "express"
            ? "border-accent bg-accent/5"
            : "border-border hover:border-accent/50"
        }`}
      >
        <div className="flex items-start gap-3">
          <input
            type="radio"
            name="delivery"
            checked={deliveryOption === "express"}
            onChange={() => setDeliveryOption("express")}
            className="mt-1 w-4 h-4 text-accent focus:ring-accent"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Express Delivery</span>
              <span className="text-foreground font-medium">₹99</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Delivery by <strong>Today, 10 PM</strong>
            </p>
          </div>
        </div>
      </label>

      <button
        onClick={() => setCurrentStep("payment")}
        className="w-full py-3 bg-accent hover:bg-krishna-orange-hover text-primary font-medium rounded-lg transition-colors"
      >
        Continue to Payment
      </button>
    </div>
  );

  const PaymentStep = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Payment Method</h2>

      {[
        { id: "upi", label: "UPI", desc: "Google Pay, PhonePe, Paytm", icon: Smartphone },
        { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, Rupay", icon: CreditCard },
        { id: "netbanking", label: "Net Banking", desc: "All major banks", icon: Building2 },
        { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive", icon: Banknote },
      ].map((method) => (
        <label
          key={method.id}
          className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            paymentMethod === method.id
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === method.id}
              onChange={() => setPaymentMethod(method.id)}
              className="w-4 h-4 text-accent focus:ring-accent"
            />
            <method.icon className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <span className="font-medium text-foreground">{method.label}</span>
              <p className="text-xs text-muted-foreground">{method.desc}</p>
            </div>
          </div>
        </label>
      ))}

      {paymentMethod === "upi" && (
        <div className="bg-muted/30 p-4 rounded-lg">
          <input
            type="text"
            placeholder="Enter UPI ID (e.g., name@upi)"
            className="w-full px-3 py-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      )}

      <button className="w-full py-3 bg-accent hover:bg-krishna-orange-hover text-primary font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
        <Lock className="w-4 h-4" />
        Pay {formatPrice(total)}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-krishna-green" />
        <span>Your payment is 100% secure</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-4 md:py-6 px-3 md:px-4 pb-20">
        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4 text-center">Checkout</h1>

        <StepIndicator />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-card rounded-lg border border-border p-4 md:p-6">
              {currentStep === "address" && <AddressStep />}
              {currentStep === "delivery" && <DeliveryStep />}
              {currentStep === "payment" && <PaymentStep />}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-card rounded-lg border border-border p-4 sticky top-24">
              <h2 className="font-bold text-foreground mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 pb-4 border-b border-border">
                {cartSummary.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center shrink-0">
                      {renderIcon(item.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-foreground shrink-0">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={deliveryFee === 0 ? "text-krishna-green" : "text-foreground"}>
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-foreground">{formatPrice(total)}</span>
                </div>
              </div>

              <Link to="/cart" className="block text-center text-sm text-krishna-blue-link mt-4 hover:underline">
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

"use client";

import { useState } from "react";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";
import { CheckoutModal } from "@/components/checkout-modal";

export function MobileStickyWrapper() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <MobileStickyCta onOpenCheckout={() => setIsModalOpen(true)} />
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productTitle="AI Agency Mastery"
      />
    </>
  );
}

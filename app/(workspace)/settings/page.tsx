import { Heading } from "@/components/common";
import { BusinessForm } from "@/components/business-form";
export default function Settings() {
  return (
    <>
      <Heading
        eyebrow="MAKE IT YOURS"
        title="A workspace with your signature."
        description="Your business details, your brand, your way of working."
      />
      <BusinessForm />
    </>
  );
}

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about our personalised greeting cards.",
};

export default async function FAQPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl text-sand-800 mb-10">
        Frequently asked questions
      </h1>
      <div className="space-y-8">
        {faqs.map((faq) => (
          <div key={faq.id}>
            <h2 className="font-medium text-sand-800 mb-2">{faq.question}</h2>
            <p className="text-sand-600">{faq.answer}</p>
          </div>
        ))}
        {faqs.length === 0 && (
          <p className="text-sand-500">
            No FAQs yet. Add some in the admin dashboard.
          </p>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { Calculator, ShieldCheck } from "lucide-react";
import { clonePricingCategories } from "../../lib/pricing-content";

const Pricing = () => {
  const categories = clonePricingCategories();
  const totalServices = categories.reduce(
    (runningTotal, category) => runningTotal + category.services.length,
    0
  );

  return (
    <div className="min-h-screen bg-[#f6f7f4] p-6 pt-24">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-green-800">
                Pricing Engine
              </p>
              <h1 className="text-3xl font-semibold text-gray-900">
                YardHero pricing rules
              </h1>
              <p className="max-w-3xl text-sm text-gray-600">
                Customer pricing is now controlled by the platform calculator, not by a flat-price editor. Square-foot services charge the higher of the minimum price or the rate calculation. Mulching uses cubic-yard depth logic with a 5-yard minimum. Fixed-price services stay flat.
              </p>
            </div>

            <div className="rounded-xl border border-green-100 bg-green-50 px-5 py-4 text-sm text-green-800">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                No negotiation workflow
              </div>
              <p className="mt-2">
                Customers see the price before checkout, and workers are protected by service minimums.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="text-sm text-gray-500">Service Groups</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{categories.length}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="text-sm text-gray-500">Tracked Services</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{totalServices}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="text-sm text-gray-500">Mulch Rule</div>
            <div className="mt-2 text-lg font-semibold text-gray-900">
              5-yard minimum at $120/yard
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {categories.map((category) => (
            <section key={category.id} className="rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{category.subtitle}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-[0.16em] text-gray-500">
                    <tr>
                      <th className="border-b border-gray-200 px-4 py-3 font-medium">Service</th>
                      <th className="border-b border-gray-200 px-4 py-3 font-medium">
                        Pricing Rule
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.services.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="border-b border-gray-200 px-4 py-4 font-medium text-gray-900">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-800">
                              <Calculator className="h-4 w-4" />
                            </div>
                            <span>{service.title}</span>
                          </div>
                        </td>
                        <td className="border-b border-gray-200 px-4 py-4 text-gray-700">
                          {service.pricingRule}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;

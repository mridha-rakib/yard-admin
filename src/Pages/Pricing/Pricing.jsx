import React, { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { adminApi } from "../../lib/api/admin-api";
import { getApiErrorMessage } from "../../lib/api/http";
import {
  BUTTON_VARIANTS,
  ICON_OPTIONS,
  PRICING_CONTENT_KEY,
  clonePricingCategories,
  createEmptyService,
  normalizePricingCategories,
} from "../../lib/pricing-content";

const formatTimestamp = (value) => {
  if (!value) {
    return "Not saved yet";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not saved yet";
  }

  return date.toLocaleString();
};

const Pricing = () => {
  const [categories, setCategories] = useState(() => clonePricingCategories());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadPricingContent = async () => {
      setIsLoading(true);
      setError("");

      try {
        const content = await adminApi.getContentByKey(PRICING_CONTENT_KEY);

        if (!ignore) {
          setCategories(normalizePricingCategories(content?.value?.categories));
          setLastSavedAt(content?.updatedAt || "");
        }
      } catch (apiError) {
        if (ignore) {
          return;
        }

        if (apiError?.response?.status === 404) {
          setCategories(clonePricingCategories());
          setLastSavedAt("");
          return;
        }

        setError(getApiErrorMessage(apiError));
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadPricingContent();

    return () => {
      ignore = true;
    };
  }, []);

  const totalServices = useMemo(
    () => categories.reduce((total, category) => total + category.services.length, 0),
    [categories]
  );

  const updateCategoryField = (categoryId, field, value) => {
    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId ? { ...category, [field]: value } : category
      )
    );
  };

  const updateServiceField = (categoryId, serviceId, field, value) => {
    setCategories((current) =>
      current.map((category) =>
        category.id !== categoryId
          ? category
          : {
              ...category,
              services: category.services.map((service) =>
                service.id === serviceId ? { ...service, [field]: value } : service
              ),
            }
      )
    );
  };

  const handleAddService = (categoryId) => {
    setCategories((current) =>
      current.map((category) =>
        category.id !== categoryId
          ? category
          : {
              ...category,
              services: [...category.services, createEmptyService()],
            }
      )
    );
  };

  const handleRemoveService = (categoryId, serviceId) => {
    setCategories((current) =>
      current.map((category) =>
        category.id !== categoryId
          ? category
          : {
              ...category,
              services: category.services.filter((service) => service.id !== serviceId),
            }
      )
    );
  };

  const handleReset = () => {
    setCategories(clonePricingCategories());
    setError("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      const content = await adminApi.upsertContent(PRICING_CONTENT_KEY, {
        title: "Pricing Services",
        isPublic: true,
        value: {
          categories,
        },
      });

      setCategories(normalizePricingCategories(content?.value?.categories));
      setLastSavedAt(content?.updatedAt || new Date().toISOString());
      message.success("Pricing content saved successfully.");
    } catch (apiError) {
      const nextError = getApiErrorMessage(apiError);
      setError(nextError);
      message.error(nextError);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 mt-16 bg-gray-50">
        <div className="p-10 text-center text-gray-500 bg-white rounded-lg shadow-sm">
          Loading pricing content...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 mt-16 bg-gray-50">
      <div className="mx-auto space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Create and update the pricing cards shown on the website&apos;s
              <span className="font-medium text-gray-900"> /pricing </span>
              page.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4" />
              Restore Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white transition bg-green-700 rounded-lg hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Pricing"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="p-5 bg-white rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Total Services</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{totalServices}</div>
          </div>
          <div className="p-5 bg-white rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Tabs on Frontend</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{categories.length}</div>
          </div>
          <div className="p-5 bg-white rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Last Synced</div>
            <div className="mt-2 text-lg font-semibold text-gray-900">
              {formatTimestamp(lastSavedAt)}
            </div>
          </div>
        </div>

        {error ? (
          <div className="px-4 py-3 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
            {error}
          </div>
        ) : null}

        <div className="space-y-6">
          {categories.map((category) => (
            <section key={category.id} className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col gap-4 pb-6 border-b border-gray-200 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{category.title}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Tab ID: <span className="font-medium text-gray-700">{category.id}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddService(category.id)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-green-700 transition border border-green-200 rounded-lg bg-green-50 hover:bg-green-100"
                >
                  <Plus className="w-4 h-4" />
                  Add Service
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Tab Label
                  </label>
                  <input
                    type="text"
                    value={category.label}
                    onChange={(event) =>
                      updateCategoryField(category.id, "label", event.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={category.title}
                    onChange={(event) =>
                      updateCategoryField(category.id, "title", event.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={category.subtitle}
                    onChange={(event) =>
                      updateCategoryField(category.id, "subtitle", event.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-6 xl:grid-cols-2">
                {category.services.length === 0 ? (
                  <div className="px-4 py-10 text-sm text-center text-gray-500 border border-dashed border-gray-300 rounded-lg xl:col-span-2">
                    No services in this section yet.
                  </div>
                ) : null}

                {category.services.map((service, index) => (
                  <article
                    key={service.id}
                    className="p-5 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-gray-900">
                        Service {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(category.id, service.id)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-red-600 transition hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Service Title
                        </label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(event) =>
                            updateServiceField(
                              category.id,
                              service.id,
                              "title",
                              event.target.value
                            )
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={service.price}
                          onChange={(event) =>
                            updateServiceField(
                              category.id,
                              service.id,
                              "price",
                              Number(event.target.value || 0)
                            )
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={service.duration}
                          onChange={(event) =>
                            updateServiceField(
                              category.id,
                              service.id,
                              "duration",
                              event.target.value
                            )
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Icon
                        </label>
                        <select
                          value={service.icon}
                          onChange={(event) =>
                            updateServiceField(
                              category.id,
                              service.id,
                              "icon",
                              event.target.value
                            )
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
                        >
                          {ICON_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={service.buttonText}
                          onChange={(event) =>
                            updateServiceField(
                              category.id,
                              service.id,
                              "buttonText",
                              event.target.value
                            )
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Button Variant
                        </label>
                        <select
                          value={service.buttonVariant}
                          onChange={(event) =>
                            updateServiceField(
                              category.id,
                              service.id,
                              "buttonVariant",
                              event.target.value
                            )
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
                        >
                          {BUTTON_VARIANTS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          rows="4"
                          value={service.description}
                          onChange={(event) =>
                            updateServiceField(
                              category.id,
                              service.id,
                              "description",
                              event.target.value
                            )
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
